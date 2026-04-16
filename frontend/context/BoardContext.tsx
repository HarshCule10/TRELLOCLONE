"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import {
  getBoardById,
  createList as apiCreateList,
  updateList as apiUpdateList,
  deleteList as apiDeleteList,
  createCard as apiCreateCard,
  updateCard as apiUpdateCard,
  deleteCard as apiDeleteCard,
  reorderCards as apiReorderCards,
  reorderLists as apiReorderLists,
} from "@/lib/api";
import type { BoardDetail, List, Card } from "@/lib/types";

// ─── Types ──────────────────────────────────────────────────────────────────

interface BoardContextValue {
  board: BoardDetail | null;
  lists: List[];
  loading: boolean;
  error: string | null;

  /** Reload board data from API */
  refreshBoard: () => Promise<void>;

  /** Set lists directly (used by drag-and-drop for optimistic state) */
  setLists: React.Dispatch<React.SetStateAction<List[]>>;

  // ─── List operations ────────────────────────────────────────────────────
  addList: (title: string) => Promise<void>;
  editListTitle: (listId: string, title: string) => Promise<void>;
  removeList: (listId: string) => Promise<void>;
  persistListOrder: (lists: List[]) => Promise<void>;

  // ─── Card operations ────────────────────────────────────────────────────
  addCard: (listId: string, title: string) => Promise<void>;
  editCard: (cardId: string, updates: Partial<Card>) => Promise<void>;
  removeCard: (cardId: string, listId: string) => Promise<void>;
  persistCardOrder: (
    updates: Array<{ id: string; position: number; list_id: string }>
  ) => Promise<void>;

  // ─── Search/filter ──────────────────────────────────────────────────────
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filterLabels: string[];
  setFilterLabels: React.Dispatch<React.SetStateAction<string[]>>;
  filterMembers: string[];
  setFilterMembers: React.Dispatch<React.SetStateAction<string[]>>;
  filterDueDate: string;
  setFilterDueDate: (d: string) => void;
  hasActiveFilters: boolean;
  clearFilters: () => void;
  isCardVisible: (card: Card) => boolean;
}

export const BoardContext = createContext<BoardContextValue | null>(null);

// ─── Provider ───────────────────────────────────────────────────────────────

interface BoardProviderProps {
  boardId: string;
  children: React.ReactNode;
}

