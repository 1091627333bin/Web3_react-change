const RbToken = artifacts.require("RbToken.sol")

module.exports = async function(callback){
    const rbToken = await RbToken.deployed()
    let from = "0x047bfF18820e6f13feCFCF69B9d946250aFAF010"
    let to = "0x990b679EC258111ca78135BD07713280a019542F"
    let result1 = await rbToken.balanceOf(from)
    console.log(web3.utils.fromWei(result1,"ether"));

    await rbToken.transfer(to,web3.utils.toWei("10000","ether"),{
        from:from
    })
    result1 = await rbToken.balanceOf(from)
    
    let result2 = await rbToken.balanceOf(to)
    console.log(web3.utils.fromWei(result1,"ether"),web3.utils.fromWei(result2,"ether"));
    callback()
}