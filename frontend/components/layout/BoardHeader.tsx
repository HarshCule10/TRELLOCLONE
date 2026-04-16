"use client";

import React, { useState, useRef, useEffect } from "react";
import { Star, Filter, MoreHorizontal } from "lucide-react";
import { useBoardContext } from "@/context/BoardContext";
import { updateBoard } from "@/lib/api";
import MemberAvatar from "@/components/members/MemberAvatar";

/**
 * Board header bar — sits between the global navbar and the board canvas.
 * Shows board title (editable), member avatars, and filter toggle.
 */
export default function BoardHeader({
  onToggleFilter,
}: {
  onToggleFilter: () => void;
}) {
  const { board, hasActiveFilters, refreshBoard } = useBoardContext();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(board?.title || "");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (board) setTitleValue(board.title);
  }, [board]);

  useEffect(() => {
    if (isEditingTitle && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingTitle]);

  const handleTitleSave = async () => {
    setIsEditingTitle(false);
    if (!board || titleValue.trim() === board.title) return;
    if (!titleValue.trim()) {
      setTitleValue(board.title);
      return;
    }
    try {
      await updateBoard(board.id, { title: titleValue.trim() });
      await refreshBoard();
    } catch (err) {
      console.error("Failed to update board title:", err);
      setTitleValue(board.title);
    }
  };

  if (!board) return null;

  return (
    <div
      className="h-12 flex items-center justify-between px-3 shrink-0"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.24)" }}
    >
      {/* Left section */}
      <div className="flex items-center gap-2">
        {/* Title */}
        {isEditingTitle ? (
          <input
            ref={inputRef}
            value={titleValue}
            onChange={(e) => setTitleValue(e.target.value)}
            onBlur={handleTitleSave}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleTitleSave();
              if (e.key === "Escape") {
                setTitleValue(board.title);
                setIsEditingTitle(false);
              }
            }}
            className="bg-white/10 text-[var(--trello-text)] font-bold text-base sm:text-lg px-2 py-0.5 rounded focus:outline-none focus:ring-2 focus:ring-white/50"
          />
        ) : (
          <button
            onClick={() => setIsEditingTitle(true)}
            className="text-white font-bold text-base sm:text-lg px-2 py-0.5 rounded hover:bg-white/15 transition-colors"
          >
            {board.title}
          </button>
        )}

        <button className="text-white/70 hover:text-white p-1 rounded hover:bg-white/15 transition-colors">
          <Star size={16} />
        </button>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        {/* Filter button */}
        <button
          onClick={onToggleFilter}
          className={`flex items-center gap-1 text-white text-sm px-3 py-1 rounded transition-colors ${
            hasActiveFilters
              ? "bg-white/30"
              : "hover:bg-white/15"
          }`}
        >
          <Filter size={14} />
          <span>Filter</span>
          {hasActiveFilters && (
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
          )}
        </button>

        {/* Separator */}
        <div className="w-px h-5 bg-white/20 mx-1" />

        {/* Board members - Limit to 3 on small screens */}
        <div className="flex items-center -space-x-1">
          {board.members?.slice(0, 5).map((member, idx) => (
            <MemberAvatar
              key={member.id}
              name={member.name}
              avatarColor={member.avatar_color}
              avatarUrl={member.avatar_url}
              size="sm"
              className={`border-2 border-transparent ${idx >= 3 ? "hidden sm:block" : ""}`}
            />
          ))}
          {board.members && board.members.length > 3 && (
            <div className="sm:hidden w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold text-white border-2 border-[#1d2125]">
              +{board.members.length - 3}
            </div>
          )}
        </div>

        <button className="text-white/70 hover:text-white p-1 rounded hover:bg-white/15 transition-colors">
          <MoreHorizontal size={16} />
        </button>
      </div>
    </div>
  );
}
