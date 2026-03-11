using controle.gastos.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace controle.gastos.Domain.Entities;

public class Categorias
{
    [Key]
    public int Id { get; set; }

    [Required, StringLength(400)]
    public string Descricao { get; set; } = string.Empty;

    [Required]
    public Tipo Tipo { get; set; }



    public ICollection<Transacoes> Transacoes { get; set; } = new HashSet<Transacoes>();
}
