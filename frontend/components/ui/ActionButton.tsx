"use client";

import React from "react";

interface ActionButtonProps {
  label: string;
  icon?: React.ElementType;
  onClick: () => void;
  variant?: "primary" | "ghost";
  badge?: number;
  disabled?: boolean;
}

export function ActionButton({
  label,
  icon: Icon,
  onClick,
  variant = "primary",
  badge,
  disabled = false,
}: ActionButtonProps) {
  return (
    <button
      className={`dash-btn dash-btn--${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {Icon && <Icon size={15} strokeWidth={2} />}
      {label}
      {badge !== undefined && badge > 0 && (
        <span className="dash-btn__badge">{badge}</span>
      )}
    </button>
  );
}