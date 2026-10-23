"use client";

import React from "react";
import { useAccount, useReadContract } from "wagmi";
import { BOT_NOTES_CONTRACT_ADDRESS, BOT_NOTES_ABI, isContractConfigured } from "@/lib/contract";
import { FileText, ShieldAlert, Sparkles, ExternalLink, Plus, HardDrive } from "lucide-react";

interface NotesOverviewProps {
  onCreateClick: () => void;
  refreshToken?: number;
}

export function NotesOverview({ onCreateClick }: NotesOverviewProps) {
  const { address, isConnected } = useAccount();

  const { data: noteCount, isLoading } = useReadContract({
    address: BOT_NOTES_CONTRACT_ADDRESS,
    abi: BOT_NOTES_ABI,
    functionName: "getMyNoteCount",
    account: address,
    query: {
      enabled: isConnected && isContractConfigured,
    },
  });

  return (
    <div className="space-y-4">
      {/* Contract not configured banner */}
      {!isContractConfigured && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-start gap-3 shadow-lg">
          <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-amber-400" />
          <div className="text-xs space-y-1">
            <p className="font-semibold text-amber-200 text-sm">
              ChainNotes contract is not configured yet.
            </p>
            <p className="text-amber-300/80">
              Please deploy the smart contract using Hardhat and set{" "}
              <code className="bg-amber-500/20 px-1.5 py-0.5 rounded font-mono text-[11px] text-amber-200">
                NEXT_PUBLIC_CHAIN_NOTES_ADDRESS
              </code>{" "}
              in your <code className="font-mono">.env.local</code> file.
            </p>
          </div>
        </div>
      )}

      {/* Hero / Overview Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Decentralized &amp; Immutable Ledger</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              On-Chain Notes on <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Botchain</span>
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              ChainNotes stores your thoughts, code snippets, and checklists directly on Botchain Mainnet. 
              Each note is cryptographically owned by your connected wallet, accessible only by you, and permanent.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {/* Real Stats Card */}
            <div className="px-5 py-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <HardDrive className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Your Notes</p>
                <p className="text-2xl font-bold font-mono text-white">
                  {!isConnected ? (
                    "—"
                  ) : isLoading ? (
                    "..."
                  ) : (
                    noteCount !== undefined ? noteCount.toString() : "0"
                  )}
                </p>
              </div>
            </div>

            {/* Create Note Action */}
            <button
              onClick={onCreateClick}
              className="inline-flex items-center justify-center gap-2 px-5 py-4 text-sm font-semibold rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all duration-200 active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Create Note</span>
            </button>
          </div>
        </div>

        {/* Footer info: Explorer link */}
        {isContractConfigured && BOT_NOTES_CONTRACT_ADDRESS && (
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-3">
            <div className="flex items-center gap-2 font-mono">
              <span className="text-slate-500">Contract:</span>
              <span className="text-slate-300 bg-slate-950/70 px-2 py-0.5 rounded-lg border border-slate-800">
                {BOT_NOTES_CONTRACT_ADDRESS}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={`https://scan.botchain.ai/address/${BOT_NOTES_CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/20 transition-all font-medium"
              >
                <img
                  src="/botchain-logo.png"
                  alt="BOT Chain Logo"
                  className="w-4 h-4 rounded object-contain shrink-0"
                />
                <span>View Contract on Mainnet Explorer</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://scan.botchain.ai"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <img
                  src="/botchain-logo.png"
                  alt="BOT Chain Logo"
                  className="w-3.5 h-3.5 rounded object-contain shrink-0"
                />
                <span>BotchainScan</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
