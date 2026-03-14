"use client";

import React from "react";
import { MultiSelect, MultiSelectOption } from "./MultiSelect";

// ─── Types ────────────────────────────────────────────────────────────────────

export type FilterFieldType = "text" | "date" | "number" | "select" | "multiselect";

export interface FilterSelectOption {
  value: string;
  label: string;
}

export interface FilterField {
  key: string;
  label: string;
  type: FilterFieldType;
  placeholder?: string;
  options?: FilterSelectOption[];
}

interface FilterPanelProps {
  open: boolean;
  fields: FilterField[];
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
  onApply: () => void;
  onClear: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function FilterPanel({
  open,
  fields,
  values,
  onChange,
  onApply,
  onClear,
}: FilterPanelProps) {
  return (
    <div className={`dash-filters ${open ? "dash-filters--open" : ""}`}>
      <div className="dash-filters__grid">
        {fields.map((field) => (
          <div key={field.key} className="dash-filters__field">
            <label>{field.label}</label>

            {field.type === "select" && (
              <select
                value={values[field.key] ?? ""}
                onChange={(e) => onChange(field.key, e.target.value)}
              >
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}

            {field.type === "multiselect" && (
              <MultiSelect
                options={(field.options ?? []) as MultiSelectOption[]}
                value={values[field.key] ?? []}
                onChange={(vals) => onChange(field.key, vals)}
                placeholder={field.placeholder ?? "Selecione..."}
              />
            )}

            {(field.type === "text" || field.type === "date" || field.type === "number") && (
              <input
                type={field.type}
                placeholder={field.placeholder}
                value={values[field.key] ?? ""}
                onChange={(e) => onChange(field.key, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>

      <div className="dash-filters__footer">
        <button className="dash-btn dash-btn--ghost" onClick={onClear}>
          Limpar
        </button>
        <button className="dash-btn dash-btn--primary" onClick={onApply}>
          Aplicar filtros
        </button>
      </div>
    </div>
  );
}