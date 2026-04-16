"use client";

import React, { useEffect, useState } from "react";
import { Plus, User } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import BoardCard from "@/components/boards/BoardCard";
import CreateBoardModal from "@/components/boards/CreateBoardModal";
import { getBoards, createBoard } from "@/lib/api";
import type { Board } from "@/lib/types";

/**
 * Boards homepage — lists all boards with a "create new board" card.
 * Modeled after Trello's "Your boards" page layout.
 */
export default function HomePage() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    loadBoards();
  }, []);

  const loadBoards = async () => {
    try {
      const data = await getBoards();
      setBoards(data);
    } catch (err) {
      console.error("Failed to load boards:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBoard = async (title: string, backgroundColor: string) => {
    try {
      const newBoard = await createBoard(title, backgroundColor);
      setBoards((prev) => [newBoard, ...prev]);
    } catch (err) {
      console.error("Failed to create board:", err);
    }
  };

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ backgroundImage: "linear-gradient(135deg, #2d1b3d 0%, #6b3a5d 40%, #b05c7a 75%, #c97a90 100%)" }}
    >
      <Navbar onCreateClick={() => setIsCreateOpen(true)} />

      <main className="flex-1 px-4 py-8 max-w-5xl mx-auto w-full">
        {/* Section header */}
        <div className="flex items-center gap-2 mb-4">
          <User size={20} className="text-white/80" />
          <h2 className="text-base font-bold text-white">Your boards</h2>
        </div>

        {/* Board grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-24 rounded-lg bg-white/10 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {boards.map((board) => (
              <BoardCard key={board.id} board={board} />
            ))}

            {/* Create new board card */}
            <button
              onClick={() => setIsCreateOpen(true)}
              className="h-24 rounded-lg bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center gap-1.5 text-white/80 hover:text-white text-sm"
            >
              <Plus size={16} />
              Create new board
            </button>
          </div>
        )}
      </main>

      <CreateBoardModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateBoard}
      />
    </div>
  );
}
