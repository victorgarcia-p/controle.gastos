"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Selecione...",
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef         = useRef<HTMLDivElement>(null);

  // Fecha ao clicar fora
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function toggle(val: string) {
    if (value.includes(val)) {
      onChange(value.filter(v => v !== val));
    } else {
      onChange([...value, val]);
    }
  }

  // Texto exibido no campo — nomes separados por vírgula
  const displayText = options
    .filter(o => value.includes(o.value))
    .map(o => o.label)
    .join(", ");

  return (
    <div className="ms-root" ref={rootRef}>
      {/* Campo */}
      <div
        className={`ms-control ${open ? "ms-control--open" : ""}`}
        onClick={() => setOpen(o => !o)}
      >
        <span className={displayText ? "ms-display-text" : "ms-placeholder"}>
          {displayText || placeholder}
        </span>
        <ChevronDown
          size={14}
          strokeWidth={2}
          className={`ms-chevron ${open ? "ms-chevron--open" : ""}`}
        />
      </div>

      {/* Dropdown flutuante */}
      {open && (
        <div className="ms-dropdown">
          {options.map(opt => {
            const selected = value.includes(opt.value);
            return (
              <div
                key={opt.value}
                className={`ms-option ${selected ? "ms-option--selected" : ""}`}
                onClick={() => toggle(opt.value)}
              >
                <span className="ms-option__check">{selected ? "✓" : ""}</span>
                {opt.label}
              </div>
            );
          })}
          {options.length === 0 && (
            <div className="ms-option ms-option--empty">Nenhuma opção</div>
          )}
          {value.length > 0 && (
            <div className="ms-clear" onClick={() => onChange([])}>
              Limpar seleção
            </div>
          )}
        </div>
      )}
    </div>
  );
}