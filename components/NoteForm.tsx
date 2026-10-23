"use client";

import React, { useState, useEffect } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { BOT_NOTES_CONTRACT_ADDRESS, BOT_NOTES_ABI } from "@/lib/contract";
import { PlusCircle, Loader2, CheckCircle2, AlertCircle, ExternalLink, ShieldAlert } from "lucide-react";

interface NoteFormProps {
  onSuccess: () => void;
}

export function NoteForm({ onSuccess }: NoteFormProps) {
  const { isConnected } = useAccount();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const {
    data: txHash,
    error: writeError,
    isPending: isConfirmingInWallet,
    writeContract,
    reset: resetWrite,
  } = useWriteContract();

  const {
    isLoading: isWaitingForTx,
    isSuccess: isTxConfirmed,
    error: waitError,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  useEffect(() => {
    if (isTxConfirmed) {
      setTitle("");
      setContent("");
      onSuccess();
      const timer = setTimeout(() => {
        resetWrite();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isTxConfirmed, onSuccess, resetWrite]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!isConnected) {
      setValidationError("Please connect your wallet first.");
      return;
    }

    if (!BOT_NOTES_CONTRACT_ADDRESS) {
      setValidationError("ChainNotes contract is not configured yet.");
      return;
    }

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (trimmedTitle.length === 0) {
      setValidationError("Please enter a title for your note.");
      return;
    }
    if (trimmedTitle.length > 80) {
      setValidationError("Title cannot exceed 80 characters.");
      return;
    }
    if (trimmedContent.length === 0) {
      setValidationError("Please enter content for your note.");
      return;
    }
    if (trimmedContent.length > 500) {
      setValidationError("Content cannot exceed 500 characters.");
      return;
    }

    writeContract({
      address: BOT_NOTES_CONTRACT_ADDRESS,
      abi: BOT_NOTES_ABI,
      functionName: "createNote",
      args: [trimmedTitle, trimmedContent],
    });
  };

  const isSubmitting = isConfirmingInWallet || isWaitingForTx;

  return (
    <div className="glow-card rounded-2xl p-6 sm:p-7 border border-slate-800">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-5">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-emerald-400" />
            Create New Note
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Store a note permanently on Botchain Mainnet
          </p>
        </div>
      </div>

      {/* Security Warning Notice */}
      <div className="mb-5 flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
        <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
        <div>
          <span className="font-semibold text-amber-200">Public Blockchain Reminder:</span> All note data is publicly visible on Botchain. Never store private keys, passwords, or sensitive personal data.
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Input */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label htmlFor="note-title" className="text-xs font-semibold text-slate-300">
              Note Title
            </label>
            <span
              className={`text-[11px] font-mono ${
                title.length > 80 ? "text-red-400 font-bold" : "text-slate-400"
              }`}
            >
              {title.length}/80
            </span>
          </div>
          <input
            id="note-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSubmitting || !isConnected}
            maxLength={80}
            placeholder="e.g. Daily Standup Notes or Smart Contract Checklist"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all disabled:opacity-50"
          />
        </div>

        {/* Content Textarea */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label htmlFor="note-content" className="text-xs font-semibold text-slate-300">
              Note Content
            </label>
            <span
              className={`text-[11px] font-mono ${
                content.length > 500 ? "text-red-400 font-bold" : "text-slate-400"
              }`}
            >
              {content.length}/500
            </span>
          </div>
          <textarea
            id="note-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isSubmitting || !isConnected}
            rows={4}
            maxLength={500}
            placeholder="Write your note content here..."
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none disabled:opacity-50"
          />
        </div>

        {/* Validation Error Message */}
        {validationError && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Transaction Lifecycle Statuses */}
        {isConfirmingInWallet && (
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            <span>Confirm the transaction in your wallet...</span>
          </div>
        )}

        {isWaitingForTx && (
          <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 space-y-1.5">
            <div className="flex items-center gap-2 font-medium">
              <Loader2 className="w-4 h-4 animate-spin shrink-0 text-blue-400" />
              <span>Transaction submitted. Waiting for confirmation...</span>
            </div>
            {txHash && (
              <a
                href={`https://scan.botchain.ai/tx/${txHash}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 underline text-[11px]"
              >
                <img
                  src="/botchain-logo.png"
                  alt="BOT Chain Logo"
                  className="w-3 h-3 rounded object-contain shrink-0"
                />
                View transaction on BotchainScan ({txHash.slice(0, 10)}...{txHash.slice(-8)})
              </a>
            )}
          </div>
        )}

        {isTxConfirmed && (
          <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <div className="space-y-0.5">
              <span className="font-semibold">Note saved successfully on Botchain!</span>
              {txHash && (
                <div>
                  <a
                    href={`https://scan.botchain.ai/tx/${txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 underline hover:text-emerald-300"
                  >
                    <img
                      src="/botchain-logo.png"
                      alt="BOT Chain Logo"
                      className="w-3 h-3 rounded object-contain shrink-0"
                    />
                    View on BotchainScan <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {(writeError || waitError) && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 space-y-1">
            <div className="flex items-center gap-2 font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Transaction failed or rejected</span>
            </div>
            <p className="text-[11px] text-red-300/80 break-words">
              {(writeError?.message || waitError?.message || "An unknown error occurred.")
                .slice(0, 160)}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={
              isSubmitting ||
              !isConnected ||
              title.trim().length === 0 ||
              content.trim().length === 0
            }
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving Note...
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                Save Note on-chain
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
