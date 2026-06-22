// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title SatyaVote
 * @notice Transparent, tamper-proof, time-locked voting on Ethereum.
 *         Ek Vote, Ek Sach — One Vote, One Truth.
 *
 * Design:
 *  - The deployer is the admin (owner) of the platform.
 *  - Admin approves voters (whitelist), creates elections, adds candidates,
 *    and controls the time window of each election.
 *  - Each approved voter may cast exactly one vote per election.
 *  - Votes are counted on-chain and are immutable once cast.
 *  - Every meaningful action emits an event for off-chain indexing/audit.
 */
contract SatyaVote {
    // ----------------------------------------------------------------------
    // Types
    // ----------------------------------------------------------------------

    struct Candidate {
        uint256 id;
        string name;
        string party;
        string tagline;
        string imageURI;
        uint256 voteCount;
    }

    struct Election {
        uint256 id;
        string title;
        string organization;
        string electionType; // "country" | "state" | "panchayat" | "school"
        uint256 startTime; // unix seconds
        uint256 endTime; // unix seconds
        bool exists;
        bool resultsDeclared;
        uint256 candidateCount;
        uint256 totalVotes;
    }

    // ----------------------------------------------------------------------
    // Storage
    // ----------------------------------------------------------------------

    address public admin;
    uint256 public electionCount;

    // electionId => Election
    mapping(uint256 => Election) private elections;
    // electionId => candidateId => Candidate
    mapping(uint256 => mapping(uint256 => Candidate)) private candidates;
    // voter => approved?
    mapping(address => bool) public isApprovedVoter;
    // electionId => voter => hasVoted?
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    // electionId => voter => candidateId voted for (0 if none)
    mapping(uint256 => mapping(address => uint256)) public votedFor;

    uint256 public approvedVoterCount;

    // ----------------------------------------------------------------------
    // Events
    // ----------------------------------------------------------------------

    event AdminTransferred(address indexed previousAdmin, address indexed newAdmin);
    event VoterApproved(address indexed voter);
    event VoterRevoked(address indexed voter);
    event ElectionCreated(
        uint256 indexed electionId,
        string title,
        string organization,
        string electionType,
        uint256 startTime,
        uint256 endTime
    );
    event CandidateAdded(
        uint256 indexed electionId,
        uint256 indexed candidateId,
        string name,
        string party
    );
    event ElectionScheduleUpdated(uint256 indexed electionId, uint256 startTime, uint256 endTime);
    event VoteCast(uint256 indexed electionId, address indexed voter, uint256 indexed candidateId);
    event ResultsDeclared(uint256 indexed electionId, uint256 winningCandidateId, uint256 winningVoteCount);

    // ----------------------------------------------------------------------
    // Modifiers
    // ----------------------------------------------------------------------

    modifier onlyAdmin() {
        require(msg.sender == admin, "SatyaVote: caller is not admin");
        _;
    }

    modifier electionExists(uint256 electionId) {
        require(elections[electionId].exists, "SatyaVote: election does not exist");
        _;
    }

    // ----------------------------------------------------------------------
    // Constructor
    // ----------------------------------------------------------------------

    constructor() {
        admin = msg.sender;
        // The admin is implicitly allowed to participate as an approved voter.
        isApprovedVoter[msg.sender] = true;
        approvedVoterCount = 1;
        emit AdminTransferred(address(0), msg.sender);
        emit VoterApproved(msg.sender);
    }

    // ----------------------------------------------------------------------
    // Admin: role management
    // ----------------------------------------------------------------------

    function transferAdmin(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "SatyaVote: zero address");
        emit AdminTransferred(admin, newAdmin);
        admin = newAdmin;
    }

    // ----------------------------------------------------------------------
    // Admin: voter whitelist
    // ----------------------------------------------------------------------

    function approveVoter(address voter) public onlyAdmin {
        require(voter != address(0), "SatyaVote: zero address");
        require(!isApprovedVoter[voter], "SatyaVote: already approved");
        isApprovedVoter[voter] = true;
        approvedVoterCount += 1;
        emit VoterApproved(voter);
    }

    function approveVoters(address[] calldata voters) external onlyAdmin {
        for (uint256 i = 0; i < voters.length; i++) {
            if (voters[i] != address(0) && !isApprovedVoter[voters[i]]) {
                isApprovedVoter[voters[i]] = true;
                approvedVoterCount += 1;
                emit VoterApproved(voters[i]);
            }
        }
    }

    function revokeVoter(address voter) external onlyAdmin {
        require(isApprovedVoter[voter], "SatyaVote: not approved");
        isApprovedVoter[voter] = false;
        approvedVoterCount -= 1;
        emit VoterRevoked(voter);
    }

    // ----------------------------------------------------------------------
    // Admin: elections & candidates
    // ----------------------------------------------------------------------

    function createElection(
        string calldata title,
        string calldata organization,
        string calldata electionType,
        uint256 startTime,
        uint256 endTime
    ) external onlyAdmin returns (uint256 electionId) {
        require(bytes(title).length > 0, "SatyaVote: empty title");
        require(endTime > startTime, "SatyaVote: end must be after start");
        require(endTime > block.timestamp, "SatyaVote: end in the past");

        electionCount += 1;
        electionId = electionCount;

        Election storage e = elections[electionId];
        e.id = electionId;
        e.title = title;
        e.organization = organization;
        e.electionType = electionType;
        e.startTime = startTime;
        e.endTime = endTime;
        e.exists = true;

        emit ElectionCreated(electionId, title, organization, electionType, startTime, endTime);
    }

    function addCandidate(
        uint256 electionId,
        string calldata name,
        string calldata party,
        string calldata tagline,
        string calldata imageURI
    ) external onlyAdmin electionExists(electionId) returns (uint256 candidateId) {
        require(bytes(name).length > 0, "SatyaVote: empty name");
        Election storage e = elections[electionId];
        require(block.timestamp < e.startTime || e.candidateCount == 0 || block.timestamp < e.endTime, "SatyaVote: election ended");

        e.candidateCount += 1;
        candidateId = e.candidateCount;

        Candidate storage c = candidates[electionId][candidateId];
        c.id = candidateId;
        c.name = name;
        c.party = party;
        c.tagline = tagline;
        c.imageURI = imageURI;

        emit CandidateAdded(electionId, candidateId, name, party);
    }

    function updateSchedule(
        uint256 electionId,
        uint256 startTime,
        uint256 endTime
    ) external onlyAdmin electionExists(electionId) {
        require(endTime > startTime, "SatyaVote: end must be after start");
        Election storage e = elections[electionId];
        require(!e.resultsDeclared, "SatyaVote: results declared");
        e.startTime = startTime;
        e.endTime = endTime;
        emit ElectionScheduleUpdated(electionId, startTime, endTime);
    }

    /// @notice Admin convenience to start an election now (sets start to current block time).
    function startElectionNow(uint256 electionId) external onlyAdmin electionExists(electionId) {
        Election storage e = elections[electionId];
        require(!e.resultsDeclared, "SatyaVote: results declared");
        e.startTime = block.timestamp;
        if (e.endTime <= block.timestamp) {
            e.endTime = block.timestamp + 1 days;
        }
        emit ElectionScheduleUpdated(electionId, e.startTime, e.endTime);
    }

    /// @notice Admin convenience to end an election now (sets end to current block time).
    function endElectionNow(uint256 electionId) external onlyAdmin electionExists(electionId) {
        Election storage e = elections[electionId];
        e.endTime = block.timestamp;
        emit ElectionScheduleUpdated(electionId, e.startTime, e.endTime);
    }

    // ----------------------------------------------------------------------
    // Voting
    // ----------------------------------------------------------------------

    function castVote(uint256 electionId, uint256 candidateId)
        external
        electionExists(electionId)
    {
        Election storage e = elections[electionId];
        require(isApprovedVoter[msg.sender], "SatyaVote: voter not approved");
        require(block.timestamp >= e.startTime, "SatyaVote: election not started");
        require(block.timestamp <= e.endTime, "SatyaVote: election ended");
        require(!hasVoted[electionId][msg.sender], "SatyaVote: already voted");
        require(candidateId > 0 && candidateId <= e.candidateCount, "SatyaVote: invalid candidate");

        hasVoted[electionId][msg.sender] = true;
        votedFor[electionId][msg.sender] = candidateId;
        candidates[electionId][candidateId].voteCount += 1;
        e.totalVotes += 1;

        emit VoteCast(electionId, msg.sender, candidateId);
    }

    /// @notice Anyone can declare results once the election window has ended. Idempotent.
    function declareResults(uint256 electionId)
        external
        electionExists(electionId)
        returns (uint256 winningCandidateId, uint256 winningVoteCount)
    {
        Election storage e = elections[electionId];
        require(block.timestamp > e.endTime, "SatyaVote: election not ended");
        require(!e.resultsDeclared, "SatyaVote: already declared");

        (winningCandidateId, winningVoteCount) = _computeWinner(electionId);
        e.resultsDeclared = true;
        emit ResultsDeclared(electionId, winningCandidateId, winningVoteCount);
    }

    // ----------------------------------------------------------------------
    // Views
    // ----------------------------------------------------------------------

    function getElection(uint256 electionId)
        external
        view
        electionExists(electionId)
        returns (Election memory)
    {
        return elections[electionId];
    }

    function getElections() external view returns (Election[] memory list) {
        list = new Election[](electionCount);
        for (uint256 i = 1; i <= electionCount; i++) {
            list[i - 1] = elections[i];
        }
    }

    function getCandidate(uint256 electionId, uint256 candidateId)
        external
        view
        electionExists(electionId)
        returns (Candidate memory)
    {
        require(candidateId > 0 && candidateId <= elections[electionId].candidateCount, "SatyaVote: invalid candidate");
        return candidates[electionId][candidateId];
    }

    function getCandidates(uint256 electionId)
        external
        view
        electionExists(electionId)
        returns (Candidate[] memory list)
    {
        uint256 count = elections[electionId].candidateCount;
        list = new Candidate[](count);
        for (uint256 i = 1; i <= count; i++) {
            list[i - 1] = candidates[electionId][i];
        }
    }

    /// @notice Live election status: 0 = upcoming, 1 = live, 2 = ended.
    function getStatus(uint256 electionId)
        public
        view
        electionExists(electionId)
        returns (uint8)
    {
        Election storage e = elections[electionId];
        if (block.timestamp < e.startTime) return 0;
        if (block.timestamp <= e.endTime) return 1;
        return 2;
    }

    function getWinner(uint256 electionId)
        external
        view
        electionExists(electionId)
        returns (uint256 winningCandidateId, uint256 winningVoteCount)
    {
        return _computeWinner(electionId);
    }

    function _computeWinner(uint256 electionId)
        private
        view
        returns (uint256 winningCandidateId, uint256 winningVoteCount)
    {
        uint256 count = elections[electionId].candidateCount;
        for (uint256 i = 1; i <= count; i++) {
            uint256 votes = candidates[electionId][i].voteCount;
            if (votes > winningVoteCount) {
                winningVoteCount = votes;
                winningCandidateId = i;
            }
        }
    }
}