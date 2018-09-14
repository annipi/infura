pragma solidity ^0.4.23;

contract Suggestion {
    address private owner;
    mapping(address => User) private users;
    address[] private addresses;

    event suggestionAdded(address user, string hash);

    struct User {
        string name;
        string hash;
    }

    modifier onlyOwner () {
        require(msg.sender == owner);
        _;
    }

    constructor () public {
        owner = msg.sender;
    }

    function addSuggestion(string _name, string _hash) public {
        users[msg.sender] = User({name : _name, hash : _hash});
        bool insert = true;
        for (uint i = 0; i < addresses.length; i++) {
            if (addresses[i] == msg.sender) {
                insert = false;
                break;
            }
        }
        if (insert) {
            addresses.push(msg.sender);
        }
        emit suggestionAdded(msg.sender, _hash);
    }

    function getHash() public view returns (string) {
        return users[msg.sender].hash;
    }

    function getAddresses() public view onlyOwner returns (address[]) {
        return addresses;
    }

    function getSuggestionByAddress(address _user) public view onlyOwner returns (string name, string hash) {
        User memory user = users[_user];
        name = user.name;
        hash = user.hash;
    }

    function isOwner() public view returns (bool) {
        return msg.sender == owner;
    }
}