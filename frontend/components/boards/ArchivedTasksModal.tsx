"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Search, Archive, RotateCcw, Trash2, X } from "lucide-react";
import { getArchivedCards, updateCard, deleteCard } from "@/lib/api";
import { useBoardContext } from "@/context/BoardContext";
import type { Card } from "@/lib/types";

interface ArchivedCard extends Card {
  list_title?: string;
}

interface ArchivedTasksModalProps {
  onClose: () => void;
}

export default function ArchivedTasksModal({ onClose }: ArchivedTasksModalProps) {
  const { board, refreshBoard } = useBoardContext();
  const [archivedCards, setArchivedCards] = useState<ArchivedCard[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (board) {
      loadArchived();
    }
  }, [board]);

  const loadArchived = async () => {
    if (!board) return;
    setLoading(true);
    try {
      const data = await getArchivedCards(board.id);
      setArchivedCards(data);
    } catch (err) {
      console.error("Failed to load archived cards:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnarchive = async (cardId: string) => {
    try {
      await updateCard(cardId, { is_archived: false });
      setArchivedCards((prev) => prev.filter((c) => c.id !== cardId));
      await refreshBoard();
    } catch (err) {
      console.error("Failed to unarchive card:", err);
    }
  };

  const handleDeletePermanent = async (cardId: string) => {
    if (!confirm("Are you sure you want to permanently delete this task? This cannot be undone.")) {
      return;
    }
    try {
      await deleteCard(cardId);
      setArchivedCards((prev) => prev.filter((c) => c.id !== cardId));
    } catch (err) {
      console.error("Failed to delete card permanently:", err);
    }
  };

  const filteredCards = useMemo(() => {
    return archivedCards.filter((card) =>
      card.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [archivedCards, searchQuery]);

  return (
    <div className="flex flex-col h-[500px] bg-[#22272b] -m-6 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-[#1d2125] border-b border-white/5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-[#b6c2cf]">
            <Archive size={18} />
            <h2 className="font-semibold">Archived tasks</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-md text-[#8c9bab] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="relative">
          <Search 
            size={16} 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8c9bab]" 
          />
          <input
            type="text"
            placeholder="Search archived tasks"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#091e4224] border-[1px] border-white/10 focus:border-[#388bff] text-[#b6c2cf] pl-9 pr-4 py-2 rounded-[3px] focus:outline-none placeholder:text-[#8c9bab] text-sm transition-all"
            autoFocus
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        {loading ? (
          <div className="py-20 text-center text-[#8c9bab] text-sm">
            Loading archived tasks...
          </div>
        ) : filteredCards.length === 0 ? (
          <div className="py-20 text-center">
            <Archive size={40} className="mx-auto text-white/10 mb-3" />
            <p className="text-[#8c9bab] text-sm">
              {searchQuery ? "No matching archived tasks" : "No archived tasks"}
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredCards.map((card) => (
              <div 
                key={card.id}
                className="group flex flex-col p-3 rounded-md hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-[#b6c2cf] mb-1 truncate">
                      {card.title}
                    </h3>
                    <p className="text-[11px] text-[#8c9bab]">
                      from <span className="underline">{card.list_title}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleUnarchive(card.id)}
                      className="p-1.5 hover:bg-[#388bff20] text-[#8c9bab] hover:text-[#579dff] rounded transition-colors"
                      title="Send to board"
                    >
                      <RotateCcw size={16} />
                    </button>
                    <button
                      onClick={() => handleDeletePermanent(card.id)}
                      className="p-1.5 hover:bg-red-500/10 text-[#8c9bab] hover:text-red-400 rounded transition-colors"
                      title="Delete permanently"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 bg-[#1d2125] border-t border-white/5 text-center">
        <p className="text-[11px] text-[#8c9bab]">
          Tasks here are hidden from the board but kept for your records.
        </p>
      </div>
    </div>
  );
}
