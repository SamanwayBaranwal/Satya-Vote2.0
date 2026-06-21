import { useCallback, useEffect, useState } from "react";
import {
  useAccount,
  useChainId,
  usePublicClient,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import toast from "react-hot-toast";
import { contractConfig, getContractAddress, SATYA_VOTE_ABI } from "../lib/contract.js";

const REFETCH_MS = 8000;

export function useContractReady() {
  const chainId = useChainId();
  const address = getContractAddress(chainId);
  return { ready: Boolean(address && address.length === 42), address, chainId };
}

export function useIsAdmin() {
  const chainId = useChainId();
  const { address } = useAccount();
  const { data: admin } = useReadContract({
    ...contractConfig(chainId),
    functionName: "admin",
    query: { enabled: Boolean(getContractAddress(chainId)) },
  });
  return {
    admin,
    isAdmin: Boolean(admin && address && admin.toLowerCase() === address.toLowerCase()),
  };
}

export function useIsApprovedVoter() {
  const chainId = useChainId();
  const { address } = useAccount();
  const { data, refetch } = useReadContract({
    ...contractConfig(chainId),
    functionName: "isApprovedVoter",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address && getContractAddress(chainId)) },
  });
  return { isApproved: Boolean(data), refetch };
}

export function useElections() {
  const chainId = useChainId();
  const { data, isLoading, refetch } = useReadContract({
    ...contractConfig(chainId),
    functionName: "getElections",
    query: {
      enabled: Boolean(getContractAddress(chainId)),
      refetchInterval: REFETCH_MS,
    },
  });
  return { elections: data ? [...data] : [], isLoading, refetch };
}

export function useElection(electionId) {
  const chainId = useChainId();
  const enabled = Boolean(electionId && getContractAddress(chainId));
  const { data, isLoading, refetch } = useReadContract({
    ...contractConfig(chainId),
    functionName: "getElection",
    args: enabled ? [BigInt(electionId)] : undefined,
    query: { enabled, refetchInterval: REFETCH_MS },
  });
  return { election: data, isLoading, refetch };
}

export function useCandidates(electionId) {
  const chainId = useChainId();
  const enabled = Boolean(electionId && getContractAddress(chainId));
  const { data, isLoading, refetch } = useReadContract({
    ...contractConfig(chainId),
    functionName: "getCandidates",
    args: enabled ? [BigInt(electionId)] : undefined,
    query: { enabled, refetchInterval: REFETCH_MS },
  });
  return { candidates: data ? [...data] : [], isLoading, refetch };
}

export function useHasVoted(electionId) {
  const chainId = useChainId();
  const { address } = useAccount();
  const enabled = Boolean(electionId && address && getContractAddress(chainId));
  const { data, refetch } = useReadContract({
    ...contractConfig(chainId),
    functionName: "hasVoted",
    args: enabled ? [BigInt(electionId), address] : undefined,
    query: { enabled, refetchInterval: REFETCH_MS },
  });
  return { hasVoted: Boolean(data), refetch };
}

export function useVotedFor(electionId) {
  const chainId = useChainId();
  const { address } = useAccount();
  const enabled = Boolean(electionId && address && getContractAddress(chainId));
  const { data } = useReadContract({
    ...contractConfig(chainId),
    functionName: "votedFor",
    args: enabled ? [BigInt(electionId), address] : undefined,
    query: { enabled, refetchInterval: REFETCH_MS },
  });
  return { candidateId: data ? Number(data) : 0 };
}

export function useApprovedVoterCount() {
  const chainId = useChainId();
  const { data } = useReadContract({
    ...contractConfig(chainId),
    functionName: "approvedVoterCount",
    query: { enabled: Boolean(getContractAddress(chainId)), refetchInterval: REFETCH_MS },
  });
  return Number(data || 0n);
}

/**
 * Real on-chain vote history for the connected wallet.
 * Reads `VoteCast` events (voter is indexed) and returns newest-first.
 */
export function useMyVotes() {
  const client = usePublicClient();
  const chainId = useChainId();
  const { address } = useAccount();
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const contractAddr = getContractAddress(chainId);
    if (!client || !address || !contractAddr) {
      setVotes([]);
      return;
    }
    let active = true;
    setLoading(true);
    (async () => {
      try {
        const logs = await client.getContractEvents({
          address: contractAddr,
          abi: SATYA_VOTE_ABI,
          eventName: "VoteCast",
          args: { voter: address },
          fromBlock: 0n,
          toBlock: "latest",
        });
        if (!active) return;
        const parsed = logs
          .map((l) => ({
            electionId: Number(l.args.electionId),
            candidateId: Number(l.args.candidateId),
            txHash: l.transactionHash,
            block: Number(l.blockNumber),
          }))
          .sort((a, b) => b.block - a.block);
        setVotes(parsed);
      } catch (e) {
        if (active) setVotes([]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [client, address, chainId]);

  return { votes, loading };
}

/**
 * Generic write helper with toast lifecycle + receipt awaiting.
 */
export function useSatyaWrite() {
  const chainId = useChainId();
  const { writeContractAsync, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const run = useCallback(
    async (functionName, args, { pending, success } = {}) => {
      const toastId = toast.loading(pending || "Confirm in your wallet...");
      try {
        const txHash = await writeContractAsync({
          ...contractConfig(chainId),
          functionName,
          args,
        });
        toast.loading("Mining transaction on-chain...", { id: toastId });
        return { hash: txHash, toastId, success: success || "Done!" };
      } catch (err) {
        toast.error(parseError(err), { id: toastId });
        throw err;
      }
    },
    [chainId, writeContractAsync]
  );

  return { run, hash, isPending, isConfirming, isSuccess };
}

export function parseError(err) {
  const msg = err?.shortMessage || err?.message || "Transaction failed";
  const match = msg.match(/SatyaVote: ([^"]+)/);
  if (match) return capitalize(match[1]);
  if (/User rejected/i.test(msg)) return "Transaction rejected in wallet.";
  if (/insufficient funds/i.test(msg)) return "Insufficient funds for gas.";
  return msg.length > 120 ? "Transaction failed. Check console." : msg;
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}