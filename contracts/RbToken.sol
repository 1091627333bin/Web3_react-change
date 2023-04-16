//SPDX-License-Identifier:GPL-3.0
//源码遵循协议， MIT...

pragma solidity >=0.4.16 <0.9.0; //限定solidity编译器版本
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract RbToken {
    using SafeMath for uint256;
    string public name = "RbToken"; //自动生成getter方法
    string public symbol = "RBT"; //货币符号
    uint256 public decimals = 18; //单位
    uint256 public totalSupply; //总额
    mapping(address => uint256) public balanceOf; //余额
    
    mapping(address =>mapping(address => uint256)) public allowance;//第一个address为账户地址，第二个address为交易所地址

    constructor() {
        totalSupply = 1000000 * (10**decimals);
        balanceOf[msg.sender] = totalSupply;
    }

    event Transfer(address indexed _from,address indexed _to,uint256 _value);
    event Approval(address indexed _owner,address indexed _spender,uint256 _value);

    function transfer(address _to, uint256 _value) public returns (bool success){
        require(_to!=address(0));
        _transfer(msg.sender,_to,_value);
        
        return true;        
    }

    function _transfer( address _from,address _to, uint256 _value) internal {
        require(balanceOf[_from] >= _value);
        balanceOf[_from] = balanceOf[_from].sub(_value);
        balanceOf[_to] = balanceOf[_to].add(_value);
        //触发事件
        emit Transfer(_from,_to,_value);
    }

    function approve(address _spender,uint256 _value) public returns(bool success) {
        //msg.sender是当前网页登陆的账号 _spender是第三方交易所的账号地址 _value是转账数
        // require(balanceOf[msg.sender] >= _value);
        require(_spender!=address(0));
        allowance[msg.sender][_spender]=_value;
        emit Approval(msg.sender,_spender,_value);
        return true;
    }
    //RbToken(_token).transferFrom(msg.sender,address(this),_amount)
    function transferFrom(address _from,address _to,uint256 _value)public returns(bool success) {
        require(balanceOf[_from] >= _value);
        require(allowance[_from][msg.sender] >= _value);
        allowance[_from][msg.sender] = allowance[_from][msg.sender].sub(_value);
        _transfer(_from,_to,_value);
        return true;
    }
}
