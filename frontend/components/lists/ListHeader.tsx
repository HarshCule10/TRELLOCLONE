"use client";

import React, { useState, useRef, useEffect } from "react";
import { MoreHorizontal, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useBoardContext } from "@/context/BoardContext";

interface ListHeaderProps {
  listId: string;
  title: string;
  isCollapsed: boolean;
  onMenuOpen: () => void;
  onToggleCollapse: () => void;
}

/**
 * List header — click-to-edit title and menu trigger.
 */
export default function ListHeader({
  listId,
  title,
  isCollapsed,
  onMenuOpen,
  onToggleCollapse,
}: ListHeaderProps) {
  const { editListTitle } = useBoardContext();
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(title);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    setIsEditing(false);
    const trimmed = value.trim();
    if (!trimmed || trimmed === title) {
      setValue(title);
      return;
    }
    editListTitle(listId, trimmed);
  };

  if (isEditing) {
    return (
      <textarea
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSave();
          }
          if (e.key === "Escape") {
            setValue(title);
            setIsEditing(false);
          }
        }}
        className="flex-1 text-sm font-bold text-white bg-white/20 border-2 border-white/40 rounded px-1.5 py-1 resize-none overflow-hidden focus:outline-none focus:border-white/60"
        rows={1}
      />
    );
  }

  return (
    <div className="flex items-start justify-between gap-1 px-2 pt-2 pb-1">
      <button
        onClick={() => setIsEditing(true)}
        className="flex-1 text-left text-sm font-bold text-white px-1.5 py-1 rounded hover:bg-white/10 transition-colors cursor-text"
      >
        {title}
      </button>

      <div className="flex items-center gap-0.5 mt-0.5">
        <button
          onClick={onToggleCollapse}
          className="p-1 rounded hover:bg-white/15 transition-colors text-white/70 hover:text-white"
          title="Collapse list"
        >
          <ChevronsLeft size={16} />
        </button>
        <button
          onClick={onMenuOpen}
          className="p-1 rounded hover:bg-white/15 transition-colors"
          title="List actions"
        >
          <MoreHorizontal size={16} className="text-white/70" />
        </button>
      </div>
    </div>
  );
}
