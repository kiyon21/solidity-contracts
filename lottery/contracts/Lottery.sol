pragma solidity ^0.4.17;
// linter warnings (red underline) about pragma version can igonored!

// contract code will go here
contract Lottery {
    // address of manager that can pick winner
    address public manager;

    // dynamic array of player addresses
    address [] public players;
    
    function Lottery() public {
       manager = msg.sender; 
    }

    function enterLottery() public payable{
        // requires payment 
        require(msg.value > .001 ether);

        // add player to lottery
        players.push(msg.sender);
    }

    function random() public view returns (uint) {

        // Pseudo random number generator using block difficulty, current time and address of players
        return uint(keccak256(block.difficulty, now, players));
    }

    function pickWinner() public restricted{

        uint index = random() % players.length;
        players[index].transfer(this.balance);
        players = new address[](0);
    }
    // function modifier to check if sender is manager
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function getPlayers() public view returns (address[]) {
        return players;
    }

}