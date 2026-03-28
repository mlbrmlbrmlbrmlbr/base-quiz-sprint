const { expect } = require('chai');
const { ethers } = require('hardhat');
const { anyValue } = require('@nomicfoundation/hardhat-chai-matchers/withArgs');

describe('BaseQuizHighScores', function () {
  async function deployFixture() {
    const Factory = await ethers.getContractFactory('BaseQuizHighScores');
    const quiz = await Factory.deploy(1000);
    await quiz.waitForDeployment();

    const [owner, alice] = await ethers.getSigners();
    return { quiz, owner, alice };
  }

  it('stores a first score and nickname', async function () {
    const { quiz, owner } = await deployFixture();

    await expect(quiz.submitScore(700, 'Builder'))
      .to.emit(quiz, 'HighScoreSet')
      .withArgs(owner.address, 700, 'Builder', 1, anyValue);

    const record = await quiz.getPlayerRecord(owner.address);
    expect(record.bestScore).to.equal(700);
    expect(record.lastScore).to.equal(700);
    expect(record.plays).to.equal(1);
    expect(record.nickname).to.equal('Builder');
  });

  it('keeps the old high score when a lower score is submitted', async function () {
    const { quiz, owner } = await deployFixture();

    await quiz.submitScore(900, 'FastLane');
    await expect(quiz.submitScore(500, 'SlowLane')).to.not.emit(quiz, 'HighScoreSet');

    const record = await quiz.getPlayerRecord(owner.address);
    expect(record.bestScore).to.equal(900);
    expect(record.lastScore).to.equal(500);
    expect(record.plays).to.equal(2);
    expect(record.nickname).to.equal('FastLane');
  });

  it('lets a player update nickname on a tied best score', async function () {
    const { quiz, alice } = await deployFixture();

    await quiz.connect(alice).submitScore(800, 'Alpha');
    await expect(quiz.connect(alice).submitScore(800, 'Bravo'))
      .to.emit(quiz, 'HighScoreSet')
      .withArgs(alice.address, 800, 'Bravo', 2, anyValue);

    const record = await quiz.getPlayerRecord(alice.address);
    expect(record.bestScore).to.equal(800);
    expect(record.nickname).to.equal('Bravo');
  });

  it('rejects scores above maxScore', async function () {
    const { quiz } = await deployFixture();
    await expect(quiz.submitScore(1001, 'Nope')).to.be.revertedWithCustomError(
      quiz,
      'ScoreTooHigh'
    );
  });

  it('rejects long nicknames', async function () {
    const { quiz } = await deployFixture();
    await expect(quiz.submitScore(500, 'nickname-that-is-way-too-long'))
      .to.be.revertedWithCustomError(quiz, 'NicknameTooLong');
  });
});
