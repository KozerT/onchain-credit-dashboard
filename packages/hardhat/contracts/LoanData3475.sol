// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract LoanData3475 {
    struct Loan {
        string uri;
        bool active;
    }
    mapping(uint256 => mapping(uint256 => Loan)) public loans; // classId -> nonceId -> Loan
    address public admin;

    event LoanCreated(uint256 classId,uint256 nonceId,string uri);
    event LoanStatusChanged(uint256 classId,uint256 nonceId,bool active);

    constructor(){ admin=msg.sender; }

    modifier onlyAdmin(){ require(msg.sender==admin,"not admin"); _; }

    function createLoan(uint256 classId,uint256 nonceId,string memory uri) external onlyAdmin {
        loans[classId][nonceId] = Loan(uri,true);
        emit LoanCreated(classId,nonceId,uri);
    }
    function setStatus(uint256 classId,uint256 nonceId,bool active) external onlyAdmin {
        loans[classId][nonceId].active = active;
        emit LoanStatusChanged(classId,nonceId,active);
    }
    function getLoan(uint256 classId,uint256 nonceId) external view returns(string memory,bool){
        Loan storage l = loans[classId][nonceId];
        return (l.uri,l.active);
    }
}