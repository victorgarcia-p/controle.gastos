import { Categoria } from "./categorias"
import { Pessoa } from "./pessoas"

export interface Transacao {
    id: number
    descricao: string
    valor: number
    tipo: 0|1  // 0 = Despesa, 1 = Receita
    data: string
    pessoaId: number
    categoriaId: number
    pessoa?: Pessoa
    categoria?: Categoria
}

export interface FiltroTransacao {
    Id?: number
    Descricao?: string
    ValorInicial?: number
    ValorFinal?: number
    Tipo?: 0|1
    DataInicio?: string
    DataFim?: string
    Pessoas?: string
    Categorias?: string
}

export interface NovaTransacao {
    Descricao: string
    Valor: number
    Tipo: string
    Data: string
    PessoaId: number
    CategoriaId: number
}

export interface AlteraTransacao {
    Id: number
    Descricao?: string
    Valor?: number
    Tipo?: string
    Data?: string
    PessoaId?: number
    CategoriaId?: number
}

