"use client";

import React, { useState, useEffect } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { BOT_NOTES_CONTRACT_ADDRESS, BOT_NOTES_ABI, NoteItem } from "@/lib/contract";
import { X, Loader2, CheckCircle2, AlertCircle, ExternalLink, Save } from "lucide-react";

interface EditNoteModalProps {
  note: NoteItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditNoteModal({ note, isOpen, onClose, onSuccess }: EditNoteModalProps) {
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
    if (note && isOpen) {
      setTitle(note.title);
      setContent(note.content);
      setValidationError(null);
      resetWrite();
    }
  }, [note, isOpen, resetWrite]);

  useEffect(() => {
    if (isTxConfirmed) {
      const timer = setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isTxConfirmed, onSuccess, onClose]);

  if (!isOpen || !note) return null;

  const titleLength = title.trim().length;
  const contentLength = content.trim().length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!BOT_NOTES_CONTRACT_ADDRESS) {
      setValidationError("ChainNotes contract is not configured yet.");
      return;
    }

    if (title.trim().length === 0) {
      setValidationError("Please enter a note title.");
      return;
    }
    if (title.length > 80) {
      setValidationError("Title cannot exceed 80 characters.");
      return;
    }
    if (content.trim().length === 0) {
      setValidationError("Please enter note content.");
      return;
    }
    if (content.length > 500) {
      setValidationError("Content cannot exceed 500 characters.");
      return;
    }

    writeContract({
      address: BOT_NOTES_CONTRACT_ADDRESS,
      abi: BOT_NOTES_ABI,
      functionName: "updateNote",
      args: [note.id, title.trim(), content.trim()],
    });
  };

  const isSubmitting = isConfirmingInWallet || isWaitingForTx;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Edit Note <span className="text-xs text-slate-400 font-mono">#{note.id.toString()}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Updates the on-chain content. Note history remains on the blockchain.
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="edit-title" className="text-xs font-semibold text-slate-300">
                Title
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
              id="edit-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
              maxLength={80}
              placeholder="Enter note title..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all disabled:opacity-50"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="edit-content" className="text-xs font-semibold text-slate-300">
                Content
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
              id="edit-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isSubmitting}
              rows={5}
              maxLength={500}
              placeholder="Write your note here..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none disabled:opacity-50"
            />
          </div>

          {/* Validation Error */}
          {validationError && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Transaction Status States */}
          {isConfirmingInWallet && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin shrink-0" />
              <span>Please confirm the transaction in your wallet...</span>
            </div>
          )}

          {isWaitingForTx && (
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 space-y-1.5">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin shrink-0 text-blue-400" />
                <span className="font-semibold">Transaction submitted. Waiting for confirmation...</span>
              </div>
              {txHash && (
                <a
                  href={`https://scan.bohr.life/tx/${txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 underline text-[11px]"
                >
                  <ExternalLink className="w-3 h-3" />
                  View transaction on BohrScan
                </a>
              )}
            </div>
          )}

          {isTxConfirmed && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Note updated successfully on Botchain!</span>
            </div>
          )}

          {(writeError || waitError) && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 space-y-1">
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

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || titleLength === 0 || contentLength === 0}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-md shadow-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  Update Note
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
