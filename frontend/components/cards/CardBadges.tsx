"use client";

import React from "react";
import { Clock, CheckSquare } from "lucide-react";
import { format, isPast, differenceInHours } from "date-fns";
import type { Card } from "@/lib/types";
import MemberAvatar from "@/components/members/MemberAvatar";

interface CardBadgesProps {
  card: Card;
}

/**
 * Badge row on card thumbnails — due date, checklist progress, member avatars.
 * Matches Trello's compact badge layout.
 */
export default function CardBadges({ card }: CardBadgesProps) {
  const hasDueDate = !!card.due_date;
  const hasChecklist =
    card.checklist_progress && card.checklist_progress.total > 0;
  const hasMembers = card.members && card.members.length > 0;

  if (!hasDueDate && !hasChecklist && !hasMembers) return null;

  let dueDateClass = "text-white/60";
  let dueDateBg = "";
  if (hasDueDate) {
    const dueDate = new Date(card.due_date!);
    if (isPast(dueDate)) {
      dueDateClass = "text-white";
      dueDateBg = "bg-[#EB5A46]";
    } else if (differenceInHours(dueDate, new Date()) < 24) {
      dueDateClass = "text-[#172B4D]";
      dueDateBg = "bg-[#F2D600]";
    }
  }

  return (
    <div className="flex items-center justify-between mt-1.5 flex-wrap gap-1">
      <div className="flex items-center gap-2 flex-wrap">
        {/* Due date badge */}
        {hasDueDate && (
          <span
            className={`inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded ${dueDateBg} ${dueDateClass}`}
          >
            <Clock size={12} />
            {format(new Date(card.due_date!), "MMM d")}
          </span>
        )}

        {/* Checklist badge */}
        {hasChecklist && (
          <span
            className={`inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded ${
              card.checklist_progress!.completed === card.checklist_progress!.total
                ? "bg-[#61BD4F] text-white"
                : "text-white/60"
            }`}
          >
            <CheckSquare size={12} />
            {card.checklist_progress!.completed}/
            {card.checklist_progress!.total}
          </span>
        )}
      </div>

      {/* Member avatars */}
      {hasMembers && (
        <div className="flex items-center -space-x-1">
          {card.members!.slice(0, 3).map((member) => (
            <MemberAvatar
              key={member.id}
              name={member.name}
              avatarColor={member.avatar_color}
              avatarUrl={member.avatar_url}
              size="sm"
            />
          ))}
        </div>
      )}
    </div>
  );
}
