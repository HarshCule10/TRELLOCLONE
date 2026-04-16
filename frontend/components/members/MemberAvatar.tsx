"use client";

import React from "react";

interface MemberAvatarProps {
  name: string;
  avatarUrl?: string | null;
  avatarColor?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "w-6 h-6 text-[10px]",
  md: "w-8 h-8 text-xs",
  lg: "w-10 h-10 text-sm",
};

/**
 * Circular avatar with initials fallback.
 * Matches Trello's member avatar style.
 */
export default function MemberAvatar({
  name,
  avatarUrl,
  avatarColor = "#026AA7",
  size = "md",
  className = "",
}: MemberAvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        title={name}
        className={`${sizeMap[size]} rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      title={name}
      className={`${sizeMap[size]} rounded-full flex items-center justify-center font-bold text-white select-none cursor-default ${className}`}
      style={{ backgroundColor: avatarColor }}
    >
      {initials}
    </div>
  );
}
