const hre = require('hardhat');

async function main() {
  const maxScore = Number(process.env.MAX_SCORE || 1000);
  if (!Number.isInteger(maxScore) || maxScore <= 0) {
    throw new Error('MAX_SCORE must be a positive integer');
  }

  const QuizFactory = await hre.ethers.getContractFactory('BaseQuizHighScores');
  const quiz = await QuizFactory.deploy(maxScore);
  await quiz.waitForDeployment();

  const address = await quiz.getAddress();
  const deploymentTx = quiz.deploymentTransaction();
  const receipt = deploymentTx ? await deploymentTx.wait() : null;

  console.log('BaseQuizHighScores deployed');
  console.log('network      :', hre.network.name);
  console.log('address      :', address);
  console.log('maxScore     :', maxScore);
  console.log('startBlock   :', receipt?.blockNumber ?? 'unknown');

  console.log('\nAdd these values to app/.env.local:');
  console.log(`VITE_QUIZ_CONTRACT_ADDRESS=${address}`);
  console.log(`VITE_QUIZ_START_BLOCK=${receipt?.blockNumber ?? ''}`);
  console.log(`VITE_QUIZ_CHAIN_ID=${hre.network.name === 'base' ? 8453 : 84532}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
