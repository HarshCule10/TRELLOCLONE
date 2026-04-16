"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import type { ChecklistItem as ItemType } from "@/lib/types";

interface ChecklistItemProps {
  item: ItemType;
  onToggle: (id: string, isCompleted: boolean) => void;
  onDelete: (id: string) => void;
}

export default function ChecklistItem({
  item,
  onToggle,
  onDelete,
}: ChecklistItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex items-start gap-3 group mb-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        onClick={() => onToggle(item.id, !item.is_completed)}
        className={`mt-1 shrink-0 w-5 h-5 rounded flex items-center justify-center border transition-colors group/checkbox ${
          item.is_completed
            ? "border-transparent bg-[#0079BF]"
            : "border-[var(--trello-text-subtle)] bg-[var(--trello-modal-bg)] hover:bg-[var(--trello-gray-hover)]"
        }`}
      >
        {item.is_completed ? (
          <Check size={14} className="text-white" />
        ) : (
          <Check size={14} className="text-[var(--trello-text-subtle)] opacity-0 group-hover/checkbox:opacity-50" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div
          className={`text-sm py-1 cursor-pointer transition-colors ${
            item.is_completed
              ? "text-[var(--trello-text-subtle)] line-through"
              : "text-[var(--trello-text)]"
          }`}
          onClick={() => onToggle(item.id, !item.is_completed)}
        >
          {item.title}
        </div>
      </div>

      {isHovered && (
        <button
          onClick={() => onDelete(item.id)}
          className="shrink-0 p-1.5 rounded hover:bg-[var(--trello-gray)] text-[var(--trello-text-subtle)] transition-colors"
        >
          <span className="sr-only">Delete</span>
          {/* using text instead of icon for compactness or you can use Trash2 */}
          <span className="text-xs px-1">Discard</span>
        </button>
      )}
    </div>
  );
}
