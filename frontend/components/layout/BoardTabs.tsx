"use client";

import React, { useState } from "react";
import { Layout, LayoutGrid, Archive } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Modal from "../ui/Modal";
import BoardSwitcher from "../boards/BoardSwitcher";
import ArchivedTasksModal from "../boards/ArchivedTasksModal";

/**
 * Floating bottom navigation bar matching the premium UI design.
 */
export default function BoardTabs() {
  const pathname = usePathname();
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [isArchivedOpen, setIsArchivedOpen] = useState(false);
  
  // Determine if we are on a specific board or just checking "switcher"
  const isBoardActive = pathname.startsWith("/boards/") && !isSwitcherOpen && !isArchivedOpen;

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center bg-[#161616]/90 backdrop-blur-md border border-white/10 rounded-2xl p-1.5 shadow-2xl">
          {/* Board Tab */}
          <Link 
            href={pathname}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 group relative
              ${isBoardActive ? "bg-[#1d283a] text-[#579dff]" : "text-[#9fadbc] hover:text-white hover:bg-white/5"}
            `}
          >
            <Layout size={18} className={isBoardActive ? "text-[#579dff]" : "text-[#9fadbc] group-hover:text-white"} />
            <span className="text-sm font-semibold hidden sm:inline transition-opacity">Board</span>
            
            {isBoardActive && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#579dff] rounded-t-full" />
            )}
          </Link>

          {/* Vertical Separator */}
          <div className="w-px h-6 bg-white/10 mx-1" />

          {/* Archived Tasks Tab */}
          <button 
            onClick={() => setIsArchivedOpen(true)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 group
              ${isArchivedOpen ? "bg-[#1d283a] text-[#579dff]" : "text-[#9fadbc] hover:text-white hover:bg-white/5"}
            `}
          >
            <Archive size={18} className={isArchivedOpen ? "text-[#579dff]" : "text-[#9fadbc] group-hover:text-white"} />
            <span className="text-sm font-semibold whitespace-nowrap hidden sm:inline transition-opacity">Archived tasks</span>
          </button>

          {/* Vertical Separator */}
          <div className="w-px h-6 bg-white/10 mx-1" />

          {/* Switch Boards Tab */}
          <button 
            onClick={() => setIsSwitcherOpen(true)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 group
              ${isSwitcherOpen ? "bg-[#1d283a] text-[#579dff]" : "text-[#9fadbc] hover:text-white hover:bg-white/5"}
            `}
          >
            <LayoutGrid size={18} className={isSwitcherOpen ? "text-[#579dff]" : "text-[#9fadbc] group-hover:text-white"} />
            <span className="text-sm font-semibold whitespace-nowrap hidden sm:inline transition-opacity">Switch boards</span>
          </button>
        </div>
      </div>

      <Modal 
        isOpen={isSwitcherOpen} 
        onClose={() => setIsSwitcherOpen(false)}
        className="max-w-md overflow-hidden"
        showClose={false}
      >
        <BoardSwitcher onSelect={() => setIsSwitcherOpen(false)} />
      </Modal>

      <Modal 
        isOpen={isArchivedOpen} 
        onClose={() => setIsArchivedOpen(false)}
        className="max-w-md overflow-hidden"
        showClose={false}
      >
        <ArchivedTasksModal onClose={() => setIsArchivedOpen(false)} />
      </Modal>
    </>
  );
}
