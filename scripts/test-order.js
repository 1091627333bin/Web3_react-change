const RbToken = artifacts.require("RbToken.sol")
const Exchange = artifacts.require("Exchange.sol")
const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000'

const fromWei = (bn)=>{
    return web3.utils.fromWei(bn,"ether");
}

const toWei = (number)=>{
    return web3.utils.toWei(number.toString(),"ether");
}

const wait =  (second)=>{
    const milliseconds = second * 1000;
    return new Promise((resolve)=>setTimeout(resolve, milliseconds));
}

module.exports = async function(callback){
    const rbToken = await RbToken.deployed()
    const exchange = await Exchange.deployed()
    const accounts = await web3.eth.getAccounts()

    //第一步 向账户2 转10万rbtoken
    await rbToken.transfer(accounts[1],toWei(100000),{
        from:accounts[0],
    })

    //第二步 向交易所 存 10以太币
    await exchange.depositEther({
        from:accounts[0],
        value:toWei(100)
    })
    let result1 = await exchange.balanceOf(ETHER_ADDRESS,accounts[0])
    console.log("account[0]在交易所的以太币",fromWei(result1));

    //第三步 向交易所存100000rbtoken
    await rbToken.approve(exchange.address,toWei(100000),{
        from:accounts[0]
    })
    await exchange.depositToken(rbToken.address,toWei(100000),{
        from:accounts[0]
    })
    let result2 = await exchange.balanceOf(rbToken.address,accounts[0])
    console.log("account[0]在交易所的rbtoken",fromWei(result2));

    //第四步 2账户向交易所 存 50以太币
    await exchange.depositEther({
        from:accounts[1],
        value:toWei(50)
    })
    let result3 = await exchange.balanceOf(ETHER_ADDRESS,accounts[1])
    console.log("account[1]在交易所的以太币",fromWei(result3));

    //第5步 账户2向交易所存50000rbtoken
    await rbToken.approve(exchange.address,toWei(50000),{
        from:accounts[1]
    })
    await exchange.depositToken(rbToken.address,toWei(50000),{
        from:accounts[1]
    })
    let result4 = await exchange.balanceOf(rbToken.address,accounts[1])
    console.log("account[1]在交易所的rbtoken",fromWei(result4));

    let orderId = 0;
    let res;

    //创建订单
    res = await exchange.makeOrder(rbToken.address,toWei(1000),ETHER_ADDRESS,toWei(0.1),{from:accounts[0]})
    orderId = res.logs[0].args.id
    console.log("创建一个订单")
    await wait(1)

    res = await exchange.makeOrder(rbToken.address,toWei(100),ETHER_ADDRESS,toWei(0.1),{from:accounts[0]})
    orderId = res.logs[0].args.id
    console.log("创建一个订单")
    await wait(1)
    

    res = await exchange.makeOrder(rbToken.address,toWei(2000),ETHER_ADDRESS,toWei(0.2),{from:accounts[1]})
    orderId = res.logs[0].args.id
    console.log("创建一个订单")
    await wait(1)

    res = await exchange.makeOrder(rbToken.address,toWei(200),ETHER_ADDRESS,toWei(0.2),{from:accounts[1]})
    orderId = res.logs[0].args.id
    console.log("创建一个订单")
    await wait(1)

    //取消订单
    res = await exchange.makeOrder(rbToken.address,toWei(2000),ETHER_ADDRESS,toWei(0.2),{from:accounts[0]})
    orderId = res.logs[0].args.id
    await exchange.cancelOrder(orderId,{from:accounts[0]})
    console.log("取消一个订单")
    await wait(1)

    //完成订单
    res = await exchange.makeOrder(rbToken.address,toWei(3000),ETHER_ADDRESS,toWei(0.3),{from:accounts[0]})
    orderId = res.logs[0].args.id
    await exchange.fillOrder(orderId,{from:accounts[1]})
    console.log("完成一个订单")
    await wait(1)


     result1 = await exchange.balanceOf(ETHER_ADDRESS,accounts[0])
    console.log("account[0]在交易所的以太币",fromWei(result1));

     result2 = await exchange.balanceOf(rbToken.address,accounts[0])
    console.log("account[0]在交易所的rbtoken",fromWei(result2));

    result3 = await exchange.balanceOf(ETHER_ADDRESS,accounts[1])
    console.log("account[1]在交易所的以太币",fromWei(result3));

     result4 = await exchange.balanceOf(rbToken.address,accounts[1])
    console.log("account[1]在交易所的rbtoken",fromWei(result4));

    callback()
}