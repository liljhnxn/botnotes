"use client";

import React, { useState, useEffect } from "react";
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain, useBalance } from "wagmi";
import { botchainMainnet } from "@/lib/botchain";
import { Wallet, LogOut, AlertTriangle, CheckCircle2, ChevronDown, ExternalLink } from "lucide-react";

export function WalletButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const { data: balanceData } = useBalance({
    address,
    chainId: botchainMainnet.id,
  });

  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-10 w-36 rounded-xl bg-slate-800/60 animate-pulse border border-slate-700/50" />
    );
  }

  const isWrongNetwork = isConnected && chainId !== botchainMainnet.id;

  const truncateAddress = (addr?: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (!isConnected) {
    return (
      <div className="relative inline-block">
        <button
          onClick={() => {
            const connector = connectors[0];
            if (connector) {
              connect({ connector });
            }
          }}
          disabled={isConnecting}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all duration-200 active:scale-95 disabled:opacity-50"
        >
          <Wallet className="w-4 h-4" />
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {isWrongNetwork ? (
        <button
          onClick={() => switchChain({ chainId: botchainMainnet.id })}
          disabled={isSwitching}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition-all animate-pulse"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          {isSwitching ? "Switching..." : "Switch to Botchain Mainnet"}
        </button>
      ) : (
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Botchain Mainnet (677)</span>
        </div>
      )}

      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="inline-flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-200 hover:bg-slate-700/60 hover:border-slate-600 transition-all"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{truncateAddress(address)}</span>
          {balanceData && (
            <span className="text-slate-400 font-mono">
              ({parseFloat(balanceData.formatted).toFixed(3)} {balanceData.symbol})
            </span>
          )}
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>

        {menuOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setMenuOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-2 border-b border-slate-800 text-xs">
                <p className="text-slate-400 font-medium">Connected Account</p>
                <p className="font-mono text-slate-200 break-all text-[11px] mt-0.5">
                  {address}
                </p>
              </div>

              {address && (
                <a
                  href={`https://scan.botchain.ai/address/${address}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg mt-1 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <img
                      src="/botchain-logo.png"
                      alt="BOT Chain Logo"
                      className="w-3.5 h-3.5 rounded object-contain shrink-0"
                    />
                    View on BotchainScan
                  </span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              )}

              <button
                onClick={() => {
                  disconnect();
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-lg mt-1 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Disconnect
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
