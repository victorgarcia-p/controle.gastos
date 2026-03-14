"use client";

import { useEffect, useState, useMemo } from "react";
import { getTransacoes, createTransacao, updateTransacao, deleteTransacao } from "../../services/transacoes.service";
import { getCategorias, createCategoria } from "../../services/categorias.service";
import { getPessoas } from "../../services/pessoas.service";
import { Transacao, FiltroTransacao, NovaTransacao, AlteraTransacao } from "../../types/transacoes";
import { Categoria, NovaCategoria } from "../../types/categorias";
import { Pessoa } from "../../types/pessoas";
import { ActionButton, FilterPanel, Drawer } from "../../components/Index";
import type { FilterField } from "../../components/Index";
import {
  Plus, Trash2, Pencil, ArrowLeftRight, ChevronDown, ChevronUp,
} from "lucide-react";
import "./transacoes.css";
import "../globals.css";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const fmtData = (iso: string) =>
  iso ? new Date(iso).toLocaleDateString("pt-BR") : "—";

function getPeriodoAtual() {
  const now    = new Date();
  const ano    = now.getFullYear();
  const mes    = String(now.getMonth() + 1).padStart(2, "0");
  const ultimo = new Date(ano, now.getMonth() + 1, 0).getDate();
  return { DataInicio: `${ano}-${mes}-01`, DataFim: `${ano}-${mes}-${ultimo}` };
}

// ─── Tipos auxiliares ─────────────────────────────────────────────────────────

type FiltroTemp = FiltroTransacao & { PessoasArr: string[]; CategoriasArr: string[] };

// ─── Modal de confirmação ─────────────────────────────────────────────────────

function ConfirmModal({ descricao, onConfirm, onCancel }: {
  descricao: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <>
      <div className="modal-overlay" onClick={onCancel} />
      <div className="modal">
        <div className="modal__icon"><Trash2 size={22} strokeWidth={2} /></div>
        <h3 className="modal__title">Excluir transação</h3>
        <p className="modal__desc">
          Tem certeza que deseja excluir <strong>{descricao}</strong>?
          Esta ação não pode ser desfeita.
        </p>
        <div className="modal__actions">
          <button className="dash-btn dash-btn--ghost" onClick={onCancel}>Cancelar</button>
          <button className="modal__confirm" onClick={onConfirm}>Sim, excluir</button>
        </div>
      </div>
    </>
  );
}

// ─── Página ───────────────────────────────────────────────────────────────────

