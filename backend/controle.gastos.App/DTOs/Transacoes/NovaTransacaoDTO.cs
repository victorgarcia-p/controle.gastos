using System.ComponentModel.DataAnnotations;

namespace controle.gastos.App.DTOs.Transacoes;

public class NovaTransacaoDTO
{
    public string Descricao { get; set; } = string.Empty;
    public decimal Valor { get; set; }

    [RegularExpression("^(Despesa|Receita)$", ErrorMessage = "O campo TIPO deve ser (Despesa | Receita).")]
    public string Tipo { get; set; } = "Despesa";

    public DateTime Data { get; set; }
    public int PessoaId { get; set; }
    public int CategoriaId { get; set; }
}
