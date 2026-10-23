# ChainNotes 📝

**ChainNotes** is a simple, decentralized on-chain notes dApp built for **Botchain Testnet**. It enables users to create, view, and edit short notes that are permanently stored directly on the blockchain.

Every note is cryptographically owned by the creator's wallet. There is no centralized backend, no external database, no tracking, and no third-party API dependencies.

---

## ⚠️ Security Notice: Public Blockchain Data

> **IMPORTANT WARNING:**
> Blockchains are public, permanent, and immutable ledgers.
> - Any note you write to ChainNotes is publicly visible to anyone on the network.
> - Editing a note updates the current on-chain state, but **past versions remain permanently recorded in blockchain history**.
> - **Never store private keys, seed phrases, passwords, personal identifying information (PII), or confidential secrets in ChainNotes.**

---

## Features

- **Decentralized Note Storage**: Notes are persisted in the `ChainNotes` smart contract on Botchain Mainnet.
- **Wallet-Owned**: Each wallet accesses and manages only its own notes.
- **On-Chain Creation & Editing**: Users can create new notes and update existing notes with real-time character limits.
- **Timestamp Tracking**: Tracks both `createdAt` and `updatedAt` block timestamps.
- **Zero Centralized Backend**: Pure Web3 architecture with direct RPC communication.
- **Modern Dark UI**: Polished, responsive dark theme styled with Tailwind CSS and Lucide React.
- **Transaction Feedback**: Real-time status indicators (Confirm in wallet, Submitted, Confirming, Success) with direct links to the BotchainScan Explorer.

---

## Tech Stack

- **Smart Contract**: Solidity `^0.8.24`, Hardhat, Ethers.js v6, TypeChain
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Web3 Integration**: Wagmi v2, Viem, TanStack React Query
- **Icons**: Lucide React

---

## Botchain Mainnet Configuration

| Parameter | Value |
|---|---|
| **Network Name** | Botchain Mainnet |
| **Chain ID** | `677` |
| **RPC Endpoint** | `https://rpc.botchain.ai` |
| **Block Explorer** | [https://scan.botchain.ai](https://scan.botchain.ai) |
| **Currency Symbol** | `BOT` |
| **Total Supply** | 150 Million |
| **Live Mainnet Contract** | [`0x4d59A58eA052f72eFC2c82165457A98AC4Ad0Afa`](https://scan.botchain.ai/address/0x4d59A58eA052f72eFC2c82165457A98AC4Ad0Afa) |

---

## Smart Contract Specifications

- **File**: `contracts/ChainNotes.sol`
- **Compiler**: Solidity `^0.8.24`
- **Limits**:
  - Title: 1 – 80 characters
  - Content: 1 – 500 characters
- **Functions**:
  - `createNote(string calldata title, string calldata content)`: Creates a new note assigned to `msg.sender`.
  - `updateNote(uint256 noteId, string calldata title, string calldata content)`: Updates an existing note (restricted to original owner).
  - `getMyNotes()`: Returns all notes owned by the caller.
  - `getMyNoteCount()`: Returns caller's note count.
  - `getMyNote(uint256 index)`: Returns a single note by caller index.

---

## Project Structure

```text
chainnotes/
├── contracts/
│   ├── ChainNotes.sol          # Primary smart contract
│   └── BotNotes.sol            # Backwards-compatible wrapper
├── test/
│   └── BotNotes.ts             # Comprehensive Hardhat unit tests
├── scripts/
│   ├── deploy-mainnet.cjs      # Direct low-gas deployment script for Botchain Mainnet
│   └── deploy.ts               # Hardhat deployment script for Botchain Mainnet
├── app/
│   ├── globals.css             # Tailwind base and dark Web3 styling
│   ├── layout.tsx              # Next.js root layout with Providers
│   └── page.tsx                # Main single-page application
├── components/
│   ├── Providers.tsx           # Wagmi and React Query providers
│   ├── WalletButton.tsx        # Wallet connection, switch network, and account dropdown
│   ├── NotesOverview.tsx       # Real statistics and quick actions
│   ├── NoteForm.tsx            # Note creation form with character count & tx states
│   ├── NoteList.tsx            # User note cards and empty state
│   └── EditNoteModal.tsx       # Note editing modal dialog with tx lifecycle
├── lib/
│   ├── botchain.ts             # Custom Botchain Mainnet chain and wagmi configuration
│   └── contract.ts             # Contract ABI, typed interfaces, and address resolver
├── hardhat.config.ts           # Hardhat configuration
├── package.json
└── README.md
```

---

## Installation & Setup

### 1. Clone & Install Dependencies

```bash
git clone <repository-url>
cd chainnotes
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` (or `.env.local` for Next.js):

```bash
cp .env.example .env
```

Set the following variables:

```env
# Deployed contract address
NEXT_PUBLIC_CHAIN_NOTES_ADDRESS=0x4d59A58eA052f72eFC2c82165457A98AC4Ad0Afa

# Deployer wallet private key (required only for deploying to Mainnet)
PRIVATE_KEY=your_private_key_here

# Botchain Mainnet RPC
BOTCHAIN_RPC_URL=https://rpc.botchain.ai
```

---

## Running Smart Contract Tests

Run the complete test suite:

```bash
npm run test
```

The tests verify:
- Creating notes with proper title, content, creator, and timestamps
- Event emission for `NoteCreated` and `NoteUpdated`
- Validation limits (empty titles/content, >80 char titles, >500 char content)
- Owner-only editing and preserving `createdAt` while updating `updatedAt`
- Rejecting edits from non-owners or invalid note IDs
- Complete wallet isolation between different user addresses

---

## Deploying to Botchain Mainnet

To deploy or redeploy the contract to Botchain Mainnet:

```bash
npm run deploy:mainnet
```

The script automatically:
- Connects to Botchain Mainnet (Chain ID `677`)
- Checks deployer balance and network gas price
- Deploys `ChainNotes` with optimal minimal gas settings (typically < 0.02 BOT)
- Updates `.env` with the new contract address
- Provides the direct BotchainScan Explorer link: [https://scan.botchain.ai/address/0x4d59A58eA052f72eFC2c82165457A98AC4Ad0Afa](https://scan.botchain.ai/address/0x4d59A58eA052f72eFC2c82165457A98AC4Ad0Afa)

---

## Starting the Frontend

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

To create a production build:

```bash
npm run build
npm run start
```

---

## License

MIT
