pragma solidity ^0.4.17;
// linter warnings (red underline) about pragma version can igonored!

// contract code will go here
contract Inbox {
    string public message;

    function Inbox(string initalMessage) public{
        message = initalMessage;
    }

    function setMessage(string newMessage) public{
        message = newMessage;
    }
}