export function BoardProvider({ boardId, children }: BoardProviderProps) {
  const [board, setBoard] = useState<BoardDetail | null>(null);
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLabels, setFilterLabels] = useState<string[]>([]);
  const [filterMembers, setFilterMembers] = useState<string[]>([]);
  const [filterDueDate, setFilterDueDate] = useState("");

  const hasActiveFilters =
    searchQuery.length > 0 ||
    filterLabels.length > 0 ||
    filterMembers.length > 0 ||
    filterDueDate.length > 0;

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setFilterLabels([]);
    setFilterMembers([]);
    setFilterDueDate("");
  }, []);

  // Check if a card matches active filters
  const isCardVisible = useCallback(
    (card: Card): boolean => {
      if (!hasActiveFilters) return true;

      // Search by title
      if (
        searchQuery &&
        !card.title.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Filter by labels
      if (filterLabels.length > 0) {
        const cardLabelIds = card.labels?.map((l) => l.id) || [];
        if (!filterLabels.some((id) => cardLabelIds.includes(id))) {
          return false;
        }
      }

      // Filter by members
      if (filterMembers.length > 0) {
        const cardMemberIds = card.members?.map((m) => m.id) || [];
        if (!filterMembers.some((id) => cardMemberIds.includes(id))) {
          return false;
        }
      }

      // Filter by due date
      if (filterDueDate) {
        if (filterDueDate === "no_due_date" && card.due_date) return false;
        if (filterDueDate === "overdue") {
          if (!card.due_date || new Date(card.due_date) > new Date())
            return false;
        }
        if (filterDueDate === "due_soon") {
          if (!card.due_date) return false;
          const diff =
            new Date(card.due_date).getTime() - Date.now();
          if (diff < 0 || diff > 24 * 60 * 60 * 1000) return false;
        }
      }

      return true;
    },
    [searchQuery, filterLabels, filterMembers, filterDueDate, hasActiveFilters]
  );

  // ─── Load board ─────────────────────────────────────────────────────────

  const refreshBoard = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getBoardById(boardId);
      setBoard(data);
      setLists(data.lists);
      setError(null);
    } catch (err) {
      console.error("Failed to load board:", err);
      setError("Failed to load board");
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  useEffect(() => {
    refreshBoard();
  }, [refreshBoard]);

  // ─── List operations ───────────────────────────────────────────────────

  const addList = useCallback(
    async (title: string) => {
      try {
        await apiCreateList(boardId, title);
        await refreshBoard();
      } catch (err) {
        console.error("Failed to create list:", err);
      }
    },
    [boardId, refreshBoard]
  );

  const editListTitle = useCallback(async (listId: string, title: string) => {
    try {
      await apiUpdateList(listId, title);
      setLists((prev) =>
        prev.map((l) => (l.id === listId ? { ...l, title } : l))
      );
    } catch (err) {
      console.error("Failed to update list:", err);
    }
  }, []);

  const removeList = useCallback(
    async (listId: string) => {
      try {
        await apiDeleteList(listId);
        setLists((prev) => prev.filter((l) => l.id !== listId));
      } catch (err) {
        console.error("Failed to delete list:", err);
      }
    },
    []
  );

  const persistListOrder = useCallback(async (orderedLists: List[]) => {
    try {
      const updates = orderedLists.map((list, index) => ({
        id: list.id,
        position: (index + 1) * 1000,
      }));
      console.log("Persisting list reorder:", updates);
      await apiReorderLists(updates);
      console.log("List reorder persisted successfully");
    } catch (err) {
      console.error("Failed to reorder lists:", err);
    }
  }, []);

  // ─── Card operations ───────────────────────────────────────────────────

  const addCard = useCallback(
    async (listId: string, title: string) => {
      try {
        const newCard = await apiCreateCard(listId, title);
        setLists((prev) =>
          prev.map((list) =>
            list.id === listId
              ? { ...list, cards: [...list.cards, newCard] }
              : list
          )
        );
      } catch (err) {
        console.error("Failed to create card:", err);
      }
    },
    []
  );

  const editCard = useCallback(
    async (cardId: string, updates: Partial<Card>) => {
      try {
        await apiUpdateCard(cardId, updates);
        // Update local state: remove if archived, otherwise update fields
        setLists((prev) =>
          prev.map((list) => ({
            ...list,
            cards: updates.is_archived
              ? list.cards.filter((card) => card.id !== cardId)
              : list.cards.map((card) =>
                  card.id === cardId ? { ...card, ...updates } : card
                ),
          }))
        );
      } catch (err) {
        console.error("Failed to update card:", err);
      }
    },
    []
  );

  const removeCard = useCallback(
    async (cardId: string, listId: string) => {
      try {
        await apiDeleteCard(cardId);
        setLists((prev) =>
          prev.map((list) =>
            list.id === listId
              ? { ...list, cards: list.cards.filter((c) => c.id !== cardId) }
              : list
          )
        );
      } catch (err) {
        console.error("Failed to delete card:", err);
      }
    },
    []
  );

  const persistCardOrder = useCallback(
    async (
      updates: Array<{ id: string; position: number; list_id: string }>
    ) => {
      try {
        console.log("Persisting card reorder:", updates);
        await apiReorderCards(updates);
        console.log("Card reorder persisted successfully");
      } catch (err) {
        console.error("Failed to reorder cards:", err);
      }
    },
    []
  );

  // ─── Context value ─────────────────────────────────────────────────────

  const value: BoardContextValue = {
    board,
    lists,
    loading,
    error,
    refreshBoard,
    setLists,
    addList,
    editListTitle,
    removeList,
    persistListOrder,
    addCard,
    editCard,
    removeCard,
    persistCardOrder,
    searchQuery,
    setSearchQuery,
    filterLabels,
    setFilterLabels,
    filterMembers,
    setFilterMembers,
    filterDueDate,
    setFilterDueDate,
    hasActiveFilters,
    clearFilters,
    isCardVisible,
  };

  return (
    <BoardContext.Provider value={value}>{children}</BoardContext.Provider>
  );
}

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useBoardContext() {
  const ctx = useContext(BoardContext);
  if (!ctx) {
    throw new Error("useBoardContext must be used within BoardProvider");
  }
  return ctx;
}
