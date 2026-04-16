"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import type { Member, CardMember } from "@/lib/types";
import MemberAvatar from "./MemberAvatar";

interface MemberPickerProps {
  boardMembers: Member[];
  cardMembers: CardMember[];
  onToggleMember: (memberId: string) => void;
}

export default function MemberPicker({
  boardMembers,
  cardMembers,
  onToggleMember,
}: MemberPickerProps) {
  const [search, setSearch] = useState("");

  const filteredMembers = boardMembers.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col">
      <input
        type="text"
        placeholder="Search members"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        autoFocus
        className="w-full px-3 py-2 text-sm bg-transparent text-[var(--trello-text)] border-2 border-[var(--trello-input-border)] focus:border-[var(--trello-input-focus)] rounded mb-4 outline-none transition-colors"
      />

      <div className="font-semibold text-xs text-[var(--trello-text-subtle)] mb-2 uppercase">
        Board members
      </div>

      <div className="flex flex-col max-h-60 overflow-y-auto custom-scrollbar px-1">
        {filteredMembers.map((member) => {
          const isSelected = cardMembers.some((m) => m.id === member.id);
          return (
            <button
              key={member.id}
              onClick={() => onToggleMember(member.id)}
              className="flex items-center justify-between px-2 py-1.5 rounded hover:bg-[var(--trello-gray-hover)] transition-colors text-left"
            >
              <div className="flex items-center gap-2 overflow-hidden pr-2">
                <MemberAvatar
                  name={member.name}
                  avatarColor={member.avatar_color}
                  avatarUrl={member.avatar_url}
                  size="md"
                />
                <span className="text-sm text-[var(--trello-text)] truncate">
                  {member.name}
                </span>
              </div>
              {isSelected && <Check size={16} className="shrink-0" />}
            </button>
          );
        })}
        {filteredMembers.length === 0 && (
          <p className="text-sm text-center text-[var(--trello-text-subtle)] mt-2">
            No members found
          </p>
        )}
      </div>
    </div>
  );
}
