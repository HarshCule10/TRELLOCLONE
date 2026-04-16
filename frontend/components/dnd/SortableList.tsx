"use client";

import React, { useMemo } from "react";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import List from "@/components/lists/List";
import SortableCard from "./SortableCard";
import type { List as ListType, Card as CardType } from "@/lib/types";

interface SortableListProps {
  list: ListType;
  onCardClick: (cardId: string) => void;
}

export default function SortableList({ list, onCardClick }: SortableListProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: list.id,
    data: {
      type: "List",
      list,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const cardIds = useMemo(() => list.cards.map((c) => c.id), [list.cards]);

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="w-[272px] shrink-0 min-h-[150px] bg-black/10 rounded-xl border-2 border-dashed border-white/20"
      />
    );
  }

  return (
    <List
      list={list}
      onCardClick={onCardClick}
      setNodeRef={setNodeRef}
      style={style}
      attributes={attributes}
      listeners={listeners}
    >
      <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
        <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-[4px] px-2 custom-scrollbar">
          {list.cards.map((card) => (
            <SortableCard key={card.id} card={card} onClick={onCardClick} />
          ))}
        </div>
      </SortableContext>
    </List>
  );
}
