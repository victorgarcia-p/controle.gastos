import { api } from "./api";
import { Transacao, NovaTransacao, AlteraTransacao, FiltroTransacao } from "../types/transacoes";

export async function getTransacoes(filtro?: FiltroTransacao): Promise<Transacao[]> {
  const response = await api.get("/Transacoes", {
    params: filtro
  });

  return response.data;
}

export async function getTransacao(id: number): Promise<Transacao> {
  const response = await api.get(`/Transacoes/${id}`);
  return response.data;
}

export async function createTransacao(data: NovaTransacao) {
  const response = await api.post("/Transacoes", data);
  return response.data;
}

export async function updateTransacao(data: AlteraTransacao) {
  const response = await api.put("/Transacoes", data);
  return response.data;
}

export async function deleteTransacao(id: number) {
  const response = await api.delete(`/Transacoes/${id}`);
  return response.data;
}