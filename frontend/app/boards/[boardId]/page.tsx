"use client";

import React, { use } from "react";
import Navbar from "@/components/layout/Navbar";
import BoardHeader from "@/components/layout/BoardHeader";
import BoardDndContext from "@/components/dnd/BoardDndContext";
import { BoardProvider, useBoardContext } from "@/context/BoardContext";
import CardDetailModal from "@/components/cards/CardDetailModal";
import FilterPopover from "@/components/search/FilterPopover";
import Popover from "@/components/ui/Popover";
import CreateBoardModal from "@/components/boards/CreateBoardModal";
import BoardTabs from "@/components/layout/BoardTabs";
import { createBoard } from "@/lib/api";
import { useRouter } from "next/navigation";

function BoardViewContent() {
  const { board, loading, error, hasActiveFilters } = useBoardContext();
  const [activeCardId, setActiveCardId] = React.useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const router = useRouter();

  const handleCreateBoard = async (title: string, backgroundColor: string) => {
    try {
      const newBoard = await createBoard(title, backgroundColor);
      router.push(`/boards/${newBoard.id}`);
    } catch (err) {
      console.error("Failed to create board:", err);
    }
  };
  
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[var(--trello-blue)]">
        <div className="text-white bg-black/20 px-4 py-2 rounded-lg flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Loading board...
        </div>
      </div>
    );
  }

  if (error || !board) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-100">
        <h2 className="text-xl font-bold mb-2">Board not found</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go back
        </button>
      </div>
    );
  }

  const bgStyle = board.background_image
    ? {
        backgroundImage: `url(${board.background_image})`,
        backgroundSize: "cover" as const,
        backgroundPosition: "center",
      }
    : {
        background: "linear-gradient(135deg, #091e42 0%, #172b4d 25%, #3e1f47 50%, #7d3c5e 80%, #c97a90 100%)",
        backgroundImage: `
          radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.3) 100%),
          linear-gradient(135deg, #091e42 0%, #172b4d 25%, #3e1f47 50%, #7d3c5e 80%, #c97a90 100%)
        `,
      };

  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={bgStyle}
    >
      <Navbar onCreateClick={() => setIsCreateModalOpen(true)} />
      <Popover 
        trigger={<div className="opacity-0 w-0 h-0 absolute overflow-hidden pointer-events-none" id="filter-trigger" />}
        title="Filter"
      >
        <FilterPopover />
      </Popover>
      
      {/* We had the filter button on the BoardHeader, so we need to bridge it using absolute position or Popover */}
      {/* Actually I will just pass the trigger down to the header in future, but for now we re-wrote board header before popover so let's just make it work inside Header by overriding the component. */}
      {/* Wait, my BoardHeader receives an onToggleFilter. I can just render the popover from there. Let me fix BoardHeader in a sec if needed. For now, let's just put it next to header. */}
      
      <BoardHeader onToggleFilter={() => document.getElementById("filter-trigger")?.click()} />
      
      <main className="flex-1 relative outline-none overflow-hidden min-w-0">
        <BoardDndContext onCardClick={(id) => setActiveCardId(id)} />

        <CardDetailModal 
          cardId={activeCardId} 
          onClose={() => setActiveCardId(null)} 
        />

        <CreateBoardModal 
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateBoard}
        />
      </main>
      <BoardTabs />
    </div>
  );
}

interface PageProps {
  params: Promise<{ boardId: string }>;
}

export default function BoardPage({ params }: PageProps) {
  const unwrappedParams = use(params);
  
  return (
    <BoardProvider boardId={unwrappedParams.boardId}>
      <BoardViewContent />
    </BoardProvider>
  );
}
