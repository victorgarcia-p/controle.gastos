using controle.gastos.Domain.Entities;
using controle.gastos.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace controle.gastos.Infra.Context.Mappings;

public class MapTransacoes: IEntityTypeConfiguration<Transacoes>
{
    public void Configure(EntityTypeBuilder<Transacoes> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Descricao).IsRequired().HasMaxLength(400);
        builder.Property(x => x.Valor).IsRequired();
        builder.Property(x => x.Tipo).IsRequired();
        builder.Property(x => x.Data).IsRequired();
        builder.Property(x => x.PessoaId).IsRequired();
        builder.Property(x => x.CategoriaId).IsRequired();

        builder
            .HasOne(x => x.Pessoa)
            .WithMany(x => x.Transacoes)
            .HasForeignKey(x => x.PessoaId)
            .OnDelete(DeleteBehavior.Restrict);

        builder
            .HasOne(x => x.Categoria)
            .WithMany(x => x.Transacoes)
            .HasForeignKey(x => x.CategoriaId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
