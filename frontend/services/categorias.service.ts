import { api } from "./api";
import { Categoria, NovaCategoria, AlteraCategoria, FiltroCategoria } from "../types/categorias";

export async function getCategorias(filtro?: FiltroCategoria): Promise<Categoria[]> {
  const response = await api.get("/Categorias", {
    params: filtro
  });

  return response.data;
}

export async function getCategoria(id: number): Promise<Categoria> {
  const response = await api.get(`/Categorias/${id}`);
  return response.data;
}

export async function createCategoria(data: NovaCategoria) {
  const response = await api.post("/Categorias", data);
  return response.data;
}

export async function updateCategoria(data: AlteraCategoria) {
  const response = await api.put("/Categorias", data);
  return response.data;
}

export async function deleteCategoria(id: number) {
  const response = await api.delete(`/Categorias/${id}`);
  return response.data;
}