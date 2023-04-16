//SPDX-License-Identifier:GPL-3.0
//源码遵循协议， MIT...

pragma solidity >=0.4.16 <0.9.0;//限定solidity编译器版本

contract StudentListStorage{
    struct Student{
        uint id;
        string name;
        uint age;
    }
    Student[] public StudentList;

    function addList(uint _age,string memory _name) public returns (uint){
        uint count = StudentList.length;
        StudentList.push(Student(count+1,_name,_age));
        return StudentList.length;
    }

    function getList() public view returns(Student[] memory) {
        return StudentList;
    }
}