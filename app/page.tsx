"use client";

import React, { useRef, useState } from "react";
import { WalletButton } from "@/components/WalletButton";
import { NotesOverview } from "@/components/NotesOverview";
import { NoteForm } from "@/components/NoteForm";
import { NoteList } from "@/components/NoteList";
import { EcosystemSection, BotChainLogo } from "@/components/EcosystemSection";
import { BookOpen, ExternalLink, ShieldAlert, Cpu, Heart, Globe, Database } from "lucide-react";
import { BOT_NOTES_CONTRACT_ADDRESS } from "@/lib/contract";

export default function Home() {
  const formRef = useRef<HTMLDivElement>(null);
  const [refreshToken, setRefreshToken] = useState(0);

  const handleRefresh = () => {
    setRefreshToken((prev) => prev + 1);
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
    const input = document.getElementById("note-title");
    if (input) {
      input.focus();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100">
      {/* Top Navigation / Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#090d16]/80 border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-md shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-white">
                  ChainNotes
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  BOT Chain Mainnet
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Your sovereign notes, permanently on BOT Chain.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href="https://botchain.ai"
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:border-emerald-500/40 transition-all shadow-sm"
              title="BOT Chain Official Website"
            >
              <BotChainLogo className="w-4 h-4 shrink-0" />
              <span>BOT Chain Website</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            <a
              href="https://scan.botchain.ai"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-800/80 border border-slate-700/80 text-emerald-400 hover:text-emerald-300 hover:bg-slate-800 hover:border-emerald-500/40 transition-all shadow-sm"
              title="BOT Chain Explorer"
            >
              <BotChainLogo className="w-4 h-4 shrink-0" />
              <span>BOT Chain Explorer</span>
              <ExternalLink className="w-3 h-3 text-emerald-400/70" />
            </a>

            <WalletButton />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-10">
        {/* Notes Overview & Stats */}
        <section aria-label="Overview">
          <NotesOverview
            onCreateClick={scrollToForm}
            refreshToken={refreshToken}
          />
        </section>

        {/* Create Note Section */}
        <section ref={formRef} aria-label="Create Note">
          <NoteForm onSuccess={handleRefresh} />
        </section>

        {/* Notes List Section */}
        <section aria-label="Notes List">
          <NoteList refreshToken={refreshToken} onRefreshNeeded={handleRefresh} />
        </section>

        {/* BOT Chain Ecosystem Section */}
        <EcosystemSection />
      </main>

      {/* Footer with BOT Chain Logo & Official Links */}
      <footer className="mt-auto border-t border-slate-800/80 py-10 bg-slate-950/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800/60">
            {/* BOT Chain Branding & Logo */}
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-emerald-500/20 flex items-center justify-center p-1.5 shadow-md shadow-emerald-500/10">
                <BotChainLogo className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-white text-base tracking-tight">
                    BOT Chain
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Chain ID: 677
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  High-speed, low-gas decentralized EVM infrastructure.
                </p>
              </div>
            </div>

            {/* Official Links Required with Logo at the front */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://botchain.ai"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-xs font-semibold text-slate-200 hover:text-white transition-all shadow-sm group"
              >
                <BotChainLogo className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" />
                <span>BOT Chain website</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>

              <a
                href="https://scan.botchain.ai"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-xs font-semibold text-slate-200 hover:text-white transition-all shadow-sm group"
              >
                <BotChainLogo className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" />
                <span>BOT Chain explorer</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>

              <a
                href="https://rpc.botchain.ai"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 hover:text-slate-300 transition-colors"
              >
                <span>RPC: rpc.botchain.ai</span>
              </a>
            </div>
          </div>

          {/* Sub-footer copyright & contract note */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>ChainNotes &bull; Sovereign Micro-Publishing dApp on BOT Chain</span>
            </div>

            {BOT_NOTES_CONTRACT_ADDRESS && (
              <a
                href={`https://scan.botchain.ai/address/${BOT_NOTES_CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-[11px] text-slate-400 hover:text-emerald-400 transition-colors"
              >
                Contract: {BOT_NOTES_CONTRACT_ADDRESS.slice(0, 10)}...{BOT_NOTES_CONTRACT_ADDRESS.slice(-8)}
              </a>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
