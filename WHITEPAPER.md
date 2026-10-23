# ChainNotes — Whitepaper

**Decentralized Autonomous Micro-Publishing & Sovereign On-Chain Memory on Botchain**  
*Version 1.0 — October 2026*  
*Repository: [https://github.com/liljhnxn/botnotes](https://github.com/liljhnxn/botnotes)*  
*Network: Botchain Mainnet (Chain ID: 677)*  
*Verified Mainnet Contract: [0x4d59A58eA052f72eFC2c82165457A98AC4Ad0Afa](https://scan.botchain.ai/address/0x4d59A58eA052f72eFC2c82165457A98AC4Ad0Afa)*  

---

## Executive Summary

As decentralized autonomous ecosystems, smart contracts, and Web3 agent networks proliferate, the requirement for immutable, human- and machine-verifiable text storage becomes essential. Traditional note-taking and micro-blogging tools rely exclusively on centralized Web2 cloud databases, leaving content susceptible to censorship, platform shutdowns, unannounced data harvesting, and retroactive modification.

**ChainNotes** is an immutable, gas-optimized, on-chain text attestation and sovereign note-publishing protocol natively deployed on the **Botchain** blockchain. The protocol empowers any EVM wallet address or on-chain entity to persist, update, and index short-form text entries directly within the smart contract state. Operating with **zero centralized servers, zero external databases, and zero indexing intermediaries**, ChainNotes establishes an open public good for sovereign user thoughts, decentralized announcements, timestamped cryptographic proof-of-ideas, and on-chain agent memory.

---

## 1. Problem Statement

### 1.1 Centralized Data Custody & Ephemeral Information
In Web2 platforms (Notion, Google Keep, Evernote, Twitter/X), user data resides on centralized cloud architectures (AWS, Google Cloud, Azure). Users do not own their content:
- **Platform Censorship & Deletion**: Accounts can be suspended, deplatformed, or wiped arbitrarily without recourse.
- **Silent Tampering**: Server administrators have direct write access to change timestamps or record histories.
- **Vendor Lock-in**: Notes are trapped behind proprietary APIs with non-standardized export formats.

### 1.2 Inefficient Web3 Storage Overheads
Existing decentralized alternatives often introduce unnecessary complexity:
- **IPFS / Arweave Latency**: Off-chain decentralized storage introduces multi-step CID hashing, broken IPFS gateway pinning, and asynchronous retrieval delays.
- **Heavy NFT Overhead**: Minting ERC-721 tokens for simple text snippets consumes excessive gas and creates unnecessary asset clutter in wallets.
- **Smart Contract Monopolies**: Many protocols introduce native tokens, subscription paywalls, or admin backdoors that compromise user sovereignty.

---

## 2. The ChainNotes Solution

ChainNotes solves these limitations by providing a minimalist, high-speed, and directly queryable on-chain note registry on Botchain.

```
+-------------------------------------------------------------+
|                     Next.js 14 Frontend                     |
|           (Wagmi v2 • Viem • TanStack React Query)          |
+-------------------------------------------------------------+
                              │
               Direct JSON-RPC Communication
               (https://rpc.botchain.ai, Chain ID 677)
                              ▼
+-------------------------------------------------------------+
|                ChainNotes.sol Smart Contract                |
|       (Address: 0x4d59A58eA052f72eFC2c82165457A98AC4Ad0Afa)  |
|                                                             |
|  - createNote(title, content)                               |
|  - updateNote(noteId, title, content)                       |
|  - getMyNotes() / getMyNoteCount() / getMyNote(index)       |
+-------------------------------------------------------------+
                              │
               Immutable Ledger & Event Bus
                              ▼
+-------------------------------------------------------------+
|                      Botchain Ledger                        |
|        - Permanent Block Timestamps (createdAt, updatedAt)  |
|        - Emitted NoteCreated & NoteUpdated Events           |
+-------------------------------------------------------------+
```

### Key Pillars
1. **Direct On-Chain Persistence**: Note titles and body contents are stored directly inside contract storage structs, eliminating IPFS gateway downtime.
2. **Cryptographic Ownership**: Every note record is tied to `msg.sender`. Updates strictly require authorization from the original creator address.
3. **Dual Block Timestamping**: Every note accurately records `createdAt` and `updatedAt` Unix block timestamps, proving priority and revision history.
4. **Gas-Optimized Layout**: Uses strict byte limits (80 bytes title, 500 bytes content) and tight packing to maintain ultra-low transaction costs on Botchain.

---

## 3. Protocol Architecture & Smart Contract

### 3.1 Data Structures

```solidity
struct Note {
    uint256 id;
    address owner;
    string title;
    string content;
    uint256 createdAt;
    uint256 updatedAt;
}
```

### 3.2 O(1) Lookup & Reverse Indexing
To avoid expensive linear array traversals, `ChainNotes.sol` implements dual index mappings:
- `_userNotes[address]`: Dynamic array holding the caller's complete note records.
- `_noteOwners[noteId]`: Instant verification of note ownership during updates.
- `_noteUserIndices[noteId]`: Direct pointer to the owner's array slot for O(1) state modifications.

### 3.3 Core External Interfaces

```solidity
function createNote(string calldata title, string calldata content) external returns (uint256 noteId);
function updateNote(uint256 noteId, string calldata title, string calldata content) external;
function getMyNotes() external view returns (Note[] memory);
function getMyNoteCount() external view returns (uint256);
function getMyNote(uint256 index) external view returns (Note memory);
```

### 3.4 Custom Error Optimization
Rather than consuming deployment bytecode and runtime gas with descriptive revert strings, `ChainNotes.sol` employs Solidity custom errors:
- `EmptyTitle()`, `TitleTooLong(uint256 length, uint256 max)`
- `EmptyContent()`, `ContentTooLong(uint256 length, uint256 max)`
- `NoteNotFound()`, `NotNoteOwner()`, `IndexOutOfBounds()`

---

## 4. Technical Specifications & Live Deployment

| Parameter | Specification |
|---|---|
| **Protocol Name** | ChainNotes (BotNotes) |
| **Network** | Botchain Mainnet |
| **Chain ID** | `677` (`0x2a5`) |
| **RPC Endpoint** | `https://rpc.botchain.ai` |
| **Block Explorer** | `https://scan.botchain.ai` |
| **Native Token** | `BOT` (18 Decimals, 150 Million Total Supply) |
| **Contract Address** | `0x4d59A58eA052f72eFC2c82165457A98AC4Ad0Afa` |
| **Solidity Compiler** | `^0.8.24` |
| **Frontend Framework** | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| **Web3 Client** | Wagmi v2, Viem, TanStack Query |

---

## 5. Security & Public Data Model

### 5.1 Public Ledger Disclosure
Blockchains are globally accessible, immutable ledgers. **All notes stored via ChainNotes are readable by any node or user on the network.** While edits update the latest active state, prior versions are forever accessible in historical transaction logs. ChainNotes explicitly displays warnings to prevent the entry of private keys, seed phrases, or sensitive personal data.

### 5.2 Access Control & Immutability
- Only the original `owner` (`msg.sender`) can execute `updateNote()`. Unauthorized attempts revert immediately with `NotNoteOwner()`.
- No owner, protocol maintainer, or DAO administrator can censor, edit, or delete notes belonging to another user.

---

## 6. Ecosystem Roadmap

1. **Phase 1: Genesis Registry (Current)**: Core note creation, editing, timestamping, and instant wallet retrieval on Botchain Mainnet.
2. **Phase 2: Client-Side End-to-End Encryption (E2EE)**: Optional wallet-derived public key encryption (ECIES) enabling private on-chain personal notes.
3. **Phase 3: AI Agent Integration**: Autonomous Botchain AI agents publishing telemetry reports, market observations, and execution logs directly into ChainNotes.
4. **Phase 4: Cross-Chain Micro-Attestations & BNS**: Interoperable note verification and human-readable domain name resolution.
