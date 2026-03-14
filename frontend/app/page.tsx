"use client";

import { useEffect, useState, useMemo } from "react";
import { getTransacoes, createTransacao } from "../services/transacoes.service";
import { getPessoas } from "../services/pessoas.service";
import { getCategorias } from "../services/categorias.service";
import { Transacao, FiltroTransacao, NovaTransacao } from "../types/transacoes";
import { Pessoa } from "../types/pessoas";
import { Categoria } from "../types/categorias";
import { ActionButton, FilterPanel, Drawer } from "../components/Index";
import type { FilterField } from "../components/Index";
import {
  TrendingUp, TrendingDown, Wallet, ArrowLeftRight,
  Users, Tag, SlidersHorizontal, Plus,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import "./globals.css";
import "./Dashboard.css";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const fmtShort = (n: number) =>
  n >= 1000 ? `R$${(n / 1000).toFixed(1)}k` : `R$${n.toFixed(0)}`;

function getPeriodoAtual() {
  const now    = new Date();
  const ano    = now.getFullYear();
  const mes    = String(now.getMonth() + 1).padStart(2, "0");
  const ultimo = new Date(ano, now.getMonth() + 1, 0).getDate();
  return { DataInicio: `${ano}-${mes}-01`, DataFim: `${ano}-${mes}-${ultimo}` };
}

// ─── Cores ────────────────────────────────────────────────────────────────────

const ACCENT     = "#63d296";
const DANGER     = "#f87171";
const WARNING    = "#fbbf24";
const PIE_COLORS = ["#63d296","#fbbf24","#60a5fa","#f87171","#a78bfa","#34d399","#fb923c","#e879f9"];

// ─── Tipo auxiliar para o filtro temporário (inclui arrays dos multiselects) ──

type FiltroTemp = FiltroTransacao & { PessoasArr: string[]; CategoriasArr: string[] };

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function StatCard({ label, value, sub, icon: Icon, color, delay = 0 }: {
  label: string; value: string; sub?: string;
  icon: React.ElementType; color: string; delay?: number;
}) {
  return (
    <div className="dash-stat" style={{ animationDelay: `${delay}ms` }}>
      <div className="dash-stat__icon" style={{ background: `${color}18`, color }}>
        <Icon size={18} strokeWidth={2} />
      </div>
      <div className="dash-stat__body">
        <span className="dash-stat__label">{label}</span>
        <span className="dash-stat__value" style={{ color }}>{value}</span>
        {sub && <span className="dash-stat__sub">{sub}</span>}
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="dash-section-title">{children}</h2>;
}

function TotalsTable({ rows, totalRow }: {
  rows: { nome: string; receita: number; despesa: number; saldo: number }[];
  totalRow: { receita: number; despesa: number; saldo: number };
}) {
  return (
    <div className="dash-table-wrap">
      <table className="dash-table">
        <thead><tr><th>Nome</th><th>Receita</th><th>Despesa</th><th>Saldo</th></tr></thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.nome}>
              <td>{r.nome}</td>
              <td style={{ color: ACCENT }}>R$ {fmt(r.receita)}</td>
              <td style={{ color: DANGER }}>R$ {fmt(r.despesa)}</td>
              <td style={{ color: r.saldo >= 0 ? ACCENT : DANGER, fontWeight: 600 }}>R$ {fmt(r.saldo)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td><strong>Total geral</strong></td>
            <td style={{ color: ACCENT }}><strong>R$ {fmt(totalRow.receita)}</strong></td>
            <td style={{ color: DANGER }}><strong>R$ {fmt(totalRow.despesa)}</strong></td>
            <td style={{ color: totalRow.saldo >= 0 ? ACCENT : DANGER, fontWeight: 700 }}>
              <strong>R$ {fmt(totalRow.saldo)}</strong>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="dash-tooltip">
      {label && <div className="dash-tooltip__label">{label}</div>}
      {payload.map((p: any, i: number) => (
        <div key={i} className="dash-tooltip__row">
          <span style={{ color: p.color }}>{p.name}:</span>
          <span>R$ {fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function Home() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [pessoas, setPessoas]       = useState<Pessoa[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading]       = useState(true);
  const [filtroOpen, setFiltroOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // ── Formulário nova transação ──
  const emptyForm = { Descricao: "", Valor: "", Tipo: "0", Data: new Date().toISOString().slice(0, 10), PessoaId: "", CategoriaId: "" };
  const [form, setForm]         = useState(emptyForm);
  const [saving, setSaving]     = useState(false);
  const [formError, setFormError] = useState("");
  const setField = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  // ── Filtros ──
  const periodo = getPeriodoAtual();

  const emptyFiltroTemp = (): FiltroTemp => ({
    DataInicio: periodo.DataInicio,
    DataFim:    periodo.DataFim,
    PessoasArr: [],
    CategoriasArr: [],
  });

  const [filtro, setFiltro]       = useState<FiltroTransacao>({ DataInicio: periodo.DataInicio, DataFim: periodo.DataFim });
  const [filtroTemp, setFiltroTemp] = useState<FiltroTemp>(emptyFiltroTemp());

  function buscar(f: FiltroTransacao) {
    setLoading(true);
    getTransacoes(f)
      .then(setTransacoes)
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  function aplicarFiltro() {
    const filtroFinal: FiltroTransacao = {
      ...filtroTemp,
      Pessoas:    filtroTemp.PessoasArr?.length    ? filtroTemp.PessoasArr.join(",")    : undefined,
      Categorias: filtroTemp.CategoriasArr?.length ? filtroTemp.CategoriasArr.join(",") : undefined,
    };
    setFiltro(filtroFinal);
    setFiltroOpen(false);
    buscar(filtroFinal);
  }

  function limparFiltro() {
    const f = emptyFiltroTemp();
    setFiltroTemp(f);
    setFiltro({ DataInicio: f.DataInicio, DataFim: f.DataFim });
    buscar({ DataInicio: f.DataInicio, DataFim: f.DataFim });
  }

  const carregar = () => buscar(filtro);

  useEffect(() => { buscar(filtro); }, []);

  useEffect(() => {
    getPessoas().then(setPessoas).catch(console.error);
    getCategorias().then(setCategorias).catch(console.error);
  }, []);

  // ── Salvar nova transação ──
  async function handleSave() {
    if (!form.Descricao || !form.Valor || !form.PessoaId || !form.CategoriaId) {
      setFormError("Preencha todos os campos obrigatórios.");
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      await createTransacao({
        Descricao:   form.Descricao,
        Valor:       parseFloat(form.Valor),
        Tipo:        form.Tipo,
        Data:        new Date(form.Data).toISOString(),
        PessoaId:    parseInt(form.PessoaId),
        CategoriaId: parseInt(form.CategoriaId),
      } as NovaTransacao);
      setForm(emptyForm);
      setDrawerOpen(false);
      carregar();
    } catch {
      setFormError("Erro ao salvar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  // ── Cálculos ──
  const receita = useMemo(() => transacoes.filter(t => t.tipo === 1).reduce((a, t) => a + t.valor, 0), [transacoes]);
  const despesa = useMemo(() => transacoes.filter(t => t.tipo === 0).reduce((a, t) => a + t.valor, 0), [transacoes]);
  const saldo   = receita - despesa;
  const total   = transacoes.length;

  const porPessoa = useMemo(() => {
    const map = new Map<string, { receita: number; despesa: number }>();
    transacoes.forEach(t => {
      const nome = t.pessoa?.nome ?? `Pessoa ${t.pessoaId}`;
      const cur  = map.get(nome) ?? { receita: 0, despesa: 0 };
      if (t.tipo === 1) cur.receita += t.valor; else cur.despesa += t.valor;
      map.set(nome, cur);
    });
    return Array.from(map.entries()).map(([nome, v]) => ({ nome, ...v, saldo: v.receita - v.despesa }));
  }, [transacoes]);

  const porCategoria = useMemo(() => {
    const map = new Map<string, { receita: number; despesa: number }>();
    transacoes.forEach(t => {
      const nome = t.categoria?.descricao ?? `Categoria ${t.categoriaId}`;
      const cur  = map.get(nome) ?? { receita: 0, despesa: 0 };
      if (t.tipo === 1) cur.receita += t.valor; else cur.despesa += t.valor;
      map.set(nome, cur);
    });
    return Array.from(map.entries()).map(([nome, v]) => ({ nome, ...v, saldo: v.receita - v.despesa }));
  }, [transacoes]);

  const evolucaoDiaria = useMemo(() => {
    const map = new Map<string, { receita: number; despesa: number }>();
    transacoes.forEach(t => {
      const dia = t.data.slice(0, 10);
      const cur = map.get(dia) ?? { receita: 0, despesa: 0 };
      if (t.tipo === 1) cur.receita += t.valor; else cur.despesa += t.valor;
      map.set(dia, cur);
    });
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([dia, v]) => ({ dia: dia.slice(8, 10) + "/" + dia.slice(5, 7), ...v }));
  }, [transacoes]);

  const pizzaCategoria = useMemo(() =>
    porCategoria.map(c => ({ name: c.nome, value: c.despesa + c.receita })),
    [porCategoria]
  );

  const ultimas = useMemo(() =>
    [...transacoes].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()).slice(0, 8),
    [transacoes]
  );

  const filtrosAtivos = Object.entries(filtro).filter(([k, v]) =>
    v && k !== "DataInicio" && k !== "DataFim"
  ).length;

  const mesAtual = (() => {
    if (filtro.DataInicio) {
      const d = new Date(filtro.DataInicio + "T12:00:00");
      return d.toLocaleString("pt-BR", { month: "long", year: "numeric" });
    }
    return new Date().toLocaleString("pt-BR", { month: "long", year: "numeric" });
  })();

  const filterFields: FilterField[] = [
    { key: "DataInicio",    label: "Data início",  type: "date" },
    { key: "DataFim",       label: "Data fim",     type: "date" },
    { key: "PessoasArr",    label: "Pessoas",      type: "multiselect", placeholder: "Selecione pessoas...",
      options: pessoas.map(p => ({ value: String(p.id), label: p.nome ?? "" })) },
    { key: "CategoriasArr", label: "Categorias",   type: "multiselect", placeholder: "Selecione categorias...",
      options: categorias.map(c => ({ value: String(c.id), label: c.descricao ?? "" })) },
    { key: "Tipo",          label: "Tipo",         type: "select", options: [
        { value: "", label: "Todos" },
        { value: "0", label: "Despesa" },
        { value: "1", label: "Receita" },
      ]},
    { key: "ValorInicial",  label: "Valor mínimo", type: "number", placeholder: "0,00" },
    { key: "ValorFinal",    label: "Valor máximo", type: "number", placeholder: "0,00" },
    { key: "Descricao",     label: "Descrição",    type: "text",   placeholder: "Buscar..." },
  ];

  return (
    <>
      <div className="dash">

        {/* ── Header ── */}
        <div className="dash-header">
          <div>
            <h1 className="dash-header__title">Dashboard</h1>
            <span className="dash-header__sub">{mesAtual}</span>
          </div>
          <div className="dash-header__actions">
            <ActionButton
              label="Filtros"
              icon={SlidersHorizontal}
              variant="ghost"
              badge={filtrosAtivos}
              onClick={() => { setFiltroTemp({ ...filtro, PessoasArr: filtroTemp.PessoasArr, CategoriasArr: filtroTemp.CategoriasArr }); setFiltroOpen(o => !o); }}
            />
            <ActionButton
              label="Nova transação"
              icon={Plus}
              onClick={() => setDrawerOpen(true)}
            />
          </div>
        </div>

        {/* ── Painel de filtros colapsável ── */}
        <FilterPanel
          open={filtroOpen}
          fields={filterFields}
          values={filtroTemp}
          onChange={(key, value) => setFiltroTemp(f => ({ ...f, [key]: value }))}
          onApply={aplicarFiltro}
          onClear={limparFiltro}
        />

        {/* ── Cards de resumo ── */}
        {loading ? (
          <div className="dash-loading">
            <div className="dash-loading__spinner" />
            <span>Carregando...</span>
          </div>
        ) : (
          <>
            <div className="dash-stats">
              <StatCard label="Receita"    value={`R$ ${fmt(receita)}`} icon={TrendingUp}     color={ACCENT}                      delay={0}   />
              <StatCard label="Despesa"    value={`R$ ${fmt(despesa)}`} icon={TrendingDown}   color={DANGER}                      delay={60}  />
              <StatCard label="Saldo"      value={`R$ ${fmt(saldo)}`}   icon={Wallet}         color={saldo >= 0 ? ACCENT : DANGER} delay={120} />
              <StatCard label="Transações" value={String(total)}        icon={ArrowLeftRight} color={WARNING} sub="no período"    delay={180} />
            </div>

            {/* ── Gráficos ── */}
            <div className="dash-charts">
              <div className="dash-card dash-card--wide">
                <SectionTitle>Evolução do período</SectionTitle>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={evolucaoDiaria} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gR" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={ACCENT} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={ACCENT} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gD" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={DANGER} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={DANGER} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="dia" tick={{ fill: "rgba(240,242,245,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={fmtShort} tick={{ fill: "rgba(240,242,245,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} width={55} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="receita" name="Receita" stroke={ACCENT} strokeWidth={2} fill="url(#gR)" />
                    <Area type="monotone" dataKey="despesa" name="Despesa" stroke={DANGER}  strokeWidth={2} fill="url(#gD)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="dash-card dash-card--wide">
                <SectionTitle>Receita vs Despesa por categoria</SectionTitle>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={porCategoria} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <XAxis dataKey="nome" tick={{ fill: "rgba(240,242,245,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={fmtShort} tick={{ fill: "rgba(240,242,245,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} width={55} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="receita" name="Receita" fill={ACCENT} radius={[4,4,0,0]} />
                    <Bar dataKey="despesa" name="Despesa" fill={DANGER}  radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="dash-card">
                <SectionTitle>Gastos por categoria</SectionTitle>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={pizzaCategoria} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                      {pizzaCategoria.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v) => `R$ ${fmt(Number(Array.isArray(v) ? v[0] : v ?? 0))}`} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: "rgba(240,242,245,0.5)" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ── Por pessoa ── */}
            <div className="dash-card dash-card--full">
              <div className="dash-card__head">
                <Users size={16} strokeWidth={2} />
                <SectionTitle>Totais por pessoa</SectionTitle>
              </div>
              <TotalsTable rows={porPessoa} totalRow={{ receita, despesa, saldo }} />
            </div>

            {/* ── Por categoria ── */}
            <div className="dash-card dash-card--full">
              <div className="dash-card__head">
                <Tag size={16} strokeWidth={2} />
                <SectionTitle>Totais por categoria</SectionTitle>
              </div>
              <TotalsTable rows={porCategoria} totalRow={{ receita, despesa, saldo }} />
            </div>

            {/* ── Últimas transações ── */}
            <div className="dash-card dash-card--full">
              <div className="dash-card__head">
                <ArrowLeftRight size={16} strokeWidth={2} />
                <SectionTitle>Últimas transações</SectionTitle>
              </div>
              <div className="dash-table-wrap">
                <table className="dash-table">
                  <thead>
                    <tr><th>Data</th><th>Descrição</th><th>Pessoa</th><th>Categoria</th><th>Tipo</th><th>Valor</th></tr>
                  </thead>
                  <tbody>
                    {ultimas.map(t => (
                      <tr key={t.id}>
                        <td>{new Date(t.data).toLocaleDateString("pt-BR")}</td>
                        <td>{t.descricao}</td>
                        <td>{t.pessoa?.nome ?? "-"}</td>
                        <td>{t.categoria?.descricao ?? "-"}</td>
                        <td>
                          <span className={`dash-badge ${t.tipo === 1 ? "dash-badge--green" : "dash-badge--red"}`}>
                            {t.tipo === 1 ? "Receita" : "Despesa"}
                          </span>
                        </td>
                        <td style={{ color: t.tipo === 1 ? ACCENT : DANGER, fontWeight: 600, fontFamily: "monospace" }}>
                          R$ {fmt(t.valor)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Drawer nova transação ── */}
      <Drawer
        open={drawerOpen}
        title="Nova Transação"
        onClose={() => { setDrawerOpen(false); setFormError(""); }}
        onSave={handleSave}
        saving={saving}
      >
        <label className="drawer__label">Descrição *</label>
        <input className="drawer__input" placeholder="Ex: Mercado" value={form.Descricao}
          onChange={e => setField("Descricao", e.target.value)} />

        <label className="drawer__label">Tipo *</label>
        <div className="drawer__toggle">
          <button className={`drawer__toggle-btn ${form.Tipo === "0" ? "active-red" : ""}`}
            onClick={() => setField("Tipo", "0")}>Despesa</button>
          <button className={`drawer__toggle-btn ${form.Tipo === "1" ? "active-green" : ""}`}
            onClick={() => setField("Tipo", "1")}>Receita</button>
        </div>

        <label className="drawer__label">Valor *</label>
        <input className="drawer__input" type="number" placeholder="0,00" value={form.Valor}
          onChange={e => setField("Valor", e.target.value)} />

        <label className="drawer__label">Data *</label>
        <input className="drawer__input" type="date" value={form.Data}
          onChange={e => setField("Data", e.target.value)} />

        <label className="drawer__label">Pessoa *</label>
        <select className="drawer__input" value={form.PessoaId}
          onChange={e => setField("PessoaId", e.target.value)}>
          <option value="">Selecione...</option>
          {pessoas.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
        </select>

        <label className="drawer__label">Categoria *</label>
        <select className="drawer__input" value={form.CategoriaId}
          onChange={e => setField("CategoriaId", e.target.value)}>
          <option value="">Selecione...</option>
          {categorias.map(c => <option key={c.id} value={c.id}>{c.descricao}</option>)}
        </select>

        {formError && <span className="drawer__error">{formError}</span>}
      </Drawer>
    </>
  );
}