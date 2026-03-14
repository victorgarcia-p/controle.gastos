import { api } from "./api";
import { Pessoa, NovaPessoa, AlteraPessoa, FiltroPessoa } from "../types/pessoas";

export async function getPessoas(filtro?: FiltroPessoa): Promise<Pessoa[]> {
  const response = await api.get("/Pessoas", {
    params: filtro
  });

  return response.data;
}

export async function getPessoa(id: number): Promise<Pessoa> {
  const response = await api.get(`/Pessoas/${id}`);
  return response.data;
}

export async function createPessoa(data: NovaPessoa) {
  const response = await api.post("/Pessoas", data);
  return response.data;
}

export async function updatePessoa(data: AlteraPessoa) {
  const response = await api.put("/Pessoas", data);
  return response.data;
}

export async function deletePessoa(id: number) {
  const response = await api.delete(`/Pessoas/${id}`);
  return response.data;
}