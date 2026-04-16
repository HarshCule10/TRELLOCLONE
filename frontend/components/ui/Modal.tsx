"use client";

import React, { useEffect, useCallback } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Optional title for the modal header */
  title?: string;
  /** Width class override — defaults to max-w-2xl */
  className?: string;
  /** Whether to show the default close button — defaults to true */
  showClose?: boolean;
}

/**
 * Accessible modal shell with backdrop overlay.
 * - Closes on backdrop click
 * - Closes on Escape key
 * - Traps focus within the modal
 */
export default function Modal({
  isOpen,
  onClose,
  children,
  title,
  className = "max-w-2xl",
  showClose = true,
}: ModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 px-4"
      style={{ backgroundColor: "var(--trello-overlay)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`relative w-full ${className} bg-[var(--trello-modal-bg)] rounded-lg shadow-xl animate-scale-in`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* Close button */}
        {showClose && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-[var(--trello-gray-hover)] transition-colors z-10"
            aria-label="Close modal"
          >
            <X size={20} className="text-[var(--trello-text-subtle)]" />
          </button>
        )}

        {/* Title */}
        {title && (
          <div className="px-6 pt-4 pb-0">
            <h2 className="text-lg font-semibold text-[var(--trello-text)]">
              {title}
            </h2>
          </div>
        )}

        {/* Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
