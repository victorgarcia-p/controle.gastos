using controle.gastos.Domain.Enums;

namespace controle.gastos.App.DTOs.Transacoes;

public class NovaTransacaoDTO
{
    public string Descricao { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public Tipo Tipo { get; set; }
    public DateTime Data { get; set; }
    public int PessoaId { get; set; }
    public int CategoriaId { get; set; }
}
