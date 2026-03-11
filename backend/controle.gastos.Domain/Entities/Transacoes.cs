using controle.gastos.Domain.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace controle.gastos.Domain.Entities;

public class Transacoes
{
    [Key]
    public int Id { get; set; }

    [Required, StringLength(400)]
    public string Descricao { get; set; } = string.Empty;

    [Required]
    public decimal Valor { get; set; }

    [Required]
    public Tipo Tipo { get; set; }

    [Required]
    public DateTime Data { get; set; }

    [Required]
    public int PessoaId { get; set; }

    [Required]
    public int CategoriaId { get; set; }



    [ForeignKey(nameof(PessoaId))]
    public Pessoas Pessoa { get; set; } = null!;

    [ForeignKey(nameof(CategoriaId))]
    public Categorias Categoria { get; set; } = null!;
}
