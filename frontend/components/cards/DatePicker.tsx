"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";

interface DatePickerProps {
  currentDate: string | null;
  onSave: (dateText: string | null) => void;
  onClose?: () => void;
}

export default function DatePicker({
  currentDate,
  onSave,
  onClose,
}: DatePickerProps) {
  // Try to parse the existing date into datetime-local format 'YYYY-MM-DDThh:mm'
  const getInitialValue = () => {
    if (!currentDate) return "";
    try {
      const d = new Date(currentDate);
      return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
    } catch {
      return "";
    }
  };

  const [dateValue, setDateValue] = useState(getInitialValue());

  const handleSave = () => {
    if (!dateValue) return;
    // Input is local time, browser will convert it back to ISO with correct offsets 
    // when we instantiate `new Date(dateValue)` but let's just pass ISO string directly
    const isoString = new Date(dateValue).toISOString();
    onSave(isoString);
    onClose?.();
  };

  const handleRemove = () => {
    onSave(null);
    onClose?.();
  };

  return (
    <div className="flex flex-col gap-3">
      <div>
        <label className="block text-xs font-semibold text-[var(--trello-text-subtle)] mb-1 uppercase">
          Due Date & Time
        </label>
        <input
          type="datetime-local"
          value={dateValue}
          onChange={(e) => setDateValue(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-transparent text-[var(--trello-text)] border-2 border-[var(--trello-input-border)] focus:border-[var(--trello-input-focus)] rounded outline-none transition-colors"
        />
      </div>

      <div className="flex flex-col gap-2 mt-2">
        <Button onClick={handleSave} disabled={!dateValue} block>
          Save
        </Button>
        <Button variant="danger" onClick={handleRemove} disabled={!currentDate} block>
          Remove
        </Button>
      </div>
    </div>
  );
}
