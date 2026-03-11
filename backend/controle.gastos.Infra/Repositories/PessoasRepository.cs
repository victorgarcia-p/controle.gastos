using controle.gastos.App.DTOs.Pessoas;
using controle.gastos.App.Interfaces.IRepositories;
using controle.gastos.Domain.Entities;
using controle.gastos.Infra.Context;
using Microsoft.EntityFrameworkCore;

namespace controle.gastos.Infra.Repositories;

public class PessoasRepository(ContextDb bd) : IPessoasRepository
{
    private readonly ContextDb _bd = bd;

    public async Task<List<Pessoas>> GetAll(FiltroPessoasDTO filtro)
    {
        var query = _bd.Pessoas.AsQueryable();

        query = filtro.Id > 0 ? query.Where(x => x.Id == filtro.Id) : query;
        query = !string.IsNullOrEmpty(filtro.Nome) ? query.Where(x => x.Nome.StartsWith(filtro.Nome)) : query;

        var pessoas = await query.OrderByDescending(x => x.Id).ToListAsync();

        return pessoas;
    }

    public async Task<Pessoas> Get(int id)
    {
        var pessoa = await _bd.Pessoas.FirstOrDefaultAsync(x => x.Id == id);

        if (pessoa is null)
            throw new ArgumentException("Nenhuma pessoa encontrada");

        return pessoa;
    }

    public async Task<Pessoas> Post(Pessoas pessoa)
    {
        var insert = _bd.Pessoas.AddAsync(pessoa);
        await _bd.SaveChangesAsync();

        return insert.Result.Entity;
    }

    public async Task Delete(Pessoas pessoa)
    {
        _bd.Pessoas.Remove(pessoa);
    }

    public async Task SaveChanges()
    {
        await _bd.SaveChangesAsync();
    }
}
