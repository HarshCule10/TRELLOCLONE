"use client";

import React, { useState } from "react";
import { Edit2, Circle, CheckCircle2 } from "lucide-react";
import type { Card as CardType } from "@/lib/types";
import CardBadges from "./CardBadges";
import { useBoardContext } from "@/context/BoardContext";

interface CardProps {
  card: CardType;
  onClick: () => void;
}

/**
 * Single card thumbnail inside a list.
 */
export default function Card({ card, onClick }: CardProps) {
  const { isCardVisible, editCard } = useBoardContext();
  const [isHovered, setIsHovered] = useState(false);

  // If filtered out, don't render or render dim (depending on preference)
  if (!isCardVisible(card)) {
    return null;
  }

  const COVER_COLORS = [
    "#216e4e", "#7f5f01", "#a54800", "#ae2e24", "#5e4db2",
    "#0055cc", "#206a83", "#4c6b1f", "#943d73", "#596773"
  ];

  const getColorForCard = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % COVER_COLORS.length;
    return COVER_COLORS[index];
  };

  const activeColor = card.cover_color || getColorForCard(card.id);
  const bgStyle = { backgroundColor: activeColor };

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={bgStyle}
      className="group relative rounded-lg shadow-[var(--trello-card-shadow)] cursor-pointer mb-2 max-w-[256px] overflow-hidden transition-all text-white hover:brightness-110"
    >
      {/* Cover Image (if applied) */}
      {card.cover_image && (
        <img
          src={card.cover_image}
          alt="Card cover"
          className="h-32 w-full object-cover"
        />
      )}

      <div className="p-2.5">
        {/* Labels */}
        {card.labels && card.labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {card.labels.map((label) => (
              <span
                key={label.id}
                title={label.name}
                className="h-2 w-10 text-[0px] rounded-[4px]"
                style={{ backgroundColor: label.color }}
              >
                {label.name}
              </span>
            ))}
          </div>
        )}

        {/* Title and Checkbox row */}
        <div className="flex items-start gap-1.5 mt-0.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              editCard(card.id, { is_completed: !card.is_completed });
            }}
            className={`mt-0.5 shrink-0 text-white/40 hover:text-white transition-opacity group/check ${
              card.is_completed ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
          >
            {card.is_completed ? (
              <CheckCircle2 size={16} className="text-[#61BD4F]" />
            ) : (
              <>
                <Circle size={16} className="block group-hover/check:hidden" />
                <CheckCircle2 size={16} className="hidden group-hover/check:block" />
              </>
            )}
          </button>
          
          <p
            className={`text-sm font-medium text-white break-words leading-snug flex-1 ${
              card.is_completed ? "line-through opacity-70" : ""
            }`}
          >
            {card.title}
          </p>
        </div>

        {/* Badges */}
        <CardBadges card={card} />
      </div>

      {/* Edit button on hover */}
      {isHovered && (
        <button
          className="absolute top-1 right-1 p-1.5 rounded bg-black/30 hover:bg-black/50 z-10 transition-colors"
          onClick={(e) => { e.stopPropagation(); onClick(); }}
        >
          <Edit2 size={12} className="text-white" />
        </button>
      )}
    </div>
  );
}
