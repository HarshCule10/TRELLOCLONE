"use client";

import React from "react";
import { Trash2, Copy } from "lucide-react";
import { useBoardContext } from "@/context/BoardContext";

interface ListMenuProps {
  listId: string;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Dropdown menu for list actions (delete, etc).
 */
export default function ListMenu({ listId, isOpen, onClose }: ListMenuProps) {
  const { removeList } = useBoardContext();

  if (!isOpen) return null;

  const handleDelete = () => {
    removeList(listId);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      <div className="absolute top-8 right-0 z-50 w-[280px] bg-[#282e33] border border-[#3A4045] rounded-lg shadow-2xl py-0 animate-scale-in text-[#B6C2CF]">
        <div className="relative flex items-center justify-center h-10 px-3 border-b border-[#3A4045]/50">
          <p className="text-sm font-semibold text-[#8C9BAB]">
            List actions
          </p>
          <button 
            onClick={onClose}
            className="absolute right-2 p-1.5 rounded-md hover:bg-white/10 transition-colors"
          >
            <span className="sr-only">Close</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div className="py-2">
          <button
            onClick={handleDelete}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#EF5C48] hover:bg-[#ae2e2429] transition-colors group"
          >
            <Trash2 size={16} className="text-[#EF5C48] group-hover:scale-110 transition-transform" />
            <span className="font-medium">Delete list</span>
          </button>
        </div>
      </div>
    </>
  );
}
