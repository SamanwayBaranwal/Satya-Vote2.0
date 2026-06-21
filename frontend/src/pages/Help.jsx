import { useState } from "react";
import AppLayout from "../components/AppLayout.jsx";
import { ASSETS, DIALOGUE } from "../lib/design.js";

const FAQS = [
  {
    q: "How do I become an approved voter?",
    a: "The election admin approves voter wallet addresses on-chain. Once approved, you'll see an 'Approved' badge on your dashboard and can cast votes.",
  },
  {
    q: "Can I change my vote after casting it?",
    a: "No. Votes are final and immutable once recorded on the blockchain. This guarantees integrity — Ek Vote, Ek Sach.",
  },
  {
    q: "How is my vote kept secure?",
    a: "Every vote is a signed transaction recorded on Ethereum. No one can alter or delete it, and anyone can audit the tally on Etherscan.",
  },
  {
    q: "Do I need ETH to vote?",
    a: "On the Sepolia testnet you need a small amount of free test ETH for gas. On a local Hardhat network, test accounts are pre-funded.",
  },
  {
    q: "What wallets are supported?",
    a: "MetaMask and any WalletConnect-compatible wallet via the Connect Wallet button.",
  },
];

export default function Help() {
  const [open, setOpen] = useState(0);
  return (
    <AppLayout title="Help & Support" subtitle="Frequently asked questions" dialogue={DIALOGUE.dashboard}>
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-3">
          {FAQS.map((f, i) => (
            <div key={i} className="card overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left"
              >
                <span className="font-semibold text-ink-800">{f.q}</span>
                <span className={`text-leaf transition ${open === i ? "rotate-45" : ""}`}>＋</span>
              </button>
              {open === i && <p className="border-t border-gray-100 p-5 text-sm leading-relaxed text-gray-600">{f.a}</p>}
            </div>
          ))}
        </div>

        <div className="card flex flex-col items-center p-6 text-center">
          <img src={ASSETS.mascot.adhyakshTalking} alt="" className="h-32 w-32" style={{ imageRendering: "pixelated" }} />
          <h3 className="mt-3 font-display font-bold text-ink-800">Still need help?</h3>
          <p className="mt-1 text-sm text-gray-500">Adhyaksh Ji and our team are here for you.</p>
          <a href="mailto:support@satyavote.in" className="btn-primary mt-4 w-full">Contact Support</a>
          <a href="#" className="btn-ghost mt-2 w-full">Read the Docs</a>
        </div>
      </div>
    </AppLayout>
  );
}
