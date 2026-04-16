"use client";

import React, { useState } from "react";
import type { List as ListType, Card as CardType } from "@/lib/types";
import ListHeader from "./ListHeader";
import AddCardForm from "../cards/AddCardForm";
import Card from "../cards/Card";
import ListMenu from "./ListMenu";
import { ChevronsRight } from "lucide-react";

interface ListProps {
  list: ListType;
  onCardClick: (cardId: string) => void;
  // Drag and drop properties pass-through
  setNodeRef?: (node: HTMLElement | null) => void;
  attributes?: React.HTMLAttributes<HTMLDivElement>;
  listeners?: React.DOMAttributes<HTMLDivElement>;
  style?: React.CSSProperties;
  dragOverlay?: boolean;
  children?: React.ReactNode;
}

/**
 * Single list column component.
 */
export default function List({
  list,
  onCardClick,
  setNodeRef,
  attributes,
  listeners,
  style,
  dragOverlay = false,
  children,
}: ListProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (isCollapsed) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`
          w-[50px] shrink-0 flex flex-col rounded-xl pb-3 h-fit
          bg-[rgba(22,14,35,0.7)] backdrop-blur-md border border-white/5
          transition-all duration-300 group select-none
          ${dragOverlay ? "rotate-2 shadow-xl cursor-grabbing" : ""}
        `}
      >
        <div 
          className="flex flex-col items-center gap-4 py-4 cursor-pointer flex-1"
          {...attributes}
          {...listeners}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsCollapsed(false);
            }}
            className="p-1.5 rounded hover:bg-white/15 transition-colors text-white/70 hover:text-white"
            title="Expand list"
          >
            <ChevronsRight size={18} />
          </button>

          <div className="flex-1 flex flex-col items-center">
            <h3 
              className="text-sm font-bold text-white/90 whitespace-nowrap"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              {list.title}
            </h3>
          </div>

          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white/60">
            {list.cards.length}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        w-[272px] shrink-0 flex flex-col rounded-xl pb-1
        bg-[rgba(22,14,35,0.65)] backdrop-blur-sm
        ${dragOverlay ? "rotate-2 shadow-xl cursor-grabbing" : ""}
      `}
    >
      {/* Header (Drag Handle) */}
      <div
        className="cursor-pointer"
        {...attributes}
        {...listeners}
      >
        <ListHeader
          listId={list.id}
          title={list.title}
          isCollapsed={isCollapsed}
          onMenuOpen={() => setIsMenuOpen(true)}
          onToggleCollapse={() => setIsCollapsed(true)}
        />
      </div>

      <ListMenu
        listId={list.id}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />

      {/* Cards Area */}
      {children || (
        <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-[4px] px-2 custom-scrollbar">
          {list.cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              onClick={() => onCardClick(card.id)}
            />
          ))}
        </div>
      )}

      {/* Add Card Footer */}
      <div className="px-1 pt-1">
        <AddCardForm listId={list.id} />
      </div>
    </div>
  );
}
