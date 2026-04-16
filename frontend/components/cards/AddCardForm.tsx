"use client";

import React, { useState, useRef, useEffect } from "react";
import { Plus, X } from "lucide-react";
import Button from "@/components/ui/Button";
import { useBoardContext } from "@/context/BoardContext";

/**
 * Inline "Add a card" form at the bottom of each list.
 */
export default function AddCardForm({ listId }: { listId: string }) {
  const { addCard } = useBoardContext();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    await addCard(listId, trimmed);
    setTitle("");
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      setIsOpen(false);
      setTitle("");
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1 w-full px-2 py-1.5 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
      >
        <Plus size={16} />
        Add a card
      </button>
    );
  }

  return (
    <div className="px-1 pb-1 animate-fadeIn">
      <textarea
        ref={textareaRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter a title for this card..."
        className="w-full px-3 py-2 text-sm bg-[#22272b] text-[#B6C2CF] border border-[#3A4045]/50 rounded-lg shadow-xl resize-none focus:outline-none focus:ring-1 focus:ring-[#388bff] placeholder:text-[#8C9BAB]"
        rows={3}
      />
      <div className="flex items-center gap-1 mt-1.5 px-0.5">
        <Button onClick={handleSubmit} disabled={!title.trim()} className="h-8 px-3 py-0 font-semibold shadow-sm">
          Add card
        </Button>
        <button
          onClick={() => {
            setIsOpen(false);
            setTitle("");
          }}
          className="p-1.5 rounded-md hover:bg-white/10 transition-colors"
        >
          <X size={20} className="text-[#8C9BAB] hover:text-[#B6C2CF]" />
        </button>
      </div>
    </div>
  );
}
