export interface Categoria{
    id?: number
    descricao?: string
    tipo?: string
}

export interface FiltroCategoria{
    Id?: number
    Descricao?: string
    Tipo?: string
}

export interface NovaCategoria{
    Descricao: string
    Tipo: string
}

export interface AlteraCategoria{
    Id: number
    Descricao?: string
    Tipo?: string
}

