// Satya Vote design system — asset map + hardcoded mascot dialogue.
// Mascots:
//   Adhyaksh — the election officer (presides over voting)
//   Matdata  — the voter (citizen)
//   Netaji   — the leader (results / authority)

const A = "/assets";

export const ASSETS = {
  logoIcon: `${A}/satya-vote-icon-only.png`,
  logoMono: `${A}/satya-vote-logo-monochrome-white.png`,
  logoBanner: `${A}/satya-vote-purple.png`,
  appIcon: `${A}/satya-vote-app-icon-1024x1024.png`,
  heroMain: `${A}/Hero-main.png`,

  mascot: {
    adhyakshIdle: `${A}/mascot-adhyaksh-idle-v2.png`,
    adhyakshTalking: `${A}/mascot-adhyaksh-talking.png`,
    adhyakshSitting: `${A}/mascot-adhyaksh-sitting.png`,
    adhyakshGavel: `${A}/mascot-adhyaksh-gavel-raised.png`,
    adhyakshResults: `${A}/mascot-adhyaksh-results-announcement.png`,
    matdataIdle: `${A}/mascot-matdata-idle.png`,
    matdataHappy: `${A}/mascot-matdata-happy.png`,
    matdataVoted: `${A}/mascot-matdata-voted.png`,
    matdataCelebration: `${A}/mascot-matdata-celebration.png`,
    matdataFinger: `${A}/mascot-matdata-finger-raised.png`,
    matdataWaiting: `${A}/mascot-matdata-waiting.png`,
    netajiIdle: `${A}/mascot-netaji-idle.png`,
    netajiTalking: `${A}/mascot-netaji-talking.png`,
    netajiApproval: `${A}/mascot-netaji-approval.png`,
    netajiCelebration: `${A}/mascot-netaji-celebration.png`,
    netajiThinking: `${A}/mascot-netaji-thinking.png`,
  },

  illustration: {
    secureWallet: `${A}/illustration-secure-wallet.png`,
    tamperProof: `${A}/illustration-tamper-proof.png`,
    transparent: `${A}/illustration-transparent-blockchain.png`,
    realtimeVoting: `${A}/illustration-realtime-voting-live.png`,
    identityVerified: `${A}/illustration-identity-verified.png`,
    identityTrophy: `${A}/illustration-identity-verified-trophy.png`,
  },

  icon: {
    ballotBox: `${A}/icon-election-ballot-box.png`,
    resultsChart: `${A}/icon-election-results-chart.png`,
    voterApproval: `${A}/icon-election-voter-approval.png`,
    auditChecklist: `${A}/icon-election-audit-checklist.png`,
    statusLive: `${A}/icon-status-live-election.png`,
    statusUpcoming: `${A}/icon-status-upcoming-election.png`,
    statusEnded: `${A}/icon-status-ended-election.png`,
    statusWinner: `${A}/icon-status-winner.png`,
    navDashboard: `${A}/icon-nav-dashboard-home.png`,
    navVoters: `${A}/icon-nav-voters-group.png`,
    navCandidate: `${A}/icon-nav-candidate-avatar.png`,
    navBell: `${A}/icon-nav-bell-alert.png`,
    navSettings: `${A}/icon-nav-settings.png`,
  },

  empty: {
    noElections: `${A}/empty-state-no-elections.png`,
    noElectionsLocked: `${A}/empty-state-no-elections-locked.png`,
    noCandidates: `${A}/empty-state-no-candidates.png`,
    noVoteHistory: `${A}/empty-state-no-vote-history.png`,
  },

  badge: {
    firstVote: `${A}/badge-achievement-first-vote.png`,
  },
};

// Hardcoded mascot dialogue per page/context.
export const DIALOGUE = {
  landing: {
    mascot: ASSETS.mascot.adhyakshGavel,
    name: "Adhyaksh Ji",
    lines: [
      "Welcome to Satya Vote! Connect your wallet to begin.",
      "Har vote mehfooz, har vote sach. One vote, one truth.",
      "Loktantra ki shakti aapke haath mein hai. 🇮🇳",
    ],
  },
  dashboard: {
    mascot: ASSETS.mascot.matdataHappy,
    name: "Matdata Ji",
    lines: [
      "You are a verified voter. Every vote shapes our future.",
      "Active elections are waiting for you. Cast your vote!",
      "Your vote history is secured on the blockchain.",
    ],
  },
  voting: {
    mascot: ASSETS.mascot.adhyakshIdle,
    name: "Adhyaksh Ji",
    lines: [
      "Select one candidate. This action cannot be undone.",
      "Soch samajh ke vote dein — your choice is final.",
      "Once cast, your vote is recorded forever on-chain.",
    ],
  },
  voted: {
    mascot: ASSETS.mascot.matdataHappy,
    name: "Matdata Ji",
    lines: [
      "Badhai ho! Your vote is on the blockchain. 🎉",
      "Aapne apna farz nibhaya. Thank you for voting!",
    ],
  },
  results: {
    mascot: ASSETS.mascot.netajiCelebration,
    name: "Netaji",
    lines: [
      "The people have spoken! Results are final and verifiable.",
      "Janta ka faisla — counted on-chain, tamper-proof.",
      "Audit every vote on Etherscan. Total transparency.",
    ],
  },
  admin: {
    mascot: ASSETS.mascot.netajiApproval,
    name: "Netaji",
    lines: [
      "Approve voters and manage elections with care.",
      "Aapke faisle loktantra ko mazboot karte hain.",
      "Every admin action is logged on-chain.",
    ],
  },
};

export const NETWORK = {
  sepolia: {
    chainId: 11155111,
    name: "Sepolia",
    explorer: "https://sepolia.etherscan.io",
  },
  localhost: {
    chainId: 31337,
    name: "Localhost",
    explorer: "",
  },
};