using System.ComponentModel.DataAnnotations;

namespace controle.gastos.App.DTOs.Pessoas;

public class AlteraCategoriaDTO
{
    public int Id { get; set; }
    public string? Descricao { get; set; }

    [RegularExpression("^(Despesa|Receita|Ambas)$", ErrorMessage = "O campo TIPO deve ser (Despesa | Receita | Ambas).")]
    public string? Tipo { get; set; }
}
