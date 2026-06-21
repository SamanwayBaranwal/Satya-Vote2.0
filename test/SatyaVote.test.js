const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("SatyaVote", function () {
  let satyaVote, admin, alice, bob, carol;

  beforeEach(async function () {
    [admin, alice, bob, carol] = await ethers.getSigners();
    const SatyaVote = await ethers.getContractFactory("SatyaVote");
    satyaVote = await SatyaVote.deploy();
    await satyaVote.waitForDeployment();
  });

  it("sets the deployer as admin and an approved voter", async function () {
    expect(await satyaVote.admin()).to.equal(admin.address);
    expect(await satyaVote.isApprovedVoter(admin.address)).to.equal(true);
  });

  it("only admin can approve voters", async function () {
    await expect(satyaVote.connect(alice).approveVoter(bob.address)).to.be.revertedWith(
      "SatyaVote: caller is not admin"
    );
    await expect(satyaVote.approveVoter(alice.address))
      .to.emit(satyaVote, "VoterApproved")
      .withArgs(alice.address);
    expect(await satyaVote.isApprovedVoter(alice.address)).to.equal(true);
  });

  it("creates an election and adds candidates", async function () {
    const now = await time.latest();
    await expect(satyaVote.createElection("SC Election", "ABC University", now, now + 1000))
      .to.emit(satyaVote, "ElectionCreated");
    await satyaVote.addCandidate(1, "Rahul", "Independent", "tagline", "");
    await satyaVote.addCandidate(1, "Priya", "Progressive", "tagline", "");

    const candidates = await satyaVote.getCandidates(1);
    expect(candidates.length).to.equal(2);
    expect(candidates[0].name).to.equal("Rahul");
  });

  it("enforces approval, single vote, and time window", async function () {
    const now = await time.latest();
    await satyaVote.createElection("SC Election", "ABC University", now, now + 1000);
    await satyaVote.addCandidate(1, "Rahul", "Independent", "", "");
    await satyaVote.addCandidate(1, "Priya", "Progressive", "", "");

    // not approved
    await expect(satyaVote.connect(alice).castVote(1, 1)).to.be.revertedWith(
      "SatyaVote: voter not approved"
    );

    await satyaVote.approveVoter(alice.address);
    await expect(satyaVote.connect(alice).castVote(1, 2))
      .to.emit(satyaVote, "VoteCast")
      .withArgs(1, alice.address, 2);

    // cannot vote twice
    await expect(satyaVote.connect(alice).castVote(1, 1)).to.be.revertedWith(
      "SatyaVote: already voted"
    );

    const priya = await satyaVote.getCandidate(1, 2);
    expect(priya.voteCount).to.equal(1n);
  });

  it("blocks voting before start and after end", async function () {
    const now = await time.latest();
    await satyaVote.createElection("Future", "Org", now + 500, now + 1000);
    await satyaVote.addCandidate(1, "A", "P", "", "");
    await satyaVote.approveVoter(alice.address);

    await expect(satyaVote.connect(alice).castVote(1, 1)).to.be.revertedWith(
      "SatyaVote: election not started"
    );

    await time.increaseTo(now + 1500);
    await expect(satyaVote.connect(alice).castVote(1, 1)).to.be.revertedWith(
      "SatyaVote: election ended"
    );
  });

  it("computes the winner and declares results after end", async function () {
    const now = await time.latest();
    await satyaVote.createElection("SC", "Org", now, now + 1000);
    await satyaVote.addCandidate(1, "Rahul", "Ind", "", "");
    await satyaVote.addCandidate(1, "Priya", "Prog", "", "");
    await satyaVote.approveVoter(alice.address);
    await satyaVote.approveVoter(bob.address);

    await satyaVote.connect(alice).castVote(1, 2);
    await satyaVote.connect(bob).castVote(1, 2);

    await expect(satyaVote.declareResults(1)).to.be.revertedWith("SatyaVote: election not ended");

    await time.increaseTo(now + 2000);
    await expect(satyaVote.declareResults(1))
      .to.emit(satyaVote, "ResultsDeclared")
      .withArgs(1, 2, 2);

    const [id, votes] = await satyaVote.getWinner(1);
    expect(id).to.equal(2n);
    expect(votes).to.equal(2n);
  });

  it("supports batch voter approval", async function () {
    await satyaVote.approveVoters([alice.address, bob.address, carol.address]);
    expect(await satyaVote.isApprovedVoter(alice.address)).to.equal(true);
    expect(await satyaVote.isApprovedVoter(carol.address)).to.equal(true);
    // admin + 3
    expect(await satyaVote.approvedVoterCount()).to.equal(4n);
  });
});