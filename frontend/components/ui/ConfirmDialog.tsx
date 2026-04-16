"use client";

import React from "react";
import Button from "./Button";
import Modal from "./Modal";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  variant?: "danger" | "primary";
}

/**
 * Confirmation dialog for destructive actions (delete board, card, list).
 */
export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Delete",
  variant = "danger",
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-sm">
      <div className="text-center">
        <h3 className="text-base font-semibold text-[var(--trello-text)] mb-2">
          {title}
        </h3>
        <p className="text-sm text-[var(--trello-text-subtle)] mb-5">
          {message}
        </p>
        <div className="flex gap-2 justify-center">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant={variant}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
