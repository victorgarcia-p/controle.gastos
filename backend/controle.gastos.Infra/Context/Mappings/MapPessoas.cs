using controle.gastos.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace controle.gastos.Infra.Context.Mappings;

public class MapPessoas : IEntityTypeConfiguration<Pessoas>
{
    public void Configure(EntityTypeBuilder<Pessoas> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Nome).IsRequired().HasMaxLength(200);
        builder.Property(x => x.Nascimento).IsRequired();

        builder
            .HasMany(x => x.Transacoes)
            .WithOne(x => x.Pessoa)
            .HasForeignKey(x => x.PessoaId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
