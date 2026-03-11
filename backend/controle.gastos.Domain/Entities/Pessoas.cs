using System.ComponentModel.DataAnnotations;

namespace controle.gastos.Domain.Entities;

public class Pessoas
{
    [Key]
    public int Id { get; set; }

    [Required, StringLength(200)]
    public string Nome { get; set; } = string.Empty;

    [Required]
    public DateTime Nascimento { get; set; }



    public ICollection<Transacoes> Transacoes { get; set; } = new HashSet<Transacoes>();
}
