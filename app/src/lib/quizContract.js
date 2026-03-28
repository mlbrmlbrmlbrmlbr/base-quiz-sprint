export const QUIZ_ABI = [
  {
    type: 'constructor',
    inputs: [{ name: '_maxScore', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'getPlayerRecord',
    inputs: [{ name: 'player', type: 'address', internalType: 'address' }],
    outputs: [
      { name: 'bestScore', type: 'uint256', internalType: 'uint256' },
      { name: 'lastScore', type: 'uint256', internalType: 'uint256' },
      { name: 'plays', type: 'uint256', internalType: 'uint256' },
      { name: 'lastPlayedAt', type: 'uint256', internalType: 'uint256' },
      { name: 'nickname', type: 'string', internalType: 'string' }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'maxScore',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'submitScore',
    inputs: [
      { name: 'score', type: 'uint256', internalType: 'uint256' },
      { name: 'nickname', type: 'string', internalType: 'string' }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'event',
    name: 'GamePlayed',
    anonymous: false,
    inputs: [
      { name: 'player', type: 'address', indexed: true, internalType: 'address' },
      { name: 'score', type: 'uint256', indexed: false, internalType: 'uint256' },
      { name: 'bestScore', type: 'uint256', indexed: false, internalType: 'uint256' },
      { name: 'plays', type: 'uint256', indexed: false, internalType: 'uint256' },
      { name: 'timestamp', type: 'uint256', indexed: false, internalType: 'uint256' }
    ]
  },
  {
    type: 'event',
    name: 'HighScoreSet',
    anonymous: false,
    inputs: [
      { name: 'player', type: 'address', indexed: true, internalType: 'address' },
      { name: 'score', type: 'uint256', indexed: false, internalType: 'uint256' },
      { name: 'nickname', type: 'string', indexed: false, internalType: 'string' },
      { name: 'plays', type: 'uint256', indexed: false, internalType: 'uint256' },
      { name: 'timestamp', type: 'uint256', indexed: false, internalType: 'uint256' }
    ]
  }
];

export const QUIZ_CONTRACT_ADDRESS = import.meta.env.VITE_QUIZ_CONTRACT_ADDRESS || '';
export const QUIZ_START_BLOCK = import.meta.env.VITE_QUIZ_START_BLOCK
  ? BigInt(import.meta.env.VITE_QUIZ_START_BLOCK)
  : undefined;
export const QUIZ_CHAIN_ID = Number(import.meta.env.VITE_QUIZ_CHAIN_ID || 84532);
export const QUIZ_NAME = import.meta.env.VITE_QUIZ_NAME || 'Base Quiz Sprint';
export const APP_URL = import.meta.env.VITE_APP_URL || 'https://your-project.github.io/base-quiz-sprint/';
export const BUILDER_CODE = import.meta.env.VITE_BUILDER_CODE || '';
