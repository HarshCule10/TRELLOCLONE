"use client";

import React from "react";

type ButtonVariant = "primary" | "ghost" | "danger" | "subtle";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  /** Full width */
  block?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[#0079BF] hover:bg-[#026AA7] text-white font-medium",
  ghost:
    "bg-transparent hover:bg-black/5 text-[var(--trello-text)]",
  danger:
    "bg-[#EB5A46] hover:bg-[#CF513D] text-white font-medium",
  subtle:
    "bg-[var(--trello-gray)] hover:bg-[var(--trello-gray-hover)] text-[var(--trello-text)]",
};

/**
 * Styled button with Trello-faithful variants.
 */
export default function Button({
  variant = "primary",
  block = false,
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-1.5
        px-3 py-1.5 rounded text-sm
        transition-colors duration-100
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${block ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
