using controle.gastos.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace controle.gastos.Infra.Context;

public class ContextDb : DbContext
{
    public ContextDb(DbContextOptions<ContextDb> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ContextDb).Assembly);
    }

    public DbSet<Categorias> Categorias => Set<Categorias>();
    public DbSet<Pessoas> Pessoas => Set<Pessoas>();
    public DbSet<Transacoes> Transacoes => Set<Transacoes>();
}
