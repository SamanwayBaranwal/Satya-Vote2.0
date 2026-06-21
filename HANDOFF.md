# 🪷 Satya Vote 2.0 — Handoff & Continuation Guide

> **Read this first when resuming.** It contains everything needed to set the project
> back up after a laptop reset, the test admin credentials, the current state, and the
> running to-do list. Tagline: **Ek Vote, Ek Sach.**

A blockchain voting dApp: React + Vite + Tailwind frontend, Solidity (Hardhat) smart
contract, RainbowKit + Wagmi + viem wallet layer, deployable to Ethereum Sepolia.

---

## 1. Quick start after a fresh machine

> The whole project lives in `OneDrive\Apps\Designer\Desktop\Satya-Vote`, so it is also
> cloud-synced. To restore: clone from GitHub **or** let OneDrive re-sync, then reinstall
> dependencies (node_modules are NOT committed).

PowerShell (run **one line at a time** — PowerShell 5.1 does not accept `&&`):

```powershell
# 1. Contracts (root)
npm install
npm test                # 7 tests should pass
npx hardhat node        # Terminal 1 — leave running (local chain on :8545)

# 2. Deploy + seed (Terminal 2)
npm run deploy:local    # deploys, seeds 2 elections + 5 voters + votes, writes ABI/address to frontend

# 3. Frontend (Terminal 3)
cd frontend
npm install
Copy-Item .env.example .env
npm run dev             # http://localhost:5173
```

