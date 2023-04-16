//SPDX-License-Identifier:GPL-3.0
//源码遵循协议， MIT...
pragma solidity >=0.4.16 <0.9.0; //限定solidity编译器版本
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./RbToken.sol";

contract Exchange {
    using SafeMath for uint256;
    address public feeAccount;//交易所收费账号地址
    uint256 public feePercent;//费率
    address constant ETHER = address(0);
    mapping(address=>mapping(address=>uint256)) public tokens;//第一个addrss为货币地址 第二个address为用户地址


    //订单结构体
    struct _Order{
        uint256 id;
        address user;
        address tokenGet;
        uint256 amountGet;
        address tokenGive;
        uint256 amountGive;
        uint256 timestamp;
    }
    // _Order[] public OrderList;
    mapping(uint256=>_Order) public orders;
    mapping(uint256=>bool) public orderCancel;
    mapping(uint256=>bool) public orderFill;
    uint256 public orderCount;
    constructor(address _feeAccount,uint256 _feePercent){
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    event Deposit(address token,address user,uint256 amount,uint256 balance);
    event Withdraw(address token,address user,uint256 amount,uint256 balance);
    event Order(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 timestamp);
        
        event Cancel(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 timestamp);

        event Trade(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 timestamp);

    //存以太币
    function depositEther()payable public{
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].add(msg.value);
        emit Deposit(ETHER,msg.sender,msg.value,tokens[ETHER][msg.sender]);
    }

    //存其他货币
    function depositToken(address _token,uint256 _amount)public{
        require(_token != ETHER);
        //调用某个方式强行从你账户往交易所账户转钱
        require(RbToken(_token).transferFrom(msg.sender,address(this),_amount));//address(this)是合约地址
        tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_amount);
        emit Deposit(_token,msg.sender,_amount,tokens[_token][msg.sender]);
    }
    //提取以太币
    function withdrawEther(uint256 _amount) public{
        require(_amount <= tokens[ETHER][msg.sender]);
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].sub(_amount);
        payable(msg.sender).transfer(_amount);
        emit Withdraw(ETHER,msg.sender,_amount,tokens[ETHER][msg.sender]);
    } 
    //提取其他货币
    function withdrawToken(address _token,uint256 _amount) public{
        require(_token != ETHER);
        require(_amount <= tokens[_token][msg.sender]);
        
        tokens[_token][msg.sender] = tokens[_token][msg.sender].sub(_amount);
        
        require(RbToken(_token).transfer(msg.sender,_amount));

        emit Withdraw(_token,msg.sender,_amount,tokens[_token][msg.sender]);
    }
    //查余额
    function balanceOf(address _token,address _user) public view returns(uint256){
        return tokens[_token][_user];
    }

    function makeOrder(address _tokenGet,uint256 _amountGet,address _tokenGive,uint256 _amountGive)public{
        require(tokens[_tokenGive][msg.sender]>= _amountGive);
        orderCount = orderCount.add(1);
        orders[orderCount] = _Order(orderCount,msg.sender,_tokenGet,
        _amountGet,_tokenGive,_amountGive,block.timestamp);
        emit Order(orderCount,msg.sender,_tokenGet, _amountGet,_tokenGive,_amountGive,block.timestamp);
    }

    function cancelOrder(uint256 _id) public {
        _Order memory myorder = orders[_id];
        require(myorder.id == _id);
        orderCancel[_id] = true;

        emit Cancel(myorder.id,msg.sender,myorder.tokenGet,myorder.amountGet,myorder.tokenGive,myorder.amountGive,
        block.timestamp);
    }

    function fillOrder(uint256 _id) public {
        _Order memory myorder = orders[_id];
        require(myorder.id == _id);
        

        uint256 feeAmout = myorder.amountGet.mul(feePercent).div(100);
        // require(tokens[_tokenGive][msg.sender]>=_amountGive)
        require(tokens[myorder.tokenGive][myorder.user]>= myorder.amountGive);
        require(tokens[myorder.tokenGet][msg.sender]>= myorder.amountGet.add(feeAmout));

        tokens[myorder.tokenGet][feeAccount] = tokens[myorder.tokenGet][feeAccount].add(feeAmout);

        tokens[myorder.tokenGet][msg.sender] = tokens[myorder.tokenGet][msg.sender].sub(myorder.amountGet.add(feeAmout));
        tokens[myorder.tokenGet][myorder.user] = tokens[myorder.tokenGet][myorder.user].add(myorder.amountGet);

        tokens[myorder.tokenGive][msg.sender] = tokens[myorder.tokenGive][msg.sender].add(myorder.amountGive);
        tokens[myorder.tokenGive][myorder.user] = tokens[myorder.tokenGive][myorder.user].sub(myorder.amountGive);

        orderFill[_id] = true;
        emit Trade(myorder.id,myorder.user,myorder.tokenGet,myorder.amountGet,myorder.tokenGive,myorder.amountGive,
        block.timestamp);
    }
}
