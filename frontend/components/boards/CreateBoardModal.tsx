"use client";

import React, { useState } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

const BOARD_COLORS = [
  "#216e4e", "#7f5f01", "#a54800", "#ae2e24", "#5e4db2",
  "#0055cc", "#206a83", "#4c6b1f", "#943d73", "#596773",
];

interface CreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, backgroundColor: string) => void;
}

/**
 * Modal for creating a new board with a title and background color picker.
 */
export default function CreateBoardModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateBoardModalProps) {
  const [title, setTitle] = useState("");
  const [selectedColor, setSelectedColor] = useState(BOARD_COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit(title.trim(), selectedColor);
    setTitle("");
    setSelectedColor(BOARD_COLORS[0]);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-sm">
      <form onSubmit={handleSubmit}>
        {/* Preview */}
        <div
          className="h-28 rounded-lg mb-4 flex items-center justify-center transition-colors"
          style={{ backgroundColor: selectedColor }}
        >
          {title ? (
            <span className="text-white font-bold text-lg px-4 text-center">
              {title}
            </span>
          ) : (
            <span className="text-white/50 text-sm">Board preview</span>
          )}
        </div>

        {/* Color picker */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {BOARD_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setSelectedColor(color)}
              className={`w-10 h-8 rounded transition-all ${
                selectedColor === color
                  ? "ring-2 ring-offset-2 ring-[var(--trello-input-focus)]"
                  : "hover:brightness-90"
              }`}
              style={{ backgroundColor: color }}
              aria-label={`Select color ${color}`}
            />
          ))}
        </div>

        {/* Title input */}
        <label className="block mb-1 text-xs font-bold text-[var(--trello-text)]">
          Board title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter board title..."
          autoFocus
          className="w-full px-3 py-2 text-sm border border-[var(--trello-input-border)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--trello-input-focus)] bg-white mb-4"
        />

        {/* Submit */}
        <Button type="submit" block disabled={!title.trim()}>
          Create
        </Button>
      </form>
    </Modal>
  );
}
