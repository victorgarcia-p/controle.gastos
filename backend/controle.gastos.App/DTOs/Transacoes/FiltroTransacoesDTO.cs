using controle.gastos.Domain.Enums;

namespace controle.gastos.App.DTOs.Transacoes;

public class FiltroTransacoesDTO
{
    public int Id { get; set; }

    public string? Descricao { get; set; }

    public decimal? ValorInicial { get; set; }

    public decimal? ValorFinal { get; set; }

    public Tipo? Tipo { get; set; }

    public DateTime? DataInicio { get; set; }

    public DateTime? DataFim { get; set; }

    public string? Pessoas { get; set; }

    public string? Categorias { get; set; }

}
