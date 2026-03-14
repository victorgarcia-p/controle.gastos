"use client";

import { useEffect, useState, useMemo } from "react";
import { getPessoas, createPessoa, updatePessoa, deletePessoa } from "../../services/pessoas.service";
import { Pessoa, NovaPessoa, AlteraPessoa, FiltroPessoa } from "../../types/pessoas";
import { ActionButton, Drawer } from "../../components/Index";
import { Plus, Search, Pencil, Trash2, Users, X } from "lucide-react";
import "./Pessoas.css";
import "../globals.css";
// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtData = (iso: string) =>
  iso ? new Date(iso).toLocaleDateString("pt-BR") : "—";

const calcIdade = (nascimento: string) => {
  if (!nascimento) return "—";
  const hoje = new Date();
  const nasc = new Date(nascimento);
  let idade  = hoje.getFullYear() - nasc.getFullYear();
  const m    = hoje.getMonth() - nasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
  return `${idade} anos`;
};

// ─── Modal de confirmação de exclusão ─────────────────────────────────────────

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
        <h3 className="modal__title">Excluir pessoa</h3>
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

export default function PessoasPage() {
  const [pessoas, setPessoas]         = useState<Pessoa[]>([]);
  const [loading, setLoading]         = useState(true);
  const [busca, setBusca]             = useState("");
  const [drawerOpen, setDrawerOpen]   = useState(false);
  const [editando, setEditando]       = useState<Pessoa | null>(null);
  const [excluindo, setExcluindo]     = useState<Pessoa | null>(null);
  const [saving, setSaving]           = useState(false);
  const [erro, setErro]               = useState("");

  // Formulário
  const emptyForm = { nome: "", nascimento: "" };
  const [form, setForm] = useState(emptyForm);
  const setField = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  // ── Carregar ──
  function carregar() {
    setLoading(true);
    getPessoas()
      .then(setPessoas)
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  useEffect(() => { carregar(); }, []);

  // ── Filtro local por nome ──
  const pessoasFiltradas = useMemo(() =>
    pessoas.filter(p =>
      !busca || p.nome?.toLowerCase().includes(busca.toLowerCase())
    ), [pessoas, busca]
  );

  // ── Abrir drawer para novo ──
  function abrirNovo() {
    setEditando(null);
    setForm(emptyForm);
    setErro("");
    setDrawerOpen(true);
  }

  // ── Abrir drawer para editar ──
  function abrirEditar(p: Pessoa) {
    setEditando(p);
    setForm({
      nome:       p.nome ?? "",
      nascimento: p.nascimento ? p.nascimento.slice(0, 10) : "",
    });
    setErro("");
    setDrawerOpen(true);
  }

  // ── Salvar (criar ou editar) ──
  async function handleSave() {
    if (!form.nome.trim()) {
      setErro("O nome é obrigatório.");
      return;
    }
    setSaving(true);
    setErro("");
    try {
      if (editando) {
        await updatePessoa({
          id:          editando.id,
          nome:        form.nome,
          nascimento:  form.nascimento ? new Date(form.nascimento).toISOString() : undefined,
        } as AlteraPessoa);
      } else {
        await createPessoa({
          nome:       form.nome,
          nascimento: form.nascimento
            ? new Date(form.nascimento).toISOString()
            : new Date("2000-01-01").toISOString(),
        } as NovaPessoa);
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
      await deletePessoa(excluindo.id);
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
            <h1 className="pag-title">Pessoas</h1>
            <span className="pag-sub">{pessoas.length} cadastradas</span>
          </div>
          <ActionButton label="Nova pessoa" icon={Plus} onClick={abrirNovo} />
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
          ) : pessoasFiltradas.length === 0 ? (
            <div className="pag-empty">
              <Users size={32} strokeWidth={1.5} />
              <span>{busca ? "Nenhuma pessoa encontrada." : "Nenhuma pessoa cadastrada ainda."}</span>
            </div>
          ) : (
            <table className="pag-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nome</th>
                  <th>Nascimento</th>
                  <th>Idade</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {pessoasFiltradas.map((p, i) => (
                  <tr key={p.id} style={{ animationDelay: `${i * 30}ms` }} className="pag-row">
                    <td className="pag-table__id">{p.id}</td>
                    <td className="pag-table__name">
                      <div className="pag-avatar">{p.nome?.charAt(0).toUpperCase()}</div>
                      {p.nome}
                    </td>
                    <td>{fmtData(p.nascimento ?? "")}</td>
                    <td>{calcIdade(p.nascimento ?? "")}</td>
                    <td className="pag-table__actions">
                      <button
                        className="pag-action-btn pag-action-btn--edit"
                        title="Editar"
                        onClick={() => abrirEditar(p)}
                      >
                        <Pencil size={14} strokeWidth={2} />
                      </button>
                      <button
                        className="pag-action-btn pag-action-btn--delete"
                        title="Excluir"
                        onClick={() => setExcluindo(p)}
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
        title={editando ? "Editar pessoa" : "Nova pessoa"}
        onClose={() => setDrawerOpen(false)}
        onSave={handleSave}
        saving={saving}
        saveLabel={editando ? "Salvar alterações" : "Cadastrar"}
      >
        <label className="drawer__label">Nome *</label>
        <input
          className="drawer__input"
          placeholder="Nome completo"
          value={form.nome}
          onChange={e => setField("nome", e.target.value)}
        />

        <label className="drawer__label">Data de nascimento</label>
        <input
          className="drawer__input"
          type="date"
          value={form.nascimento}
          onChange={e => setField("nascimento", e.target.value)}
        />

        {erro && <span className="drawer__error">{erro}</span>}
      </Drawer>

      {/* ── Modal de confirmação de exclusão ── */}
      {excluindo && (
        <ConfirmModal
          nome={excluindo.nome ?? "esta pessoa"}
          onConfirm={handleDelete}
          onCancel={() => setExcluindo(null)}
        />
      )}
    </>
  );
}