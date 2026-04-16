"use client";

import React from "react";
import { Check } from "lucide-react";

interface CoverPickerProps {
  currentColor: string | null;
  onSelectColor: (color: string | null) => void;
}

const COVER_COLORS = [
  "#216e4e", // dark green
  "#7f5f01", // dark yellow
  "#a54800", // dark orange
  "#ae2e24", // dark red
  "#5e4db2", // dark purple
  "#0055cc", // dark blue
  "#206a83", // dark cyan
  "#4c6b1f", // dark lime
  "#943d73", // dark pink
  "#596773", // dark grey
];

export default function CoverPicker({
  currentColor,
  onSelectColor,
}: CoverPickerProps) {
  return (
    <div className="flex flex-col w-[260px] p-1">
      <div className="font-semibold text-xs text-[var(--trello-text-subtle)] mb-2 uppercase px-1">
        Colors
      </div>
      <div className="grid grid-cols-5 gap-2">
        {COVER_COLORS.map((color) => {
          const isSelected = currentColor === color;
          return (
            <button
              key={color}
              onClick={() => onSelectColor(color)}
              className="w-12 h-8 rounded shrink-0 relative flex items-center justify-center hover:opacity-80 hover:ring-2 hover:ring-black/20 transition-all"
              style={{ backgroundColor: color }}
            >
              {isSelected && <Check size={16} className="text-white drop-shadow-md" />}
            </button>
          );
        })}
      </div>
      <button
        onClick={() => onSelectColor(null)}
        className="mt-3 w-full text-center text-sm py-1.5 bg-[var(--trello-gray)] hover:bg-[var(--trello-gray-hover)] text-[var(--trello-text)] font-semibold rounded transition-colors"
      >
        Remove cover
      </button>
    </div>
  );
}
