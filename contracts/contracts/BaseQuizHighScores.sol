// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract BaseQuizHighScores {
    error ScoreTooHigh(uint256 submitted, uint256 maxAllowed);
    error NicknameTooLong(uint256 suppliedLength, uint256 maxAllowed);
    error InvalidMaxScore();

    struct PlayerRecord {
        uint64 bestScore;
        uint64 lastScore;
        uint40 plays;
        uint64 lastPlayedAt;
        string nickname;
    }

    uint256 public immutable maxScore;
    mapping(address => PlayerRecord) private records;

    event GamePlayed(
        address indexed player,
        uint256 score,
        uint256 bestScore,
        uint256 plays,
        uint256 timestamp
    );

    event HighScoreSet(
        address indexed player,
        uint256 score,
        string nickname,
        uint256 plays,
        uint256 timestamp
    );

    constructor(uint256 _maxScore) {
        if (_maxScore == 0) revert InvalidMaxScore();
        maxScore = _maxScore;
    }

    function submitScore(uint256 score, string calldata nickname) external {
        if (score > maxScore) revert ScoreTooHigh(score, maxScore);
        if (bytes(nickname).length > 24) {
            revert NicknameTooLong(bytes(nickname).length, 24);
        }

        PlayerRecord storage record = records[msg.sender];
        record.plays += 1;
        record.lastScore = uint64(score);
        record.lastPlayedAt = uint64(block.timestamp);

        bool shouldEmitHighScore = false;

        if (score > record.bestScore) {
            record.bestScore = uint64(score);
            shouldEmitHighScore = true;
        }

        if (bytes(nickname).length > 0 && score >= record.bestScore) {
            record.nickname = nickname;
            shouldEmitHighScore = true;
        }

        emit GamePlayed(
            msg.sender,
            score,
            record.bestScore,
            record.plays,
            block.timestamp
        );

        if (shouldEmitHighScore) {
            emit HighScoreSet(
                msg.sender,
                record.bestScore,
                record.nickname,
                record.plays,
                block.timestamp
            );
        }
    }

    function getPlayerRecord(address player)
        external
        view
        returns (
            uint256 bestScore,
            uint256 lastScore,
            uint256 plays,
            uint256 lastPlayedAt,
            string memory nickname
        )
    {
        PlayerRecord storage record = records[player];
        return (
            record.bestScore,
            record.lastScore,
            record.plays,
            record.lastPlayedAt,
            record.nickname
        );
    }
}
