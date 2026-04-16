"use client";

import React, { useContext } from "react";
import Link from "next/link";
import { Grid3x3, Search, Bell, HelpCircle, Megaphone, Layout, LayoutGrid } from "lucide-react";
import MemberAvatar from "../members/MemberAvatar";
import { BoardContext } from "@/context/BoardContext";

interface NavbarProps {
  onCreateClick?: () => void;
}

export default function Navbar({ onCreateClick }: NavbarProps) {
  // Use context safely. If we are on the homepage, this returns null.
  const boardCtx = useContext(BoardContext);
  const isSearchDisabled = !boardCtx;
  const searchQuery = boardCtx?.searchQuery || "";
  const setSearchQuery = boardCtx?.setSearchQuery || (() => {});

  return (
    <header className="h-12 flex items-center px-2 shrink-0 bg-[#1d2125] text-white border-b border-white/10 relative">
      {/* Left section */}
      <div className="flex items-center gap-1 shrink-0 z-10">
        <button className="p-2 rounded hover:bg-white/10 transition-colors text-white/80 hover:text-white">
          <Grid3x3 size={20} />
        </button>
        
        <Link
          href="/"
          className="flex items-center gap-1 px-2 py-1.5 rounded hover:bg-white/10 transition-colors ml-1"
        >
          <div className="bg-[#0052cc] p-0.5 rounded-sm flex items-center justify-center">
            <Layout size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight opacity-90 hover:opacity-100 mb-0.5">
            Trello
          </span>
        </Link>
      </div>

      {/* Middle section: Search & Create (Hidden on small mobile) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-4 overflow-hidden">
        <div className="flex items-center gap-2 pointer-events-auto w-full max-w-[500px] justify-center">
          {/* Search - Shrink/Hide on mobile */}
          <div className="relative flex-1 hidden md:block max-w-[320px]">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
              <Search size={16} className="text-white/60" />
            </div>
            <input
              type="text"
              placeholder={isSearchDisabled ? "Search..." : "Search"}
              disabled={isSearchDisabled}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-3 py-1.5 text-sm bg-[#22272b] border border-[#3A4045] rounded 
                focus:bg-[#22272b] focus:border-[#579dff] focus:outline-none focus:ring-1 focus:ring-[#579dff] 
                placeholder:text-white/50 text-white transition-all
                ${isSearchDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-[#2c333a]"}`}
            />
          </div>

          <button className="md:hidden p-2 rounded hover:bg-white/10 transition-colors text-white/80">
            <Search size={18} />
          </button>

          {/* Create Button - Icon only on mobile */}
          <button
            onClick={onCreateClick}
            className="bg-[#579dff] hover:bg-[#85b8ff] text-[#1d2125] text-sm font-semibold px-3 py-1.5 rounded-[3px] transition-colors whitespace-nowrap flex items-center gap-1"
          >
            <span className="hidden sm:inline">Create</span>
            <span className="sm:hidden">+</span>
          </button>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-1 shrink-0 ml-auto z-10">
        <button className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/80 hover:text-white">
          <Megaphone size={18} />
        </button>
        <button className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/80 hover:text-white">
          <Bell size={18} />
        </button>
        <button className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/80 hover:text-white mr-2">
          <HelpCircle size={18} />
        </button>
        
        {/* Avatar matched to TH in red */}
        <div className="mr-2">
          <MemberAvatar name="TH User" avatarColor="#E94A3F" size="sm" />
        </div>
      </div>
    </header>
  );
}
