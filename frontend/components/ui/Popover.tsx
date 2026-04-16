"use client";

import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  /** Title shown at top of the popover panel */
  title?: string;
  /** Alignment relative to trigger */
  align?: "left" | "right" | "center";
  /** Additional class for the panel */
  className?: string;
}

/**
 * Trello-style popover that opens on trigger click.
 * Closes on outside click or Escape key.
 */
export default function Popover({
  trigger,
  children,
  title,
  align = "left",
  className = "",
}: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClick);
      document.addEventListener("keydown", handleKey);
    }
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isOpen]);

  const alignClass =
    align === "right"
      ? "right-0"
      : align === "center"
        ? "left-1/2 -translate-x-1/2"
        : "left-0";

  return (
    <div ref={containerRef} className="relative inline-block">
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      {isOpen && (
        <div
          className={`absolute top-full mt-2 z-50 w-72 max-w-[90vw] bg-[#282e33] text-[#B6C2CF] rounded-lg shadow-2xl border border-[#3A4045] animate-scale-in ${alignClass} ${className}`}
        >
          {/* Header */}
          <div className="relative flex items-center justify-center h-10 px-3 border-b border-[#3A4045]/50">
            {title && (
              <h3 className="text-sm font-semibold text-[#8C9BAB] truncate px-6">
                {title}
              </h3>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-2 p-1.5 rounded-md hover:bg-white/10 transition-colors"
            >
              <X size={16} className="text-[#8C9BAB]" />
            </button>
          </div>

          {/* Content */}
          <div className="py-2">{children}</div>
        </div>
      )}
    </div>
  );
}
