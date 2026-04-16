"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Search, Clock, ChevronRight, Layout, List, Pin, X } from "lucide-react";
import { getBoards } from "@/lib/api";
import type { Board } from "@/lib/types";
import { useRouter } from "next/navigation";

interface BoardSwitcherProps {
  onSelect: () => void;
}

export default function BoardSwitcher({ onSelect }: BoardSwitcherProps) {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchBoards() {
      try {
        const data = await getBoards();
        setBoards(data);
      } catch (err) {
        console.error("Failed to fetch boards:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBoards();
  }, []);

  const filteredBoards = useMemo(() => {
    return boards.filter((b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [boards, searchQuery]);

  const handleBoardClick = (boardId: string) => {
    router.push(`/boards/${boardId}`);
    onSelect();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-[var(--trello-text-subtle)]">
        <div className="w-8 h-8 border-4 border-[var(--trello-blue)] border-t-transparent rounded-full animate-spin mb-4" />
        <p>Loading your boards...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[500px] bg-[#22272b] -m-6 rounded-lg overflow-hidden">
      {/* Search Header */}
      <div className="p-4 bg-[#1d2125] border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search 
              size={16} 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8c9bab]" 
            />
            <input
              type="text"
              placeholder="Search your boards"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#091e4224] border-[1px] border-white/10 focus:border-[#388bff] text-[#b6c2cf] pl-9 pr-4 py-2 rounded-[3px] focus:outline-none placeholder:text-[#8c9bab] text-sm transition-all"
              autoFocus
            />
          </div>
          <div className="flex items-center gap-2">
            <button 
              className="p-2.5 bg-white/5 border border-white/20 rounded-md text-[#b6c2cf] hover:bg-white/10 transition-colors"
              aria-label="List view"
            >
              <List size={20} />
            </button>
            <button 
              onClick={onSelect}
              className="p-2.5 bg-white/5 rounded-md text-[#8c9bab] hover:text-[#b6c2cf] hover:bg-white/10 transition-colors"
              aria-label="Close switcher"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mt-3">
          <button className="px-3 py-1 rounded bg-[#1d283a] text-[#579dff] text-xs font-semibold">
            All
          </button>
          <button className="px-3 py-1 rounded bg-white/5 text-[#b6c2cf] text-xs font-semibold hover:bg-white/10">
            Trello Workspace
          </button>
        </div>
      </div>

      {/* Boards List */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {/* Recent Section */}
        {!searchQuery && (
          <div className="mb-6">
            <div className="flex items-center gap-2 text-[#8c9bab] mb-3 px-1">
              <Clock size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Recent</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {boards.slice(0, 2).map((board) => (
                <button
                  key={`recent-${board.id}`}
                  onClick={() => handleBoardClick(board.id)}
                  className="group relative h-20 rounded-lg overflow-hidden text-left"
                >
                  <div 
                    className="absolute inset-0 transition-transform duration-300 group-hover:scale-105"
                    style={{ 
                      backgroundColor: board.background_color || "#0079bf",
                      backgroundImage: board.background_image ? `url(${board.background_image})` : "none",
                      backgroundSize: "cover",
                      backgroundPosition: "center"
                    }}
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/40">
                    <span className="text-white text-xs font-bold truncate block">{board.title}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Workspace Section */}
        <div>
          <button className="flex items-center gap-1 text-[#b6c2cf] mb-3 px-1 hover:text-white transition-colors group">
            <ChevronRight size={20} className="transform rotate-90" />
            <span className="text-sm font-bold">Trello Workspace</span>
          </button>
          
          <div className="space-y-1">
            {filteredBoards.length > 0 ? (
              filteredBoards.map((board) => (
                <button
                  key={board.id}
                  onClick={() => handleBoardClick(board.id)}
                  className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-white/5 transition-colors group text-left"
                >
                  <div 
                    className="w-8 h-6 rounded-sm shadow-sm"
                    style={{ 
                      backgroundColor: board.background_color || "#0079bf",
                      backgroundImage: board.background_image ? `url(${board.background_image})` : "none",
                      backgroundSize: "cover",
                      backgroundPosition: "center"
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[#b6c2cf] text-sm font-medium truncate group-hover:text-white">
                      {board.title}
                    </p>
                    <p className="text-[#8c9bab] text-[10px] uppercase font-bold tracking-tighter">
                      Trello Workspace
                    </p>
                  </div>
                </button>
              ))
            ) : (
              <p className="text-center py-8 text-[#8c9bab] text-sm italic">
                No boards found matching "{searchQuery}"
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
