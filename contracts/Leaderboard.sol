// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title BASE TAP 1986 — onchain leaderboard
/// @notice Submit your best score; only higher scores are stored.
contract Leaderboard {
    event ScoreSubmitted(address indexed player, uint256 score);

    mapping(address => uint256) public bestScore;

    function submitScore(uint256 score) external {
        require(score > bestScore[msg.sender], "Score not higher than current best");
        bestScore[msg.sender] = score;
        emit ScoreSubmitted(msg.sender, score);
    }
}
