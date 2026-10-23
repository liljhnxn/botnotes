"use client";

import React, { useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { BOT_NOTES_CONTRACT_ADDRESS, BOT_NOTES_ABI, NoteItem } from "@/lib/contract";
import { EditNoteModal } from "./EditNoteModal";
import { FileText, Calendar, Clock, Edit3, Loader2, Sparkles, Inbox, ExternalLink } from "lucide-react";

interface NoteListProps {
  onRefreshNeeded?: () => void;
  refreshToken?: number;
}

export function NoteList({ refreshToken = 0 }: NoteListProps) {
  const { address, isConnected } = useAccount();
  const [editingNote, setEditingNote] = useState<NoteItem | null>(null);

  const {
    data: notesData,
    isLoading,
    isRefetching,
    refetch,
    error,
  } = useReadContract({
    address: BOT_NOTES_CONTRACT_ADDRESS,
    abi: BOT_NOTES_ABI,
    functionName: "getMyNotes",
    account: address,
    query: {
      enabled: isConnected && Boolean(BOT_NOTES_CONTRACT_ADDRESS),
    },
  });

  const notes = (notesData as NoteItem[] | undefined) || [];

  const formatDate = (timestamp: bigint) => {
    try {
      const date = new Date(Number(timestamp) * 1000);
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Unknown";
    }
  };

  const handleEditSuccess = () => {
    refetch();
  };

  if (!isConnected) {
    return (
      <div className="glow-card rounded-2xl p-10 text-center border border-slate-800/80">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-slate-400 mb-4">
          <FileText className="w-7 h-7 text-emerald-400" />
        </div>
        <h3 className="text-base font-semibold text-slate-200">Wallet Not Connected</h3>
        <p className="text-sm text-slate-400 max-w-sm mx-auto mt-1.5">
          Connect your wallet above to read and manage your private on-chain notes on Botchain Mainnet.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="glow-card rounded-2xl p-12 text-center border border-slate-800/80">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto mb-3" />
        <p className="text-sm text-slate-300">Loading your on-chain notes from Botchain Mainnet...</p>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="glow-card rounded-2xl p-12 text-center border border-slate-800/80">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
          <Inbox className="w-7 h-7" />
        </div>
        <h3 className="text-base font-semibold text-white">No Notes Found</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto mt-1.5">
          You haven&apos;t created any notes with this wallet yet. Use the form above to record your first on-chain note on Botchain Mainnet!
        </p>
      </div>
    );
  }

  // Display notes in reverse chronological order (newest first)
  const displayNotes = [...notes].reverse();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-slate-200">
            Your Notes ({notes.length})
          </h3>
          {isRefetching && (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
          )}
        </div>
        <a
          href={`https://scan.botchain.ai/address/${BOT_NOTES_CONTRACT_ADDRESS}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition-colors font-medium group"
          title="View Contract on Botchain Mainnet Explorer"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>BotchainScan</span>
          <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayNotes.map((note) => {
          const isEdited = note.updatedAt > note.createdAt;
          return (
            <div
              key={note.id.toString()}
              className="glow-card rounded-2xl p-5 border border-slate-800/80 flex flex-col justify-between hover:border-slate-700/80 group transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700/50">
                      #{note.id.toString()}
                    </span>
                    <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors break-words line-clamp-1">
                      {note.title}
                    </h4>
                  </div>
                  <button
                    onClick={() => setEditingNote(note)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
                    title="Edit Note"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-sm text-slate-300 whitespace-pre-wrap break-words leading-relaxed">
                  {note.content}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/70 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2 font-mono">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  <span>Created: {formatDate(note.createdAt)}</span>
                </div>

                {isEdited && (
                  <div className="flex items-center gap-1 text-emerald-400/90 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                    <Clock className="w-3 h-3" />
                    <span>Updated: {formatDate(note.updatedAt)}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      <EditNoteModal
        note={editingNote}
        isOpen={Boolean(editingNote)}
        onClose={() => setEditingNote(null)}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
}
