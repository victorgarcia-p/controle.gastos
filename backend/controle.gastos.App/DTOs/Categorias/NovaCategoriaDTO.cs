using System.ComponentModel.DataAnnotations;

namespace controle.gastos.App.DTOs.Pessoas;

public class NovaCategoriaDTO
{
    public string Descricao { get; set; } = string.Empty;

    [RegularExpression("^(Despesa|Receita|Ambas)$", ErrorMessage = "O campo TIPO deve ser (Despesa | Receita | Ambas).")]
    public string Tipo { get; set; } = "Despesa";

}
