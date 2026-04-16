"use client";

import React, { useState, useRef, useEffect } from "react";
import { Plus, X } from "lucide-react";
import Button from "@/components/ui/Button";
import { useBoardContext } from "@/context/BoardContext";

/**
 * "Add another list" button and inline form used at the end of the lists row.
 */
export default function AddListForm() {
  const { addList } = useBoardContext();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    await addList(trimmed);
    setTitle("");
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-[272px] shrink-0 h-10 flex items-center gap-2 px-3 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-200"
      >
        <Plus size={18} />
        Add another list
      </button>
    );
  }

  return (
    <div className="w-[272px] shrink-0 bg-[#101204] rounded-xl p-2 h-fit shadow-2xl animate-scale-in">
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter list title..."
          className="w-full px-3 py-2 text-sm bg-[#22272b] border-2 border-[#388bff] rounded-md mb-2 focus:outline-none text-[#B6C2CF] placeholder:text-[#8C9BAB]"
        />
        <div className="flex items-center gap-1">
          <Button type="submit" disabled={!title.trim()} className="h-8 px-3 py-0 font-semibold shadow-sm">
            Add list
          </Button>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setTitle("");
            }}
            className="p-1.5 rounded-md hover:bg-white/10 transition-colors"
          >
            <X size={20} className="text-[#8C9BAB] hover:text-[#B6C2CF]" />
          </button>
        </div>
      </form>
    </div>
  );
}
