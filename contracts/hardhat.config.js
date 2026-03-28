require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

const {
  PRIVATE_KEY,
  BASE_RPC_URL,
  BASE_SEPOLIA_RPC_URL,
  ETHERSCAN_API_KEY
} = process.env;

const sharedAccounts = PRIVATE_KEY ? [PRIVATE_KEY] : [];

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: '0.8.24',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {},
    baseSepolia: {
      url: BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org',
      accounts: sharedAccounts,
      chainId: 84532
    },
    base: {
      url: BASE_RPC_URL || 'https://mainnet.base.org',
      accounts: sharedAccounts,
      chainId: 8453
    }
  },
  etherscan: {
    apiKey: {
      base: ETHERSCAN_API_KEY || '',
      baseSepolia: ETHERSCAN_API_KEY || ''
    }
  }
};
