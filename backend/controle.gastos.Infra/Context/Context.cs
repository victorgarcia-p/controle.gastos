using controle.gastos.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace controle.gastos.Infra.Context;

public class Context : DbContext
{
    public Context(DbContextOptions<Context> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(Context).Assembly);
    }

    public DbSet<Categorias> Categorias => Set<Categorias>();
    public DbSet<Pessoas> Pessoas => Set<Pessoas>();
    public DbSet<Transacoes> Transacoes => Set<Transacoes>();
}
