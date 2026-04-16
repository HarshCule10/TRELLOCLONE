"use client";

import React from "react";
import Link from "next/link";
import type { Board } from "@/lib/types";

interface BoardCardProps {
  board: Board;
}

/**
 * Board thumbnail card shown on the homepage.
 * Shows title overlaying the board's background color.
 */
export default function BoardCard({ board }: BoardCardProps) {
  return (
    <Link href={`/boards/${board.id}`} className="block group">
      <div
        className="relative h-24 rounded-lg p-3 transition-all duration-150 overflow-hidden"
        style={{
          backgroundColor: board.background_color || "#026AA7",
          backgroundImage: board.background_image
            ? `url(${board.background_image})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors rounded-lg" />

        {/* Title */}
        <span className="relative text-white font-bold text-base leading-tight">
          {board.title}
        </span>
      </div>
    </Link>
  );
}
