export const QUESTION_COUNT = 10;

export const QUESTIONS = [
  {
    id: 'q1',
    category: 'Base',
    prompt: 'Base is best described as…',
    options: [
      'A hardware wallet brand',
      'A Layer 2 network built on Ethereum',
      'A centralized exchange order type',
      'A Bitcoin sidechain created by miners'
    ],
    answer: 1,
    explanation: 'Base is an Ethereum Layer 2 network focused on low-cost, builder-friendly onchain apps.'
  },
  {
    id: 'q2',
    category: 'Payments',
    prompt: 'Which asset is highlighted in Base Pay flows for low-friction payments?',
    options: ['BTC', 'USDC', 'DOGE', 'SOL'],
    answer: 1,
    explanation: 'Base Pay focuses on fast, low-friction USDC payments.'
  },
  {
    id: 'q3',
    category: 'Auth',
    prompt: 'SIWE stands for…',
    options: ['Secure Internet Wallet Exchange', 'Simple Indexing for Web Events', 'Sign-In with Ethereum', 'Serverless Identity Web Engine'],
    answer: 2,
    explanation: 'SIWE means Sign-In with Ethereum — a standard way to authenticate with a wallet signature.'
  },
  {
    id: 'q4',
    category: 'Wallets',
    prompt: 'A wallet signature is mainly used to…',
    options: [
      'Hide your address forever',
      'Mint ETH out of thin air',
      'Change block timestamps',
      'Prove you control an address'
    ],
    answer: 3,
    explanation: 'Signing a message proves the wallet holder controls the address without sending funds.'
  },
  {
    id: 'q5',
    category: 'Dev',
    prompt: 'For standard web apps in the Base App, the docs recommend which stack for wallet + chain interactions?',
    options: ['jQuery + WebSQL', 'wagmi + viem', 'PHP + cURL', 'Ruby + Redis'],
    answer: 1,
    explanation: 'The current migration path centers on standard web apps using wagmi and viem.'
  },
  {
    id: 'q6',
    category: 'Base Account',
    prompt: 'Base Account is designed to give users…',
    options: [
      'A private mining pool',
      'A centralized custodial bank account only',
      'Universal sign-on and one-tap onchain UX',
      'An off-grid cold-storage device'
    ],
    answer: 2,
    explanation: 'Base Account is built around a smoother smart-wallet experience, including easy sign-on and payments.'
  },
  {
    id: 'q7',
    category: 'Gas',
    prompt: 'In EVM networks, "gas" usually means…',
    options: ['Airdropped loyalty points', 'NFT image storage', 'The transaction fee / execution cost', 'A validator nickname'],
    answer: 2,
    explanation: 'Gas is the cost paid to execute transactions or smart contract calls.'
  },
  {
    id: 'q8',
    category: 'Testing',
    prompt: 'Before shipping a smart contract to Base mainnet, a safer first step is to deploy to…',
    options: ['An image CDN', 'Your DNS provider', 'A spreadsheet', 'Base Sepolia'],
    answer: 3,
    explanation: 'Base Sepolia is the standard place to test contracts before going live on mainnet.'
  },
  {
    id: 'q9',
    category: 'Builder Codes',
    prompt: 'Builder Codes are mainly used to…',
    options: [
      'Store private keys onchain',
      'Attribute onchain activity to your app or wallet',
      'Compress images in IPFS',
      'Replace gas fees with points'
    ],
    answer: 1,
    explanation: 'Builder Codes help attribute transactions and analytics back to the app or builder.'
  },
  {
    id: 'q10',
    category: 'Chain Data',
    prompt: 'Why are event logs useful in onchain apps?',
    options: [
      'They make all transactions free forever',
      'They encrypt your wallet seed phrase',
      'They delete failed transactions from history',
      'They provide a lightweight record of contract activity for indexing and UIs'
    ],
    answer: 3,
    explanation: 'Event logs are commonly used by frontends and indexers to track what happened in a contract.'
  },
  {
    id: 'q11',
    category: 'Web3 Basics',
    prompt: 'USDC is designed to track the value of…',
    options: ['Ethereum gas prices', 'The U.S. dollar', 'NASDAQ tech stocks', 'Gold ounces only'],
    answer: 1,
    explanation: 'USDC is a dollar-pegged stablecoin.'
  },
  {
    id: 'q12',
    category: 'Frontend',
    prompt: 'Why is a static frontend attractive for a low-cost mini-game?',
    options: [
      'It prevents all cheating automatically',
      'It can write to Ethereum without a wallet',
      'It can be hosted cheaply or free without running your own server backend',
      'It removes the need for RPC access'
    ],
    answer: 2,
    explanation: 'A static app is simple to host on services like GitHub Pages or Cloudflare Pages.'
  },
  {
    id: 'q13',
    category: 'Contracts',
    prompt: 'A smart contract is…',
    options: [
      'A paper agreement between miners',
      'A hardware chip inside a phone',
      'A browser extension for bookmarks',
      'Program logic that runs onchain'
    ],
    answer: 3,
    explanation: 'Smart contracts are programs deployed to a blockchain and executed by the network.'
  },
  {
    id: 'q14',
    category: 'Identity',
    prompt: 'A wallet address mainly identifies…',
    options: ['A local CSS file', 'An onchain account', 'A Wi‑Fi router', 'A PDF signature'],
    answer: 1,
    explanation: 'Wallet addresses are the public identifiers of onchain accounts.'
  },
  {
    id: 'q15',
    category: 'EVM',
    prompt: 'If a network is EVM-compatible, it means…',
    options: [
      'It only supports Bitcoin scripts',
      'It cannot use Solidity',
      'It can run Ethereum-style smart contracts and tooling',
      'It has no transaction fees'
    ],
    answer: 2,
    explanation: 'EVM compatibility lets developers reuse Ethereum tools, languages, and patterns.'
  },
  {
    id: 'q16',
    category: 'RPC',
    prompt: 'An RPC endpoint is used to…',
    options: [
      'Render CSS gradients faster',
      'Compress PNG files',
      'Read blockchain data and send transactions from an app',
      'Create ENS names automatically'
    ],
    answer: 2,
    explanation: 'Apps talk to the chain through RPC endpoints to read state and broadcast transactions.'
  },
  {
    id: 'q17',
    category: 'UX',
    prompt: 'Low-friction onboarding usually means…',
    options: [
      'Requiring three wallets and two bridges up front',
      'Hiding every call-to-action',
      'Forcing users to install multiple desktop apps',
      'Fewer setup steps before a user can try the core experience'
    ],
    answer: 3,
    explanation: 'The best mini-games let users understand and try the core loop quickly.'
  },
  {
    id: 'q18',
    category: 'Social',
    prompt: 'Why can quizzes work well as Base mini-apps?',
    options: [
      'They require a full server cluster to start',
      'They are simple, fun, and easy to share',
      'They only work with custodial wallets',
      'They must hide all results from users'
    ],
    answer: 1,
    explanation: 'Short, social, low-friction experiences fit the Base mini-app model well.'
  }
];
