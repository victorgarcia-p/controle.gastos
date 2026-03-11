using controle.gastos.Domain.Enums;

namespace controle.gastos.App.DTOs.Pessoas;

public class NovaCategoriaDTO
{
    public string Descricao { get; set; } = string.Empty;
    public Tipo Tipo { get; set; }
}
