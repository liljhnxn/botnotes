import { expect } from "chai";
import hre from "hardhat";
const { ethers } = hre;
import { BotNotes } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("BotNotes", function () {
  let botNotes: BotNotes;
  let owner: HardhatEthersSigner;
  let alice: HardhatEthersSigner;
  let bob: HardhatEthersSigner;

  beforeEach(async function () {
    [owner, alice, bob] = await ethers.getSigners();
    const BotNotesFactory = await ethers.getContractFactory("BotNotes");
    botNotes = (await BotNotesFactory.deploy()) as BotNotes;
    await botNotes.waitForDeployment();
  });

  describe("Creating Notes", function () {
    it("allows a user to create a note and verifies storage, creator, and timestamps", async function () {
      const title = "My First Note";
      const content = "Hello Botchain Testnet!";

      const tx = await botNotes.connect(alice).createNote(title, content);
      await tx.wait();

      const notes = await botNotes.connect(alice).getMyNotes();
      expect(notes.length).to.equal(1);
      expect(notes[0].id).to.equal(1n);
      expect(notes[0].title).to.equal(title);
      expect(notes[0].content).to.equal(content);
      expect(notes[0].owner).to.equal(alice.address);
      expect(notes[0].createdAt).to.be.gt(0);
      expect(notes[0].updatedAt).to.equal(notes[0].createdAt);

      const count = await botNotes.connect(alice).getMyNoteCount();
      expect(count).to.equal(1n);

      const singleNote = await botNotes.connect(alice).getMyNote(0);
      expect(singleNote.id).to.equal(1n);
      expect(singleNote.title).to.equal(title);
    });

    it("emits NoteCreated event with correct information", async function () {
      const title = "Event Note";
      const content = "Testing NoteCreated event";

      await expect(botNotes.connect(alice).createNote(title, content))
        .to.emit(botNotes, "NoteCreated")
        .withArgs(1n, alice.address, title, (val: bigint) => val > 0n);
    });

    it("reverts if title is empty", async function () {
      await expect(
        botNotes.connect(alice).createNote("", "Valid content")
      ).to.be.revertedWithCustomError(botNotes, "EmptyTitle");
    });

    it("reverts if title exceeds 80 characters", async function () {
      const longTitle = "a".repeat(81);
      await expect(
        botNotes.connect(alice).createNote(longTitle, "Valid content")
      ).to.be.revertedWithCustomError(botNotes, "TitleTooLong");
    });

    it("reverts if content is empty", async function () {
      await expect(
        botNotes.connect(alice).createNote("Valid Title", "")
      ).to.be.revertedWithCustomError(botNotes, "EmptyContent");
    });

    it("reverts if content exceeds 500 characters", async function () {
      const longContent = "b".repeat(501);
      await expect(
        botNotes.connect(alice).createNote("Valid Title", longContent)
      ).to.be.revertedWithCustomError(botNotes, "ContentTooLong");
    });

    it("reverts when querying getMyNote with invalid index", async function () {
      await expect(botNotes.connect(alice).getMyNote(0)).to.be.revertedWithCustomError(
        botNotes,
        "IndexOutOfBounds"
      );
    });
  });

  describe("Editing Notes", function () {
    beforeEach(async function () {
      await botNotes.connect(alice).createNote("Initial Title", "Initial Content");
    });

    it("allows a user to edit their own note, updating updatedAt without changing createdAt", async function () {
      const initialNotes = await botNotes.connect(alice).getMyNotes();
      const initialCreatedAt = initialNotes[0].createdAt;
      const initialUpdatedAt = initialNotes[0].updatedAt;

      // Advance time slightly
      await time.increase(10);

      const newTitle = "Updated Title";
      const newContent = "Updated Content Body";

      const tx = await botNotes.connect(alice).updateNote(1, newTitle, newContent);
      await tx.wait();

      const updatedNotes = await botNotes.connect(alice).getMyNotes();
      expect(updatedNotes[0].title).to.equal(newTitle);
      expect(updatedNotes[0].content).to.equal(newContent);
      expect(updatedNotes[0].createdAt).to.equal(initialCreatedAt);
      expect(updatedNotes[0].updatedAt).to.be.gt(initialUpdatedAt);
    });

    it("emits NoteUpdated event with correct information", async function () {
      await expect(botNotes.connect(alice).updateNote(1, "Updated Title", "Updated Content"))
        .to.emit(botNotes, "NoteUpdated")
        .withArgs(1n, alice.address, "Updated Title", (val: bigint) => val > 0n);
    });

    it("reverts if non-owner tries to edit someone else's note", async function () {
      await expect(
        botNotes.connect(bob).updateNote(1, "Hacked Title", "Hacked Content")
      ).to.be.revertedWithCustomError(botNotes, "NotNoteOwner");
    });

    it("reverts if trying to update an invalid or nonexistent note ID", async function () {
      await expect(
        botNotes.connect(alice).updateNote(999, "Title", "Content")
      ).to.be.revertedWithCustomError(botNotes, "NoteNotFound");
    });

    it("reverts if updating with an empty title", async function () {
      await expect(
        botNotes.connect(alice).updateNote(1, "", "New content")
      ).to.be.revertedWithCustomError(botNotes, "EmptyTitle");
    });

    it("reverts if updating with title exceeding 80 characters", async function () {
      await expect(
        botNotes.connect(alice).updateNote(1, "x".repeat(81), "New content")
      ).to.be.revertedWithCustomError(botNotes, "TitleTooLong");
    });

    it("reverts if updating with empty content", async function () {
      await expect(
        botNotes.connect(alice).updateNote(1, "New Title", "")
      ).to.be.revertedWithCustomError(botNotes, "EmptyContent");
    });

    it("reverts if updating with content exceeding 500 characters", async function () {
      await expect(
        botNotes.connect(alice).updateNote(1, "New Title", "y".repeat(501))
      ).to.be.revertedWithCustomError(botNotes, "ContentTooLong");
    });
  });

  describe("Wallet Isolation", function () {
    it("ensures different wallets have separate note collections", async function () {
      await botNotes.connect(alice).createNote("Alice Note 1", "Content A1");
      await botNotes.connect(alice).createNote("Alice Note 2", "Content A2");
      await botNotes.connect(bob).createNote("Bob Note 1", "Content B1");

      const aliceNotes = await botNotes.connect(alice).getMyNotes();
      const bobNotes = await botNotes.connect(bob).getMyNotes();
      const ownerNotes = await botNotes.connect(owner).getMyNotes();

      expect(aliceNotes.length).to.equal(2);
      expect(aliceNotes[0].title).to.equal("Alice Note 1");
      expect(aliceNotes[1].title).to.equal("Alice Note 2");

      expect(bobNotes.length).to.equal(1);
      expect(bobNotes[0].title).to.equal("Bob Note 1");
      expect(bobNotes[0].id).to.equal(3n);

      expect(ownerNotes.length).to.equal(0);
    });
  });
});