export default function TransacoesPage() {
  const [transacoes, setTransacoes]   = useState<Transacao[]>([]);
  const [pessoas, setPessoas]         = useState<Pessoa[]>([]);
  const [categorias, setCategorias]   = useState<Categoria[]>([]);
  const [loading, setLoading]         = useState(true);
  const [filtroOpen, setFiltroOpen]   = useState(false);
  const [drawerOpen, setDrawerOpen]   = useState(false);
  const [editando, setEditando]       = useState<Transacao | null>(null);
  const [excluindo, setExcluindo]     = useState<Transacao | null>(null);
  const [saving, setSaving]           = useState(false);
  const [erro, setErro]               = useState("");

  // ── Formulário transação ──
  const emptyForm = {
    Descricao: "", Valor: "", Tipo: "0",
    Data: new Date().toISOString().slice(0, 10),
    PessoaId: "", CategoriaId: "",
  };
  const [form, setForm] = useState(emptyForm);
  const setField = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  // ── Nova categoria inline ──
  const [catOpen, setCatOpen]       = useState(false);
  const [catForm, setCatForm]       = useState({ descricao: "", tipo: "0" });
  const [catSaving, setCatSaving]   = useState(false);
  const [catErro, setCatErro]       = useState("");

  // ── Filtros ──
  const periodo = getPeriodoAtual();
  const emptyFiltroTemp = (): FiltroTemp => ({
    DataInicio: periodo.DataInicio,
    DataFim: periodo.DataFim,
    PessoasArr: [],
    CategoriasArr: [],
  });
  const [filtro, setFiltro]         = useState<FiltroTransacao>({ DataInicio: periodo.DataInicio, DataFim: periodo.DataFim });
  const [filtroTemp, setFiltroTemp] = useState<FiltroTemp>(emptyFiltroTemp());

  // ── Carregar ──
  function buscar(f: FiltroTransacao) {
    setLoading(true);
    getTransacoes(f)
      .then(setTransacoes)
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  function carregarCategorias() {
    getCategorias().then(setCategorias).catch(console.error);
  }

  useEffect(() => {
    buscar(filtro);
    getPessoas().then(setPessoas).catch(console.error);
    carregarCategorias();
  }, []);

  const carregar = () => buscar(filtro);

  // ── Filtro ──
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

  // ── Abrir drawer novo ──
  function abrirNovo() {
    setEditando(null);
    setForm(emptyForm);
    setErro("");
    setCatOpen(false);
    setCatForm({ descricao: "", tipo: "0" });
    setDrawerOpen(true);
  }

  // ── Abrir drawer editar ──
  function abrirEditar(t: Transacao) {
    setEditando(t);
    setForm({
      Descricao:   t.descricao,
      Valor:       String(t.valor),
      Tipo:        String(t.tipo),
      Data:        t.data.slice(0, 10),
      PessoaId:    String(t.pessoaId),
      CategoriaId: String(t.categoriaId),
    });
    setErro("");
    setCatOpen(false);
    setCatForm({ descricao: "", tipo: "0" });
    setDrawerOpen(true);
  }

  // ── Salvar transação ──
  async function handleSave() {
    if (!form.Descricao || !form.Valor || !form.PessoaId || !form.CategoriaId) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }
    setSaving(true);
    setErro("");
    try {
      if (editando) {
        await updateTransacao({
          Id:          editando.id,
          Descricao:   form.Descricao,
          Valor:       parseFloat(form.Valor),
          Tipo:        form.Tipo,
          Data:        new Date(form.Data).toISOString(),
          PessoaId:    parseInt(form.PessoaId),
          CategoriaId: parseInt(form.CategoriaId),
        } as AlteraTransacao);
      } else {
        await createTransacao({
          Descricao:   form.Descricao,
          Valor:       parseFloat(form.Valor),
          Tipo:        form.Tipo,
          Data:        new Date(form.Data).toISOString(),
          PessoaId:    parseInt(form.PessoaId),
          CategoriaId: parseInt(form.CategoriaId),
        } as NovaTransacao);
      }
      setDrawerOpen(false);
      carregar();
    } catch {
      setErro("Erro ao salvar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  // ── Salvar nova categoria inline ──
  async function handleSaveCategoria() {
    if (!catForm.descricao.trim()) {
      setCatErro("Informe o nome da categoria.");
      return;
    }
    setCatSaving(true);
    setCatErro("");
    try {
      const nova = await createCategoria({
        Descricao: catForm.descricao,
        Tipo:      catForm.tipo,
      } as NovaCategoria);
      await carregarCategorias();
      // Seleciona automaticamente a categoria recém criada
      if (nova?.id) setField("CategoriaId", String(nova.id));
      setCatOpen(false);
      setCatForm({ descricao: "", tipo: "0" });
    } catch {
      setCatErro("Erro ao criar categoria.");
    } finally {
      setCatSaving(false);
    }
  }

  // ── Excluir ──
  async function handleDelete() {
    if (!excluindo?.id) return;
    try {
      await deleteTransacao(excluindo.id);
      setExcluindo(null);
      carregar();
    } catch {
      setExcluindo(null);
    }
  }

  // ── Contadores para o header ──
  const receita = useMemo(() => transacoes.filter(t => t.tipo === 1).reduce((a, t) => a + t.valor, 0), [transacoes]);
  const despesa = useMemo(() => transacoes.filter(t => t.tipo === 0).reduce((a, t) => a + t.valor, 0), [transacoes]);

  const filtrosAtivos = Object.entries(filtro).filter(([k, v]) =>
    v && k !== "DataInicio" && k !== "DataFim"
  ).length;

  const mesAtual = (() => {
    if (filtro.DataInicio) {
      return new Date(filtro.DataInicio + "T12:00:00")
        .toLocaleString("pt-BR", { month: "long", year: "numeric" });
    }
    return new Date().toLocaleString("pt-BR", { month: "long", year: "numeric" });
  })();

  // ── Campos do filtro ──
  const filterFields: FilterField[] = [
    { key: "DataInicio",    label: "Data início",  type: "date" },
    { key: "DataFim",       label: "Data fim",     type: "date" },
    { key: "PessoasArr",    label: "Pessoas",      type: "multiselect", placeholder: "Selecione...",
      options: pessoas.map(p => ({ value: String(p.id), label: p.nome ?? "" })) },
    { key: "CategoriasArr", label: "Categorias",   type: "multiselect", placeholder: "Selecione...",
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
      <div className="pag">

        {/* ── Header ── */}
        <div className="pag-header">
          <div>
            <h1 className="pag-title">Transações</h1>
            <span className="pag-sub">{mesAtual}</span>
          </div>
          <div className="trn-header-actions">
            <div className="trn-summary">
              <span className="trn-summary__item trn-summary__item--green">
                ↑ R$ {fmt(receita)}
              </span>
              <span className="trn-summary__sep">·</span>
              <span className="trn-summary__item trn-summary__item--red">
                ↓ R$ {fmt(despesa)}
              </span>
            </div>
            <ActionButton
              label="Filtros"
              icon={require("lucide-react").SlidersHorizontal}
              variant="ghost"
              badge={filtrosAtivos}
              onClick={() => { setFiltroTemp({ ...filtro, PessoasArr: filtroTemp.PessoasArr, CategoriasArr: filtroTemp.CategoriasArr }); setFiltroOpen(o => !o); }}
            />
            <ActionButton label="Nova transação" icon={Plus} onClick={abrirNovo} />
          </div>
        </div>

        {/* ── Filtros ── */}
        <FilterPanel
          open={filtroOpen}
          fields={filterFields}
          values={filtroTemp}
          onChange={(key, value) => setFiltroTemp(f => ({ ...f, [key]: value }))}
          onApply={aplicarFiltro}
          onClear={limparFiltro}
        />

        {/* ── Tabela ── */}
        <div className="pag-card">
          {loading ? (
            <div className="pag-loading">
              <div className="pag-loading__spinner" />
              <span>Carregando...</span>
            </div>
          ) : transacoes.length === 0 ? (
            <div className="pag-empty">
              <ArrowLeftRight size={32} strokeWidth={1.5} />
              <span>Nenhuma transação encontrada.</span>
            </div>
          ) : (
            <table className="pag-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Data</th>
                  <th>Descrição</th>
                  <th>Pessoa</th>
                  <th>Categoria</th>
                  <th>Tipo</th>
                  <th>Valor</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {transacoes.map((t, i) => (
                  <tr key={t.id} className="pag-row" style={{ animationDelay: `${i * 20}ms` }}>
                    <td className="pag-table__id">{t.id}</td>
                    <td>{fmtData(t.data)}</td>
                    <td className="trn-table__desc">{t.descricao}</td>
                    <td>
                      <div className="trn-person">
                        <span className="pag-avatar">{t.pessoa?.nome?.charAt(0).toUpperCase()}</span>
                        {t.pessoa?.nome ?? "—"}
                      </div>
                    </td>
                    <td>
                      <span className="trn-cat-badge">{t.categoria?.descricao ?? "—"}</span>
                    </td>
                    <td>
                      <span className={`dash-badge ${t.tipo === 1 ? "dash-badge--green" : "dash-badge--red"}`}>
                        {t.tipo === 1 ? "Receita" : "Despesa"}
                      </span>
                    </td>
                    <td className={`trn-valor ${t.tipo === 1 ? "trn-valor--green" : "trn-valor--red"}`}>
                      {t.tipo === 1 ? "+" : "-"} R$ {fmt(t.valor)}
                    </td>
                    <td className="pag-table__actions">
                      <button className="pag-action-btn pag-action-btn--edit" title="Editar" onClick={() => abrirEditar(t)}>
                        <Pencil size={14} strokeWidth={2} />
                      </button>
                      <button className="pag-action-btn pag-action-btn--delete" title="Excluir" onClick={() => setExcluindo(t)}>
                        <Trash2 size={14} strokeWidth={2} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>

      {/* ── Drawer cadastro / edição ── */}
      <Drawer
        open={drawerOpen}
        title={editando ? "Editar transação" : "Nova transação"}
        onClose={() => { setDrawerOpen(false); setCatOpen(false); }}
        onSave={handleSave}
        saving={saving}
        saveLabel={editando ? "Salvar alterações" : "Cadastrar"}
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

        {/* ── Categoria com criação inline ── */}
        <label className="drawer__label">Categoria *</label>
        <select className="drawer__input" value={form.CategoriaId}
          onChange={e => setField("CategoriaId", e.target.value)}>
          <option value="">Selecione...</option>
          {categorias.map(c => <option key={c.id} value={c.id}>{c.descricao}</option>)}
        </select>

        {/* Toggle para nova categoria */}
        <button
          className="trn-cat-toggle"
          onClick={() => { setCatOpen(o => !o); setCatErro(""); }}
        >
          {catOpen ? <ChevronUp size={13} strokeWidth={2} /> : <ChevronDown size={13} strokeWidth={2} />}
          {catOpen ? "Cancelar nova categoria" : "+ Nova categoria"}
        </button>

        {/* Formulário inline de nova categoria */}
        {catOpen && (
          <div className="trn-cat-form">
            <div className="trn-cat-form__row">
              <div className="trn-cat-form__field">
                <label className="drawer__label">Nome da categoria *</label>
                <input
                  className="drawer__input"
                  placeholder="Ex: Alimentação"
                  value={catForm.descricao}
                  onChange={e => setCatForm(f => ({ ...f, descricao: e.target.value }))}
                />
              </div>
              <div className="trn-cat-form__field trn-cat-form__field--sm">
                <label className="drawer__label">Tipo</label>
                <select
                  className="drawer__input"
                  value={catForm.tipo}
                  onChange={e => setCatForm(f => ({ ...f, tipo: e.target.value }))}
                >
                  <option value="0">Despesa</option>
                  <option value="1">Receita</option>
                  <option value="2">Ambas</option>
                </select>
              </div>
            </div>
            {catErro && <span className="drawer__error">{catErro}</span>}
            <button
              className="trn-cat-form__save"
              onClick={handleSaveCategoria}
              disabled={catSaving}
            >
              {catSaving ? "Salvando..." : "Criar categoria"}
            </button>
          </div>
        )}

        {erro && <span className="drawer__error">{erro}</span>}
      </Drawer>

      {/* ── Modal de confirmação ── */}
      {excluindo && (
        <ConfirmModal
          descricao={excluindo.descricao}
          onConfirm={handleDelete}
          onCancel={() => setExcluindo(null)}
        />
      )}
    </>
  );
}