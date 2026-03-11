using controle.gastos.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace controle.gastos.App.DTOs.Transacoes;

public class AlteraTransacaoDTO
{
    public int Id { get; set; }
    public string? Descricao { get; set; }
    public decimal? Valor { get; set; }
    public Tipo? Tipo { get; set; }
    public DateTime? Data { get; set; }
    public int? PessoaId { get; set; }
    public int? CategoriaId { get; set; }
}
