"use client";

import React, { useState, useEffect } from "react";
import { AlignLeft } from "lucide-react";
import Button from "@/components/ui/Button";

interface CardDescriptionProps {
  description: string | null;
  onSave: (desc: string) => void;
}

export default function CardDescription({
  description,
  onSave,
}: CardDescriptionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(description || "");

  useEffect(() => {
    setValue(description || "");
  }, [description]);

  const handleSave = () => {
    setIsEditing(false);
    if (value.trim() !== (description || "").trim()) {
      onSave(value.trim());
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-3 text-[var(--trello-text)]">
        <AlignLeft size={24} className="mt-1 shrink-0" />
        <h3 className="text-lg font-semibold">Description</h3>
        {!isEditing && description && (
          <Button
            variant="subtle"
            className="ml-2 !py-1"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </Button>
        )}
      </div>

      <div className="ml-10">
        {isEditing ? (
          <div>
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Add a more detailed description..."
              className="w-full min-h-[100px] px-3 py-2 bg-[var(--trello-navy)] text-[var(--trello-text)] border border-[var(--trello-border)] rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--trello-input-focus)] resize-y mb-2 text-sm"
              autoFocus
            />
            <div className="flex items-center gap-2">
              <Button onClick={handleSave}>Save</Button>
              <Button variant="ghost" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : description ? (
          <div
            onClick={() => setIsEditing(true)}
            className="text-sm text-[var(--trello-text)] cursor-pointer break-words whitespace-pre-wrap"
          >
            {description}
          </div>
        ) : (
          <div
            onClick={() => setIsEditing(true)}
            className="bg-[var(--trello-gray)] hover:bg-[var(--trello-gray-hover)] rounded p-3 text-sm text-[var(--trello-text-subtle)] cursor-pointer transition-colors"
          >
            Add a more detailed description...
          </div>
        )}
      </div>
    </div>
  );
}
