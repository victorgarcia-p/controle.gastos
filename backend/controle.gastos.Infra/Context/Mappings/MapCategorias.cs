using controle.gastos.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace controle.gastos.Infra.Context.Mappings;

public class MapCategorias : IEntityTypeConfiguration<Categorias>
{
    public void Configure(EntityTypeBuilder<Categorias> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Descricao).IsRequired().HasMaxLength(400);
        builder.Property(x => x.Tipo).IsRequired();

        builder
            .HasMany(x => x.Transacoes)
            .WithOne(x => x.Categoria)
            .HasForeignKey(x => x.CategoriaId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
