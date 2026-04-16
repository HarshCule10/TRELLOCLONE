"use client";

import React, { useState } from "react";
import { CheckSquare } from "lucide-react";
import Button from "@/components/ui/Button";
import ChecklistItem from "./ChecklistItem";
import type { Checklist as ChecklistType } from "@/lib/types";

interface ChecklistProps {
  checklist: ChecklistType;
  onUpdateTitle: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  onAddItem: (checklistId: string, title: string) => void;
  onUpdateItem: (itemId: string, isCompleted: boolean) => void;
  onDeleteItem: (itemId: string) => void;
}

export default function Checklist({
  checklist,
  onUpdateTitle,
  onDelete,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
}: ChecklistProps) {
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState("");

  const totalItems = checklist.items.length;
  const completedItems = checklist.items.filter((i) => i.is_completed).length;
  const progressPercent =
    totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);

  const handleAddItem = () => {
    if (!newItemTitle.trim()) return;
    onAddItem(checklist.id, newItemTitle.trim());
    setNewItemTitle("");
    // Keep open to add another
  };

  return (
    <div className="mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4 text-[var(--trello-text)] flex-1">
          <CheckSquare size={24} className="shrink-0" />
          <h3 className="text-lg font-semibold">{checklist.title}</h3>
        </div>
        <Button variant="subtle" onClick={() => onDelete(checklist.id)}>
          Delete
        </Button>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs text-[var(--trello-text-subtle)] w-8 text-right shrink-0">
          {progressPercent}%
        </span>
        <div className="flex-1 h-2 bg-[var(--trello-gray)] rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              progressPercent === 100 ? "bg-[#61BD4F]" : "bg-[#0079BF]"
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Items List */}
      <div className="ml-11 mb-3">
        {checklist.items.map((item) => (
          <ChecklistItem
            key={item.id}
            item={item}
            onToggle={(id, val) => onUpdateItem(id, val)}
            onDelete={onDeleteItem}
          />
        ))}
      </div>

      {/* Add Item Form */}
      <div className="ml-11">
        {isAddingItem ? (
          <div>
            <input
              type="text"
              value={newItemTitle}
              onChange={(e) => setNewItemTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddItem();
                if (e.key === "Escape") {
                  setIsAddingItem(false);
                  setNewItemTitle("");
                }
              }}
              placeholder="Add an item"
              autoFocus
              className="w-full px-3 py-2 text-sm bg-[var(--trello-navy)] text-[var(--trello-text)] border-2 border-[var(--trello-input-focus)] rounded mb-2 focus:outline-none"
            />
            <div className="flex items-center gap-2">
              <Button onClick={handleAddItem}>Add</Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setIsAddingItem(false);
                  setNewItemTitle("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="subtle" onClick={() => setIsAddingItem(true)}>
            Add an item
          </Button>
        )}
      </div>
    </div>
  );
}
