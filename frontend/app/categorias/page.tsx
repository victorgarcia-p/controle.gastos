"use client";

import { useEffect, useState, useMemo } from "react";
import { getCategorias, createCategoria, updateCategoria, deleteCategoria } from "../../services/categorias.service";
import { Categoria, NovaCategoria, AlteraCategoria } from "../../types/categorias";
import { ActionButton, Drawer } from "../../components/Index";
import { Plus, Search, Pencil, Trash2, Tag, X } from "lucide-react";
import "../globals.css";
import "./categorias.css";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TIPO_LABEL: Record<string, string> = {
  "0": "Despesa",
  "1": "Receita",
  "2": "Ambas",
};

const TIPO_CLASS: Record<string, string> = {
  "0": "cat-tipo--red",
  "1": "cat-tipo--green",
  "2": "cat-tipo--blue",
};

// ─── Modal de confirmação ─────────────────────────────────────────────────────

function ConfirmModal({ nome, onConfirm, onCancel }: {
  nome: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <>
      <div className="modal-overlay" onClick={onCancel} />
      <div className="modal">
        <div className="modal__icon"><Trash2 size={22} strokeWidth={2} /></div>
        <h3 className="modal__title">Excluir categoria</h3>
        <p className="modal__desc">
          Tem certeza que deseja excluir <strong>{nome}</strong>?
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

export default function CategoriasPage() {
  const [categorias, setCategorias]   = useState<Categoria[]>([]);
  const [loading, setLoading]         = useState(true);
  const [busca, setBusca]             = useState("");
  const [drawerOpen, setDrawerOpen]   = useState(false);
  const [editando, setEditando]       = useState<Categoria | null>(null);
  const [excluindo, setExcluindo]     = useState<Categoria | null>(null);
  const [saving, setSaving]           = useState(false);
  const [erro, setErro]               = useState("");

  // Formulário
  const emptyForm = { descricao: "", tipo: "0" };
  const [form, setForm] = useState(emptyForm);
  const setField = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  // ── Carregar ──
  function carregar() {
    setLoading(true);
    getCategorias()
      .then(setCategorias)
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  useEffect(() => { carregar(); }, []);

  // ── Filtro local por nome ──
  const categoriasFiltradas = useMemo(() =>
    categorias.filter(c =>
      !busca || c.descricao?.toLowerCase().includes(busca.toLowerCase())
    ), [categorias, busca]
  );

  // ── Contar por tipo ──
  const counts = useMemo(() => ({
    despesa: categorias.filter(c => String(c.tipo) === "0").length,
    receita: categorias.filter(c => String(c.tipo) === "1").length,
    ambas:   categorias.filter(c => String(c.tipo) === "2").length,
  }), [categorias]);

  // ── Abrir drawer para novo ──
  function abrirNovo() {
    setEditando(null);
    setForm(emptyForm);
    setErro("");
    setDrawerOpen(true);
  }

  // ── Abrir drawer para editar ──
  function abrirEditar(c: Categoria) {
    setEditando(c);
    setForm({
      descricao: c.descricao ?? "",
      tipo:      String(c.tipo ?? "0"),
    });
    setErro("");
    setDrawerOpen(true);
  }

  // ── Salvar ──
  async function handleSave() {
    if (!form.descricao.trim()) {
      setErro("O nome da categoria é obrigatório.");
      return;
    }
    setSaving(true);
    setErro("");
    try {
      if (editando) {
        await updateCategoria({
          Id:       editando.id,
          Descricao: form.descricao,
          Tipo:     form.tipo,
        } as AlteraCategoria);
      } else {
        await createCategoria({
          Descricao: form.descricao,
          Tipo:      form.tipo,
        } as NovaCategoria);
      }
      setDrawerOpen(false);
      carregar();
    } catch {
      setErro("Erro ao salvar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  // ── Excluir ──
  async function handleDelete() {
    if (!excluindo?.id) return;
    try {
      await deleteCategoria(excluindo.id);
      setExcluindo(null);
      carregar();
    } catch {
      setExcluindo(null);
    }
  }

  return (
    <>
      <div className="pag">

        {/* ── Header ── */}
        <div className="pag-header">
          <div>
            <h1 className="pag-title">Categorias</h1>
            <span className="pag-sub">{categorias.length} cadastradas</span>
          </div>
          <ActionButton label="Nova categoria" icon={Plus} onClick={abrirNovo} />
        </div>

        {/* ── Contadores por tipo ── */}
        <div className="cat-counters">
          <div className="cat-counter cat-counter--red">
            <span className="cat-counter__num">{counts.despesa}</span>
            <span className="cat-counter__label">Despesa</span>
          </div>
          <div className="cat-counter cat-counter--green">
            <span className="cat-counter__num">{counts.receita}</span>
            <span className="cat-counter__label">Receita</span>
          </div>
          <div className="cat-counter cat-counter--blue">
            <span className="cat-counter__num">{counts.ambas}</span>
            <span className="cat-counter__label">Ambas</span>
          </div>
        </div>

        {/* ── Busca ── */}
        <div className="pag-search">
          <Search size={15} strokeWidth={2} className="pag-search__icon" />
          <input
            className="pag-search__input"
            placeholder="Buscar por nome..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
          {busca && (
            <button className="pag-search__clear" onClick={() => setBusca("")}>
              <X size={14} strokeWidth={2} />
            </button>
          )}
        </div>

        {/* ── Tabela ── */}
        <div className="pag-card">
          {loading ? (
            <div className="pag-loading">
              <div className="pag-loading__spinner" />
              <span>Carregando...</span>
            </div>
          ) : categoriasFiltradas.length === 0 ? (
            <div className="pag-empty">
              <Tag size={32} strokeWidth={1.5} />
              <span>{busca ? "Nenhuma categoria encontrada." : "Nenhuma categoria cadastrada ainda."}</span>
            </div>
          ) : (
            <table className="pag-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nome</th>
                  <th>Tipo</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {categoriasFiltradas.map((c, i) => (
                  <tr key={c.id} className="pag-row" style={{ animationDelay: `${i * 30}ms` }}>
                    <td className="pag-table__id">{c.id}</td>
                    <td className="pag-table__name">
                      <div className="cat-icon">
                        <Tag size={13} strokeWidth={2} />
                      </div>
                      {c.descricao}
                    </td>
                    <td>
                      <span className={`cat-tipo ${TIPO_CLASS[String(c.tipo)] ?? ""}`}>
                        {TIPO_LABEL[String(c.tipo)] ?? "—"}
                      </span>
                    </td>
                    <td className="pag-table__actions">
                      <button
                        className="pag-action-btn pag-action-btn--edit"
                        title="Editar"
                        onClick={() => abrirEditar(c)}
                      >
                        <Pencil size={14} strokeWidth={2} />
                      </button>
                      <button
                        className="pag-action-btn pag-action-btn--delete"
                        title="Excluir"
                        onClick={() => setExcluindo(c)}
                      >
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
        title={editando ? "Editar categoria" : "Nova categoria"}
        onClose={() => setDrawerOpen(false)}
        onSave={handleSave}
        saving={saving}
        saveLabel={editando ? "Salvar alterações" : "Cadastrar"}
      >
        <label className="drawer__label">Nome *</label>
        <input
          className="drawer__input"
          placeholder="Ex: Alimentação"
          value={form.descricao}
          onChange={e => setField("descricao", e.target.value)}
        />

        <label className="drawer__label">Tipo *</label>
        <div className="drawer__toggle">
          <button
            className={`drawer__toggle-btn ${form.tipo === "0" ? "active-red" : ""}`}
            onClick={() => setField("tipo", "0")}
          >
            Despesa
          </button>
          <button
            className={`drawer__toggle-btn ${form.tipo === "1" ? "active-green" : ""}`}
            onClick={() => setField("tipo", "1")}
          >
            Receita
          </button>
          <button
            className={`drawer__toggle-btn ${form.tipo === "2" ? "active-blue" : ""}`}
            onClick={() => setField("tipo", "2")}
          >
            Ambas
          </button>
        </div>

        {erro && <span className="drawer__error">{erro}</span>}
      </Drawer>

      {/* ── Modal de confirmação ── */}
      {excluindo && (
        <ConfirmModal
          nome={excluindo.descricao ?? "esta categoria"}
          onConfirm={handleDelete}
          onCancel={() => setExcluindo(null)}
        />
      )}
    </>
  );
}