Then open http://localhost:5173 in a **real browser with the MetaMask extension**
(Chrome/Edge/Brave/Firefox — NOT VS Code's built-in browser).

---

## 2. Admin / test accounts (Hardhat — PUBLIC test keys)

These are Hardhat's **well-known, publicly-published** development keys. They are safe to
keep here because everyone has them. **NEVER send real funds to these. NEVER use them on a
live network.**

| Role | Address | Private Key |
|------|---------|-------------|
| **Admin (deployer, Account #0)** | `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` | `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80` |
| Voter (Account #1) | `0x70997970C51812dc3A010C7d01b50e0d17dc79C8` | `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d` |
| Voter (Account #2) | `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC` | `0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a` |

`npx hardhat node` prints all 20 accounts each run. Seed approves accounts #1–#5 as voters.

**MetaMask setup**
1. Add network: name `Hardhat Local`, RPC `http://127.0.0.1:8545`, Chain ID `31337`, currency `ETH`.
2. Import the admin private key above → that wallet is admin and sees the orange **Admin Panel** in the sidebar.

**Sepolia deploy (when ready):** copy `.env.example` → `.env` at the root, fill
`SEPOLIA_RPC_URL`, `PRIVATE_KEY` (a REAL throwaway key with test ETH), `ETHERSCAN_API_KEY`,
then `npm run deploy:sepolia`. This writes the live address into
`frontend/src/contracts/addresses.json` automatically.

---

## 3. Project structure

```
Satya-Vote/
├── contracts/SatyaVote.sol         # the voting contract
├── scripts/deploy.js               # deploy + seed + export ABI/address to frontend
├── test/SatyaVote.test.js          # 7 passing tests
├── hardhat.config.cjs              # Solidity 0.8.24, sepolia + localhost networks
├── package.json                    # root = Hardhat
├── HANDOFF.md                      # ← this file
├── README.md
├── satya-vote-assets/              # 65 source PNGs (mascots, logos, icons) + Hero-main + purple banner
└── frontend/
    ├── package.json                # Vite/React/Tailwind/RainbowKit/wagmi/viem/recharts/confetti
    ├── tailwind.config.js          # design tokens (colors, fonts, animations)
    ├── public/assets/              # all PNGs copied here for the app
    └── src/
        ├── main.jsx                # providers: Wagmi, RainbowKit, ReactQuery, Router, Toaster
        ├── App.jsx                 # routes (no wallet gate — all pages reachable)
        ├── lib/
        │   ├── design.js           # ASSETS map + hardcoded mascot DIALOGUE + NETWORK
        │   ├── wagmi.js            # RainbowKit config (chains: hardhat, sepolia)
        │   └── contract.js         # ABI/address loader, STATUS, txUrl/addressUrl helpers
        ├── hooks/useSatyaVote.js   # ALL contract reads/writes + useMyVotes (event history)
        ├── contracts/              # SatyaVote.abi.json + addresses.json (auto-generated)
        ├── components/             # Sidebar, AppLayout, FocusTopbar, MascotBubble, Icons (SVG),
        │                           # IconTile, Loader, AuroraBackground, CandidateAvatar, etc.
        └── pages/                  # Landing, About, Dashboard, Elections, Voting, Results,
                                    # Admin, Profile, History, Settings, Help
```

---

## 4. Smart contract (`SatyaVote.sol`)

- **Admin = deployer.** Constructor sets `admin` and auto-approves them as a voter.
- **Voter whitelist:** `approveVoter`, `approveVoters` (batch), `revokeVoter`.
- **Elections:** `createElection(title, org, start, end)`, `addCandidate(eid, name, party, tagline, imageURI)`,
  `updateSchedule`, `startElectionNow`, `endElectionNow`.
- **Voting:** `castVote(eid, candidateId)` — enforces approval, one-vote-per-wallet, time window.
- **Results:** on-chain tally; `getWinner`, `declareResults`, `getStatus` (0=upcoming,1=live,2=ended).
- **Views:** `getElections`, `getElection`, `getCandidates`, `getCandidate`, `hasVoted`, `votedFor`, `approvedVoterCount`.
- **Events:** `VoterApproved/Revoked`, `ElectionCreated`, `CandidateAdded`, `VoteCast`, `ResultsDeclared`,
  `ElectionScheduleUpdated`, `AdminTransferred`. (`VoteCast` powers the real vote-history page.)

---

## 5. Frontend — 12 pages

| Route | Page | Notes |
|-------|------|-------|
| `/` | Landing | hero (Hero-main.png), stats, features, how-it-works, live elections, footer |
| `/about` | About | Mission / Vision / Values |
| `/dashboard` | Dashboard | welcome banner, active elections, profile + real vote-history card |
| `/elections` | Elections | grid of all elections → vote |
| `/results` | Results list | grid → individual result |
| `/results/:id` | Result | recharts bar chart, ranked bars, winner card, confetti, Etherscan audit |
| `/vote/:id` | Voting booth | candidate cards, one vote, on-chain cast, "already voted" state |
| `/admin` | Admin panel | approve voters, create election (duration presets), add candidates (+photo URL), start/end |
| `/profile` | My Profile | voter ID card, badge, real votes-cast count |
| `/history` | Vote History | **real** VoteCast events, each links to explorer tx |
| `/settings` | Settings | preference toggles, connection info |
| `/help` | Help & Support | FAQ accordion |

**Layouts:** sidebar pages use `AppLayout` (dark sidebar + glass top bar + aurora bg);
Voting/Results use `FocusTopbar` (light glass nav).

---

## 6. Design system

- **Fonts:** Space Grotesk (display/body), JetBrains Mono (labels/addresses/tx), Press Start 2P (pixel accents).
- **Colors (tailwind.config.js):** leaf `#16a34a`, ink/navy `#0c1a2b`, lotus pink `#ec4899`, saffron `#FF9933`.
- **Look:** glassmorphism — `.card`/`.glass`/`.glass-nav` use translucent white + `backdrop-blur`;
  `AuroraBackground` adds soft color blobs; buttons are full pills; subtle grid background (`.grid-bg`).
- **Mascots:** Adhyaksh (officer), Matdata (voter), Netaji (leader). Hardcoded dialogue in `lib/design.js`.
  **⚠️ Mascot PNGs have WHITE backgrounds** (except a few) → always place them on white/neutral
  surfaces, never colored circles, or you get a white box.
- **Logo:** `satya-vote-purple.png` = navy banner (use on dark surfaces: sidebar/footer).
  `Logo.jsx` component (color lotus + text) = use on light surfaces (public nav, glass focus nav).

---

## 7. Demo flow (1-minute election for a pitch)

1. Connect as **admin** → **Admin Panel**.
2. **Create Election** → title → tap **`1 min`** preset → Create.
3. Under **Manage Elections** → **+ Candidate** → add 2–3 (optional photo URL).
4. Switch to a voter account → **Vote Now** → cast.
5. Countdown hits `00:00` → election Ends → **Results** shows winner + confetti.
6. **Vote History** shows the vote with a tx link.

---

## 8. ✅ Done / ⏳ Pending

**Done:** contract + 7 tests; deploy+seed script; 12 pages; sidebar + glass UI; RainbowKit
wallet; real on-chain vote history with explorer links; custom candidates (+photo URL);
duration presets (1 min … 48 h); premium fonts; aurora glass theme; no demo/fake data.

**Pending / ideas (next session):**
- [ ] **Liquid-glass "Apple" effect** — water-ripple/bubble animation on button & nav clicks,
      curved liquid hover. (User asked for this; deferred.)
- [ ] Generate proper **transparent candidate-portrait placeholders** + a **winner/victory banner**.
- [ ] Replace the broken `mascot-matdata-celebration.png` (it has a **checkerboard baked into the
      pixels** — currently avoided; we use `matdata-idle` on a white card instead).
- [ ] Vote-history shows "Candidate #N" — map to candidate **names** by reading candidates per election.
- [ ] Deploy to **Sepolia** + `gh`/Etherscan verify; set `VITE_WALLETCONNECT_PROJECT_ID`.
- [ ] Optional: glass the sidebar; mobile polish.

**Known gotchas:** PowerShell has no `&&`; use a real browser+MetaMask; if `deploy:local` is
run twice against one node it deploys a 2nd contract — `addresses.json` always points to the
newest (correct) one; hard-refresh (Ctrl+Shift+R) after CSS/font changes.

---

## 9. Session summary (how we got here)

1. Scaffolded Hardhat (root) + Vite/React/Tailwind (frontend); wrote `SatyaVote.sol` + 7 tests (all pass).
2. Built deploy/seed script that exports ABI + address to the frontend.
3. Built the full frontend to match the provided design board; wired RainbowKit/Wagmi/viem.
4. Added the real **Hero-main.png** hero; audited all 64 assets (most used, rest are spare poses).
5. Fixed "only one page" by removing the hard wallet gate; rebuilt around the **sidebar layout**;
   added About/Profile/History/Settings/Help; crisp SVG icons.
6. Premium pass: Space Grotesk + JetBrains Mono fonts, grid bg, tricolor loader; made vote
   history **real** (VoteCast events + explorer links); custom candidate photo support; removed all demo data.
7. Added **quick election durations** (1 min … 48 h) for live demos.
8. Swapped the sidebar logo to **satya-vote-purple.png**; replaced cheap pixel icons with tinted SVG tiles.
9. Fixed the navbar white-logo-box + low speech bubbles; fixed the broken celebration mascot (checkerboard).
10. **Glassmorphism** theme: glass nav/cards, pill buttons, aurora background.
11. (Deferred) Apple-style liquid-glass ripple animation. → Pushed to GitHub with this handoff.
