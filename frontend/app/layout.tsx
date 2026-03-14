"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  ArrowLeftRight,
  Wallet,
  Menu,
  X,
  BookMarked,
} from "lucide-react";
import "./globals.css";
import { getTransacoes } from "../services/transacoes.service";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavItem  { href: string; label: string; icon: React.ElementType; badge?: number; }
interface NavGroup { section: string; items: NavItem[]; }

interface Transacao {
  id: number;
  descricao: string;
  valor: number;
  tipo: 0 | 1;  // 0 = Despesa, 1 = Receita
  data: string;
  pessoaId: number;
  categoriaId: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const W_FULL = 150;

function getMesAtual() {
  return new Date().toLocaleString("pt-BR", { month: "long", year: "numeric" });
}

function getPeriodoAtual() {
  const now   = new Date();
  const ano   = now.getFullYear();
  const mes   = String(now.getMonth() + 1).padStart(2, "0");
  const ultimo = new Date(ano, now.getMonth() + 1, 0).getDate();
  return {
    DataInicio: `${ano}-${mes}-01`,
    DataFim:    `${ano}-${mes}-${ultimo}`,
  };
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar() {
  const pathname                        = usePathname();
  const [expanded, setExpanded]         = useState(true);
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [transacoes, setTransacoes]     = useState<Transacao[]>([]);

  // Hover expand/collapse via posição X do mouse
  useEffect(() => {
    const handleMove = (e: MouseEvent) => setExpanded(e.clientX < W_FULL);
    document.addEventListener("mousemove", handleMove);
    return () => document.removeEventListener("mousemove", handleMove);
  }, []);

  // Carrega transações do mês atual ao montar
  useEffect(() => {
    getTransacoes(getPeriodoAtual()).then(setTransacoes).catch(console.error);
  }, []);

  // Calcula resumo a partir dos dados reais
  const receita  = transacoes.filter(t => t.tipo === 1).reduce((acc, t) => acc + t.valor, 0);
  const despesa  = transacoes.filter(t => t.tipo === 0).reduce((acc, t) => acc + t.valor, 0);
  const spentPct = receita > 0 ? Math.min((despesa / receita) * 100, 100) : 0;
  const total    = transacoes.length;

  const fmt = (n: number) =>
    n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const collapsed  = !expanded;
  const asideClass = ["sb-aside", expanded ? "expanded" : "collapsed", mobileOpen ? "mobile-open" : ""]
    .filter(Boolean).join(" ");

  // NAV com badge dinâmico de transações
  const NAV: NavGroup[] = [
    {
      section: "Principal",
      items: [{ href: "/", label: "Dashboard", icon: LayoutDashboard }],
    },
    {
      section: "Gestão",
      items: [
        { href: "/pessoas",    label: "Pessoas",    icon: Users },
        { href: "/transacoes", label: "Transações", icon: ArrowLeftRight, badge: total },
        { href: "/categorias", label: "Categorias", icon: BookMarked },
      ],
    },
  ];

  return (
    <>
      <button
        className="sb-hamburger"
        onClick={() => setMobileOpen((o) => !o)}
        aria-label="Abrir menu"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {mobileOpen && (
        <div className="sb-overlay" onClick={() => setMobileOpen(false)} />
      )}

      <div className="sb-spacer" />

      <aside className={asideClass}>
        {/* Logo */}
        <div className="sb-logo">
          <div className="sb-logo__icon">
            <Wallet size={18} strokeWidth={2} />
          </div>
          {!collapsed && (
            <div className="sb-logo__text">
              <div className="sb-logo__name">Controle de</div>
              <div className="sb-logo__tag">Gastos</div>
            </div>
          )}
        </div>

        {/* Resumo do mês */}
        {!collapsed && (
          <div className="sb-summary">
            <div className="sb-summary__month">{getMesAtual()}</div>
            <div className="sb-summary__row">
              <div className="sb-summary__col">
                <span className="sb-summary__label">Receita</span>
                <span className="sb-summary__val sb-summary__val--saldo">
                  R$ {fmt(receita)}
                </span>
              </div>
              <div className="sb-summary__col">
                <span className="sb-summary__label">Despesa</span>
                <span className="sb-summary__val sb-summary__val--gasto">
                  R$ {fmt(despesa)}
                </span>
              </div>
            </div>
            <div className="sb-summary__bar">
              <div className="sb-summary__bar-fill" style={{ width: `${spentPct}%` }} />
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="sb-nav">
          {NAV.map(({ section, items }) => (
            <div key={section} className="sb-group">
              {!collapsed ? (
                <div className="sb-section">
                  <span className="sb-section__label">{section}</span>
                  <div className="sb-section__line" />
                </div>
              ) : (
                <div className="sb-divider" />
              )}

              {items.map(({ href, label, icon: Icon, badge }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    title={collapsed ? label : undefined}
                    onClick={() => setMobileOpen(false)}
                    className={`sb-item${active ? " active" : ""}`}
                  >
                    <span className="sb-item__icon">
                      <Icon size={17} strokeWidth={2} />
                    </span>
                    {!collapsed && (
                      <>
                        <span className="sb-item__label">{label}</span>
                        {badge !== undefined && badge > 0 && (
                          <span className="sb-badge">
                            {badge > 99 ? "99+" : badge}
                          </span>
                        )}
                      </>
                    )}
                    {collapsed && badge !== undefined && badge > 0 && (
                      <span className="sb-badge-dot" />
                    )}
                    {active && <span className="sb-item__active-bar" />}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="sb-flex-spacer" />
      </aside>
    </>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        <Sidebar />
        <main style={{ flex: 1, overflowY: "auto", padding: "32px" }}>
          {children}
        </main>
      </body>
    </html>
  );
}