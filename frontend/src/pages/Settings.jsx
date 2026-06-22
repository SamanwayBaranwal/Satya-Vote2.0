import { useState } from "react";
import { useAccount, useChainId } from "wagmi";
import AppLayout from "../components/AppLayout.jsx";
import Icon from "../components/Icons.jsx";
import { DIALOGUE } from "../lib/design.js";
import { getContractAddress } from "../lib/contract.js";

function Toggle({ on, set }) {
  return (
    <button
      onClick={() => set(!on)}
      className={`relative h-6 w-11 rounded-full transition ${on ? "bg-leaf" : "bg-gray-300"}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${on ? "left-[22px]" : "left-0.5"}`} />
    </button>
  );
}

export default function Settings() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [notifs, setNotifs] = useState(true);
  const [sound, setSound] = useState(false);
  const [mascot, setMascot] = useState(true);

  const rows = [
    { label: "Notifications", desc: "Alerts for new elections and results", on: notifs, set: setNotifs },
    { label: "Sound effects", desc: "Play a chime when your vote confirms", on: sound, set: setSound },
    { label: "Mascot guides", desc: "Show Adhyaksh / Matdata speech bubbles", on: mascot, set: setMascot },
  ];

  return (
    <AppLayout title="Settings" subtitle="Preferences & connection" dialogue={DIALOGUE.admin}>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Preferences</h3>
          <div className="mt-4 divide-y divide-gray-100">
            {rows.map((r) => (
              <div key={r.label} className="flex items-center justify-between py-4">
                <div>
                  <p className="font-semibold text-ink-800">{r.label}</p>
                  <p className="text-xs text-gray-500">{r.desc}</p>
                </div>
                <Toggle on={r.on} set={r.set} />
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Connection</h3>
          <dl className="mt-4 space-y-3 text-sm">
            <Row label="Wallet" value={isConnected ? `${address.slice(0, 6)}…${address.slice(-4)}` : "Not connected"} mono />
            <Row label="Network" value={chainId === 31337 ? "Hardhat (31337)" : `Chain ${chainId}`} />
            <Row label="Contract" value={getContractAddress(chainId) ? `${getContractAddress(chainId).slice(0, 8)}…` : "Not set"} mono />
          </dl>
          <div className="mt-5 flex items-start gap-2 border border-leaf/20 bg-leaf-50 p-3 text-xs text-leaf-700">
            <Icon.Lock width={16} height={16} />
            Satya Vote never holds your funds or keys. All actions are signed in your own wallet.
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function Row({ label, value, mono }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-gray-500">{label}</dt>
      <dd className={`font-semibold text-ink-800 ${mono ? "font-mono text-xs" : ""}`}>{value}</dd>
    </div>
  );
}
