import { Address } from "viem";

const configuredAddress =
  process.env.NEXT_PUBLIC_CHAIN_NOTES_ADDRESS ||
  process.env.NEXT_PUBLIC_BOT_NOTES_ADDRESS;

export const CHAIN_NOTES_CONTRACT_ADDRESS: Address | undefined =
  configuredAddress &&
  configuredAddress.trim().startsWith("0x") &&
  configuredAddress.trim().length === 42
    ? (configuredAddress.trim() as Address)
    : undefined;

// Backward-compatible alias
export const BOT_NOTES_CONTRACT_ADDRESS = CHAIN_NOTES_CONTRACT_ADDRESS;

export const isContractConfigured = Boolean(CHAIN_NOTES_CONTRACT_ADDRESS);

export const CHAIN_NOTES_ABI = [
  {
    type: "function",
    name: "createNote",
    inputs: [
      { name: "title", type: "string", internalType: "string" },
      { name: "content", type: "string", internalType: "string" },
    ],
    outputs: [{ name: "noteId", type: "uint256", internalType: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "updateNote",
    inputs: [
      { name: "noteId", type: "uint256", internalType: "uint256" },
      { name: "title", type: "string", internalType: "string" },
      { name: "content", type: "string", internalType: "string" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getMyNotes",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        internalType: "struct BotNotes.Note[]",
        components: [
          { name: "id", type: "uint256", internalType: "uint256" },
          { name: "owner", type: "address", internalType: "address" },
          { name: "title", type: "string", internalType: "string" },
          { name: "content", type: "string", internalType: "string" },
          { name: "createdAt", type: "uint256", internalType: "uint256" },
          { name: "updatedAt", type: "uint256", internalType: "uint256" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getMyNoteCount",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getMyNote",
    inputs: [{ name: "index", type: "uint256", internalType: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct BotNotes.Note",
        components: [
          { name: "id", type: "uint256", internalType: "uint256" },
          { name: "owner", type: "address", internalType: "address" },
          { name: "title", type: "string", internalType: "string" },
          { name: "content", type: "string", internalType: "string" },
          { name: "createdAt", type: "uint256", internalType: "uint256" },
          { name: "updatedAt", type: "uint256", internalType: "uint256" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "MAX_TITLE_LENGTH",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "MAX_CONTENT_LENGTH",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "NoteCreated",
    inputs: [
      { name: "noteId", type: "uint256", indexed: true, internalType: "uint256" },
      { name: "owner", type: "address", indexed: true, internalType: "address" },
      { name: "title", type: "string", indexed: false, internalType: "string" },
      { name: "createdAt", type: "uint256", indexed: false, internalType: "uint256" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "NoteUpdated",
    inputs: [
      { name: "noteId", type: "uint256", indexed: true, internalType: "uint256" },
      { name: "owner", type: "address", indexed: true, internalType: "address" },
      { name: "title", type: "string", indexed: false, internalType: "string" },
      { name: "updatedAt", type: "uint256", indexed: false, internalType: "uint256" },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "EmptyTitle",
    inputs: [],
  },
  {
    type: "error",
    name: "TitleTooLong",
    inputs: [
      { name: "length", type: "uint256", internalType: "uint256" },
      { name: "max", type: "uint256", internalType: "uint256" },
    ],
  },
  {
    type: "error",
    name: "EmptyContent",
    inputs: [],
  },
  {
    type: "error",
    name: "ContentTooLong",
    inputs: [
      { name: "length", type: "uint256", internalType: "uint256" },
      { name: "max", type: "uint256", internalType: "uint256" },
    ],
  },
  {
    type: "error",
    name: "NoteNotFound",
    inputs: [],
  },
  {
    type: "error",
    name: "NotNoteOwner",
    inputs: [],
  },
  {
    type: "error",
    name: "IndexOutOfBounds",
    inputs: [],
  },
] as const;

// Backward-compatible alias
export const BOT_NOTES_ABI = CHAIN_NOTES_ABI;

export interface NoteItem {
  id: bigint;
  owner: Address;
  title: string;
  content: string;
  createdAt: bigint;
  updatedAt: bigint;
}
