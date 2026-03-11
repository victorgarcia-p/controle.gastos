using controle.gastos.Domain.Enums;

namespace controle.gastos.App.DTOs.Pessoas;

public class AlteraCategoriaDTO
{
    public int Id { get; set; }
    public string? Descricao { get; set; }
    public Tipo? Tipo { get; set; }
}
