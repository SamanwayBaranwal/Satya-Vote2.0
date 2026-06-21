import abi from "../contracts/SatyaVote.abi.json";
import addresses from "../contracts/addresses.json";

export const SATYA_VOTE_ABI = abi;

// Choose address by env override, then sepolia, then localhost.
export function getContractAddress(chainId) {
  const envAddr = import.meta.env.VITE_CONTRACT_ADDRESS;
  if (envAddr) return envAddr;
  if (chainId === 31337) return addresses.localhost || "";
  return addresses.sepolia || addresses.localhost || "";
}

export const contractConfig = (chainId) => ({
  address: getContractAddress(chainId),
  abi: SATYA_VOTE_ABI,
});

// Block-explorer URLs per chain (local chains have none).
const EXPLORERS = {
  11155111: "https://sepolia.etherscan.io",
  1: "https://etherscan.io",
};

export function explorerBase(chainId) {
  return EXPLORERS[chainId] || "";
}

export function txUrl(chainId, hash) {
  const base = explorerBase(chainId);
  return base ? `${base}/tx/${hash}` : "";
}

export function addressUrl(chainId, address) {
  const base = explorerBase(chainId);
  return base ? `${base}/address/${address}` : "";
}

// Election status helpers (mirror on-chain getStatus).
export const STATUS = { UPCOMING: 0, LIVE: 1, ENDED: 2 };

export function statusOf(election, nowSec = Math.floor(Date.now() / 1000)) {
  if (!election) return STATUS.ENDED;
  if (nowSec < Number(election.startTime)) return STATUS.UPCOMING;
  if (nowSec <= Number(election.endTime)) return STATUS.LIVE;
  return STATUS.ENDED;
}