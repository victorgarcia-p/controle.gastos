using controle.gastos.App.DTOs.Pessoas;
using controle.gastos.App.Interfaces.IRepositories;
using controle.gastos.Domain.Entities;
using controle.gastos.Infra.Context;
using Microsoft.EntityFrameworkCore;

namespace controle.gastos.Infra.Repositories;

public class CategoriasRepository(ContextDb bd) : ICategoriasRepository
{
    private readonly ContextDb _bd = bd;

    public async Task<List<Categorias>> GetAll(FiltroCategoriasDTO filtro)
    {
        var query = _bd.Categorias.AsQueryable();

        /*Aplica Filtros para facilitar pesquisa no Front*/
        query = filtro.Id > 0 ? query.Where(x => x.Id == filtro.Id) : query;
        query = !string.IsNullOrEmpty(filtro.Nome) ? query.Where(x => x.Descricao.StartsWith(filtro.Nome)) : query;

        var pessoas = await query.OrderByDescending(x => x.Id).ToListAsync();

        return pessoas;
    }

    public async Task<Categorias> Get(int id)
    {
        var pessoa = await _bd.Categorias.FirstOrDefaultAsync(x => x.Id == id);

        if (pessoa is null)
            throw new ArgumentException("Categoria não encontrada");

        return pessoa;
    }

    public async Task<Categorias> Post(Categorias categoria)
    {
        var insert = _bd.Categorias.AddAsync(categoria);
        await _bd.SaveChangesAsync();

        return insert.Result.Entity;
    }

    public async Task Delete(Categorias categoria)
    {
        _bd.Categorias.Remove(categoria);
    }

    public async Task SaveChanges()
    {
        await _bd.SaveChangesAsync();
    }
}
