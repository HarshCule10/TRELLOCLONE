"use client";

import React, { useState, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { useBoardContext } from "@/context/BoardContext";
import SortableList from "./SortableList";
import AddListForm from "../lists/AddListForm";
import Card from "../cards/Card";
import List from "../lists/List";
import type { Card as CardType, List as ListType } from "@/lib/types";

interface BoardDndContextProps {
  onCardClick: (cardId: string) => void;
}

export default function BoardDndContext({ onCardClick }: BoardDndContextProps) {
  const { lists, setLists, persistCardOrder, persistListOrder } = useBoardContext();
  
  const [activeCard, setActiveCard] = useState<CardType | null>(null);
  const [activeList, setActiveList] = useState<ListType | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // allows clicking without immediate drag start
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const { type, card, list } = active.data.current ?? {};

    if (type === "Card") {
      setActiveCard(card);
    } else if (type === "List") {
      setActiveList(list);
    }
  };

  const findContainer = (id: string, currentLists: typeof lists) => {
    if (currentLists.find((l) => l.id === id)) return id;
    return currentLists.find((l) => l.cards.some((c) => c.id === id))?.id;
  };

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      if (!over) return;
      if (active.id === over.id) return;

      const activeType = active.data.current?.type;
      const overType = over.data.current?.type;

      if (activeType !== "Card") return;

      setLists((prev) => {
        const activeContainer = findContainer(active.id as string, prev);
        const overContainer = findContainer(over.id as string, prev);

        if (!activeContainer || !overContainer || activeContainer === overContainer) {
          return prev;
        }

        const activeListIndex = prev.findIndex((l) => l.id === activeContainer);
        const overListIndex = prev.findIndex((l) => l.id === overContainer);

        const activeCards = [...prev[activeListIndex].cards];
        const overCards = [...prev[overListIndex].cards];

        const activeIndex = activeCards.findIndex((c) => c.id === active.id);
        const overIndex = overType === "Card" 
          ? overCards.findIndex((c) => c.id === over.id)
          : overCards.length;

        const [movedCard] = activeCards.splice(activeIndex, 1);
        const updatedCard = { ...movedCard, list_id: overContainer as string };
        overCards.splice(overIndex, 0, updatedCard);

        const newLists = [...prev];
        newLists[activeListIndex] = { ...prev[activeListIndex], cards: activeCards };
        newLists[overListIndex] = { ...prev[overListIndex], cards: overCards };

        return newLists;
      });
    },
    [setLists]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      
      setActiveCard(null);
      setActiveList(null);

      if (!over) return;

      const activeType = active.data.current?.type;
      const overType = over.data.current?.type;

      // Handle List reorder
      if (activeType === "List") {
        console.log("List drag end. Active:", active.id, "Over:", over.id);
        setLists((prev) => {
          const targetListId = findContainer(over.id as string, prev);
          const oldIndex = prev.findIndex((l) => l.id === active.id);
          const newIndex = prev.findIndex((l) => l.id === targetListId);
          
          if (oldIndex === -1 || newIndex === -1) {
            console.warn("List indices not found", { oldIndex, newIndex });
            return prev;
          }
          
          const newLists = arrayMove(prev, oldIndex, newIndex);
          console.log("Persisting list order...");
          setTimeout(() => persistListOrder(newLists), 0);
          return newLists;
        });
        return;
      }

      // Handle Card reorder
      if (activeType === "Card") {
        setLists((prev) => {
          const activeContainer = findContainer(active.id as string, prev);
          const overContainer = findContainer(over.id as string, prev);

          if (!activeContainer || !overContainer) return prev;

          const activeListIndex = prev.findIndex((l) => l.id === activeContainer);
          const overListIndex = prev.findIndex((l) => l.id === overContainer);

          const activeCards = [...prev[activeListIndex].cards];
          const activeIndex = activeCards.findIndex((c) => c.id === active.id);

          const newLists = [...prev];

          // If same list, reorder. If cross-list, handleDragOver already handled it.
          if (activeContainer === overContainer) {
            const overIndex = overType === "Card"
              ? activeCards.findIndex((c) => c.id === over.id)
              : activeCards.length - 1;
              
            const reorderedCards = arrayMove(activeCards, activeIndex, overIndex);
            newLists[activeListIndex] = { ...prev[activeListIndex], cards: reorderedCards };
            
            // Map updates and persist
            const updates = reorderedCards.map((c, idx) => ({
              id: c.id,
              position: (idx + 1) * 1000,
              list_id: activeContainer as string,
            }));
            setTimeout(() => persistCardOrder(updates), 0);
          } else {
            // Already moved in dragOver, just persist the new list's positions
            const destinationCards = prev[overListIndex].cards;
            const updates = destinationCards.map((c, idx) => ({
              id: c.id,
              position: (idx + 1) * 1000,
              list_id: overContainer as string,
            }));
            setTimeout(() => persistCardOrder(updates), 0);
          }

          return newLists;
        });
      }
    },
    [setLists, persistListOrder, persistCardOrder]
  );

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: { active: { opacity: "0.4" } },
    }),
  };

  const listIds = lists.map((l) => l.id);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="board-canvas">
        <SortableContext items={listIds} strategy={horizontalListSortingStrategy}>
          {lists.map((list) => (
            <SortableList key={list.id} list={list} onCardClick={onCardClick} />
          ))}
        </SortableContext>
        <AddListForm />
      </div>

      <DragOverlay dropAnimation={dropAnimation}>
        {activeCard ? <Card card={activeCard} onClick={() => {}} /> : null}
        {activeList ? <List list={activeList} onCardClick={() => {}} dragOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
