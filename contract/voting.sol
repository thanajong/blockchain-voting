// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ClassLeaderVoting {
    address public currentPresident;
    uint public electionEndTime;
    
    mapping(address => bool) public hasVoted;
    mapping(address => bool) public students;
    address[] public candidates;
    mapping(address => uint) public votes;

    event Voted(address voter, address candidate);
    event PresidentElected(address president);

    modifier onlyStudent() {
        require(students[msg.sender], "You are not a student.");
        _;
    }

    modifier hasNotVoted() {
        require(!hasVoted[msg.sender], "You have already voted.");
        _;
    }

    modifier electionActive() {
        require(block.timestamp < electionEndTime, "Election period has ended.");
        _;
    }

    constructor(address[] memory _students, uint _electionDuration) {
        for (uint i = 0; i < _students.length; i++) {
            students[_students[i]] = true;
        }
        electionEndTime = block.timestamp + _electionDuration;
    }

    function addCandidate(address _candidate) public onlyStudent {
        candidates.push(_candidate);
    }

    function vote(address _candidate) public onlyStudent hasNotVoted electionActive {
        require(isCandidate(_candidate), "Not a valid candidate.");
        votes[_candidate]++;
        hasVoted[msg.sender] = true;
        emit Voted(msg.sender, _candidate);
    }

    function declareWinner() public {
        require(block.timestamp >= electionEndTime, "Election period is still active.");
        address winner = getWinner();
        currentPresident = winner;
        emit PresidentElected(winner);
    }

    function getWinner() public view returns (address) {
        address winner;
        uint highestVotes = 0;
        for (uint i = 0; i < candidates.length; i++) {
            if (votes[candidates[i]] > highestVotes) {
                highestVotes = votes[candidates[i]];
                winner = candidates[i];
            }
        }
        return winner;
    }

    function isCandidate(address _candidate) public view returns (bool) {
        for (uint i = 0; i < candidates.length; i++) {
            if (candidates[i] == _candidate) {
                return true;
            }
        }
        return false;
    }

    function getCandidates() public view returns (address[] memory) {
        return candidates;
    }
}
