"use client";

import React from "react";
import { X, Check } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DrawerProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onSave: () => void;
  saving?: boolean;
  saveLabel?: string;
  children: React.ReactNode;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Drawer({
  open,
  title,
  onClose,
  onSave,
  saving = false,
  saveLabel = "Salvar",
  children,
}: DrawerProps) {
  return (
    <>
      {/* Overlay */}
      {open && <div className="drawer-overlay" onClick={onClose} />}

      {/* Drawer */}
      <div className={`drawer ${open ? "drawer--open" : ""}`}>
        <div className="drawer__header">
          <span className="drawer__title">{title}</span>
          <button className="drawer__close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Conteúdo do formulário passado como children */}
        <div className="drawer__body">{children}</div>

        <div className="drawer__footer">
          <button className="drawer__btn drawer__btn--ghost" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="drawer__btn drawer__btn--primary"
            onClick={onSave}
            disabled={saving}
          >
            {saving ? "Salvando..." : <><Check size={15} /> {saveLabel}</>}
          </button>
        </div>
      </div>
    </>
  );
}