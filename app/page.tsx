"use client";

import React, { useRef, useState } from "react";
import { WalletButton } from "@/components/WalletButton";
import { NotesOverview } from "@/components/NotesOverview";
import { NoteForm } from "@/components/NoteForm";
import { NoteList } from "@/components/NoteList";
import { BookOpen, ExternalLink, ShieldAlert, Cpu, Heart } from "lucide-react";

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
                  Botchain Testnet
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Your notes, stored on Botchain.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <WalletButton />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
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
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 py-8 bg-slate-950/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>Built for Botchain Testnet (Chain ID 968)</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://rpc.bohr.life"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-300 transition-colors"
            >
              RPC Endpoint
            </a>
            <a
              href="https://scan.bohr.life"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-300 inline-flex items-center gap-1 transition-colors"
            >
              <span>BohrScan Explorer</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div>
            <span>ChainNotes &bull; On-chain Notes dApp</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
