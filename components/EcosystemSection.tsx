"use client";

import React from "react";
import { Globe, ExternalLink, Cpu, Database, ArrowUpRight, Zap, ShieldCheck } from "lucide-react";
import { BOT_NOTES_CONTRACT_ADDRESS } from "@/lib/contract";

export function BotChainLogo({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <img
      src="/botchain-logo.png"
      alt="BOT Chain Logo"
      className={`${className} rounded-lg object-contain`}
    />
  );
}

export function EcosystemSection() {
  return (
    <section aria-label="BOT Chain Ecosystem" className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center p-1">
            <BotChainLogo className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              BOT Chain Ecosystem
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                Mainnet Live
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              High-performance EVM blockchain with ultra-low fees and native BOT token utility.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Chain ID: 677
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300">
            Total Supply: 150M BOT
          </span>
        </div>
      </div>

      {/* Ecosystem Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* BOT Chain Website Card */}
        <a
          href="https://botchain.ai"
          target="_blank"
          rel="noreferrer"
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950 border border-slate-800 hover:border-emerald-500/40 p-5 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5 block"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <BotChainLogo className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                    Official Portal
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                  BOT Chain Website
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">
                  https://botchain.ai
                </p>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-300/80 mt-3.5 leading-relaxed">
            Explore the official BOT Chain network, developer documentation, native tokenomics, and decentralized ecosystem roadmap.
          </p>
        </a>

        {/* BOT Chain Explorer Card */}
        <a
          href="https://scan.botchain.ai"
          target="_blank"
          rel="noreferrer"
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950 border border-slate-800 hover:border-teal-500/40 p-5 transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/5 block"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform text-teal-400">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">
                    Block Explorer
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors flex items-center gap-1.5">
                  BOT Chain Explorer
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-teal-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">
                  https://scan.botchain.ai
                </p>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-300/80 mt-3.5 leading-relaxed">
            Real-time public ledger viewer for BOT Chain transactions, blocks, gas metrics, and verified smart contracts like ChainNotes.
          </p>
        </a>
      </div>
    </section>
  );
}
