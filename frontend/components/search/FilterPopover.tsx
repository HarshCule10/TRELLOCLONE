"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import Popover from "@/components/ui/Popover";
import { useBoardContext } from "@/context/BoardContext";
import MemberAvatar from "@/components/members/MemberAvatar";

/**
 * Filter popover component encapsulating the filter dropdown logic.
 */
export default function FilterPopover() {
  const {
    board,
    searchQuery,
    setSearchQuery,
    filterLabels,
    setFilterLabels,
    filterMembers,
    setFilterMembers,
    filterDueDate,
    setFilterDueDate,
  } = useBoardContext();

  const handleToggleLabel = (id: string) => {
    setFilterLabels((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleToggleMember = (id: string) => {
    setFilterMembers((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleToggleDue = (opt: string) => {
    setFilterDueDate(filterDueDate === opt ? "" : opt);
  };

  if (!board) return null;

  return (
    <div className="flex flex-col w-[304px] text-[var(--trello-text)]">
      {/* Keyword Search */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-[var(--trello-text-subtle)] mb-1">
          Keyword
        </label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Enter a keyword..."
          className="w-full px-2 py-1.5 text-sm border-2 border-[var(--trello-input-border)] focus:border-[var(--trello-input-focus)] rounded outline-none"
        />
        <p className="text-xs text-[var(--trello-text-subtle)] mt-1">
          Search cards, members, labels, and more.
        </p>
      </div>

      {/* Members */}
      {board.members.length > 0 && (
        <div className="mb-4">
          <label className="block text-xs font-semibold text-[var(--trello-text-subtle)] mb-2">
            Members
          </label>
          <div className="flex flex-col gap-1">
            {board.members.map((member) => {
              const isSelected = filterMembers.includes(member.id);
              return (
                <button
                  key={member.id}
                  onClick={() => handleToggleMember(member.id)}
                  className="flex items-center justify-between p-1.5 rounded hover:bg-[var(--trello-gray-hover)] transition-colors text-left group"
                >
                  <div className="flex items-center gap-2">
                    <MemberAvatar
                      name={member.name}
                      avatarColor={member.avatar_color}
                      avatarUrl={member.avatar_url}
                      size="sm"
                    />
                    <span className="text-sm">{member.name}</span>
                  </div>
                  {isSelected && <Check size={16} />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Due Date */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-[var(--trello-text-subtle)] mb-2">
          Due date
        </label>
        <div className="flex flex-col gap-1">
          {[
            { id: "no_due_date", label: "No dates" },
            { id: "overdue", label: "Overdue" },
            { id: "due_soon", label: "Due in the next day" },
          ].map((opt) => {
            const isSelected = filterDueDate === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => handleToggleDue(opt.id)}
                className="flex items-center justify-between p-1.5 rounded hover:bg-[var(--trello-gray-hover)] transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-[var(--trello-gray)] shrink-0" />
                  <span className="text-sm">{opt.label}</span>
                </div>
                {isSelected && <Check size={16} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Labels */}
      {board.labels.length > 0 && (
        <div className="mb-2">
          <label className="block text-xs font-semibold text-[var(--trello-text-subtle)] mb-2">
            Labels
          </label>
          <div className="flex flex-col gap-1">
            {board.labels.map((label) => {
              const isSelected = filterLabels.includes(label.id);
              return (
                <button
                  key={label.id}
                  onClick={() => handleToggleLabel(label.id)}
                  className="flex items-center justify-between p-1.5 rounded hover:bg-[var(--trello-gray-hover)] transition-colors text-left"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <span
                      className="w-4 h-4 rounded shrink-0"
                      style={{ backgroundColor: label.color }}
                    />
                    <span className="text-sm truncate">{label.name}</span>
                  </div>
                  {isSelected && <Check size={16} />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
