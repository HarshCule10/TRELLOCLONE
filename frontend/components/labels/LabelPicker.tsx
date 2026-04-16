"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import type { Label } from "@/lib/types";

interface LabelPickerProps {
  boardLabels: Label[];
  cardLabels: Label[];
  onToggleLabel: (labelId: string) => void;
  // Let parent handle edit/create view switching for simplicity here
}

export default function LabelPicker({
  boardLabels,
  cardLabels,
  onToggleLabel,
}: LabelPickerProps) {
  const [search, setSearch] = useState("");

  const filteredLabels = boardLabels.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col">
      <input
        type="text"
        placeholder="Search labels..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        autoFocus
        className="w-full px-3 py-2 text-sm bg-transparent text-[var(--trello-text)] border-2 border-[var(--trello-input-border)] focus:border-[var(--trello-input-focus)] rounded mb-4 outline-none transition-colors"
      />

      <div className="font-semibold text-xs text-[var(--trello-text-subtle)] mb-2 uppercase">
        Labels
      </div>

      <div className="flex flex-col gap-1 max-h-60 overflow-y-auto mb-3 custom-scrollbar px-1">
        {filteredLabels.map((label) => {
          const isSelected = cardLabels.some((l) => l.id === label.id);
          return (
            <div key={label.id} className="flex items-center gap-2 group">
              <button
                onClick={() => onToggleLabel(label.id)}
                className="flex-1 flex items-center justify-between text-left px-3 py-2 rounded transition-all hover:scale-[1.02] shadow-sm hover:shadow-md"
                style={{ backgroundColor: label.color, color: "white" }}
              >
                <span className="text-sm font-semibold truncate pr-2">
                  {label.name}
                </span>
                {isSelected && <Check size={14} />}
              </button>
            </div>
          );
        })}
        {filteredLabels.length === 0 && (
          <p className="text-sm text-center text-[var(--trello-text-subtle)]">
            No labels found
          </p>
        )}
      </div>

      <button className="w-full text-center text-sm py-1.5 bg-[var(--trello-gray)] hover:bg-[var(--trello-gray-hover)] text-[var(--trello-text)] font-semibold rounded transition-colors">
        Create a new label
      </button>
    </div>
  );
}
