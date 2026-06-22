const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const network = hre.network.name;
  console.log(`\n🪷  Deploying SatyaVote to "${network}"...`);

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer (admin):", deployer.address);

  const SatyaVote = await hre.ethers.getContractFactory("SatyaVote");
  const satyaVote = await SatyaVote.deploy();
  await satyaVote.waitForDeployment();

  const address = await satyaVote.getAddress();
  console.log("✅ SatyaVote deployed at:", address);

  // Seed demo data on local networks so the UI has something to show.
  if (network === "localhost" || network === "hardhat") {
    console.log("\nSeeding demo data (local only)...");
    const signers = await hre.ethers.getSigners();
    const now = Math.floor(Date.now() / 1000);

    // Approve a few demo voters (accounts #1..#5).
    const voters = signers.slice(1, 6).map((s) => s.address);
    await (await satyaVote.approveVoters(voters)).wait();
    console.log(`✅ Approved ${voters.length} demo voters (accounts #1–#5).`);

    // Election 1 — live for 24h.
    await (await satyaVote.createElection("Student Council Election", "ABC University", "school", now, now + 60 * 60 * 24)).wait();
    await (await satyaVote.addCandidate(1, "Rahul Sharma", "Independent", "Focus on transparency, education and student empowerment.", "")).wait();
    await (await satyaVote.addCandidate(1, "Priya Singh", "Progressive Party", "Working for a better campus, more opportunities and equal rights.", "")).wait();
    await (await satyaVote.addCandidate(1, "Amit Kumar", "Student Alliance", "Building a united and stronger student community.", "")).wait();

    // Cast some votes so Results/Dashboard aren't empty (Priya leads).
    await (await satyaVote.connect(signers[1]).castVote(1, 2)).wait();
    await (await satyaVote.connect(signers[2]).castVote(1, 2)).wait();
    await (await satyaVote.connect(signers[3]).castVote(1, 1)).wait();
    await (await satyaVote.connect(signers[4]).castVote(1, 3)).wait();
    console.log("✅ Election 1 'Student Council Election' — 3 candidates, 4 votes cast.");

    // Election 2 — a second live election (Panchayat).
    await (await satyaVote.createElection("Panchayat Election", "Greenfield Village", "panchayat", now, now + 60 * 60 * 12)).wait();
    await (await satyaVote.addCandidate(2, "Sunita Devi", "Gram Vikas", "Clean water and roads for every household.", "")).wait();
    await (await satyaVote.addCandidate(2, "Ramesh Yadav", "Kisan Morcha", "Fair prices and support for our farmers.", "")).wait();
    console.log("✅ Election 2 'Panchayat Election' — 2 candidates.");
  }

  // Export ABI + address to the frontend.
  exportToFrontend(address, network);

  console.log("\nDone. 🇮🇳  Ek Vote, Ek Sach.\n");
}

function exportToFrontend(address, network) {
  const artifact = require(path.join(
    __dirname,
    "..",
    "artifacts",
    "contracts",
    "SatyaVote.sol",
    "SatyaVote.json"
  ));

  const outDir = path.join(__dirname, "..", "frontend", "src", "contracts");
  fs.mkdirSync(outDir, { recursive: true });

  fs.writeFileSync(
    path.join(outDir, "SatyaVote.abi.json"),
    JSON.stringify(artifact.abi, null, 2)
  );

  const addressFile = path.join(outDir, "addresses.json");
  let addresses = {};
  if (fs.existsSync(addressFile)) {
    addresses = JSON.parse(fs.readFileSync(addressFile, "utf8"));
  }
  addresses[network] = address;
  fs.writeFileSync(addressFile, JSON.stringify(addresses, null, 2));

  console.log(`📦 Exported ABI + address to frontend/src/contracts (${network}).`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});