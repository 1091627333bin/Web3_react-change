//SPDX-License-Identifier:GPL-3.0
//源码遵循协议， MIT...

pragma solidity >=0.4.16 <0.9.0;//限定solidity编译器版本

contract StudentStorage{
    uint age;  //状态变量
    string name;
// struct string 动态数组 映射 需要加memory 或calldata(不进行修改)节省燃料费
    function setData(uint _age,string memory _name) public{
        age = _age;
        name = _name;
    }

// view(视图函数，只访问不修改状态) pure(纯函数，不访问也不修改) 节省燃料费
    function getData() public view returns(string memory,uint) {
        return(name,age);
    }
}

//truffle compile编译
//truffle migrate 编译并上传到链
//truffle console 测试
//truffle exec 脚本执行器