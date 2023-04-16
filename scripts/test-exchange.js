const RbToken = artifacts.require("RbToken.sol")
const Exchange = artifacts.require("Exchange.sol")

module.exports = async function(callback){
    const rbToken = await RbToken.deployed()
    const exchange = await Exchange.deployed()
    const accounts = await web3.eth.getAccounts()
    await exchange.depositEther({
        from:accounts[0],
        value:web3.utils.toWei("10","ether")
    })
    callback()
}