using controle.gastos.App.DTOs.Transacoes;
using controle.gastos.App.Interfaces.IRepositories;
using controle.gastos.Domain.Entities;
using controle.gastos.Infra.Context;
using Microsoft.EntityFrameworkCore;

namespace controle.gastos.Infra.Repositories;

public class TransacoesRepository(ContextDb bd) : ITransacoesRepository
{
    private readonly ContextDb _bd = bd;

    public async Task<List<Transacoes>> GetAll(FiltroTransacoesDTO filtro)
    {
        var query = _bd.Transacoes.Include(x => x.Pessoa).Include(x => x.Categoria).AsQueryable();

        query = filtro.Id > 0 ? query.Where(x => x.Id == filtro.Id) : query;
        query = !string.IsNullOrEmpty(filtro.Descricao) ? query.Where(x => x.Descricao.StartsWith(filtro.Descricao)) : query;
        query = filtro.ValorInicial.HasValue ? query.Where(x => x.Valor >= filtro.ValorInicial) : query;
        query = filtro.ValorFinal.HasValue ? query.Where(x => x.Valor <= filtro.ValorFinal) : query;
        query = filtro.Tipo.HasValue ? query.Where(x => x.Tipo == filtro.Tipo) : query;
        query = filtro.DataInicio.HasValue ? query.Where(x => x.Data >= filtro.DataInicio) : query;
        query = filtro.DataFim.HasValue ? query.Where(x => x.Data <= filtro.DataFim) : query;

        query = !string.IsNullOrEmpty(filtro.Pessoas) ? query.Where(x => filtro.Pessoas.Split(',').Contains(x.PessoaId.ToString())) : query;

        query = !string.IsNullOrEmpty(filtro.Categorias) ? query.Where(x => filtro.Categorias.Split(',').Contains(x.CategoriaId.ToString())) : query;


        var transacao = await query.OrderByDescending(x => x.Data).ToListAsync();

        return transacao;
    }

    public async Task<Transacoes> Get(int id)
    {
        var pessoa = await _bd.Transacoes.Include(x => x.Pessoa).Include(x => x.Categoria).FirstOrDefaultAsync(x => x.Id == id);

        if (pessoa is null)
            throw new ArgumentException("Transação não encontrada");

        return pessoa;
    }

    public async Task<Transacoes> Post(Transacoes transacao)
    {
        var insert = _bd.Transacoes.AddAsync(transacao);
        await _bd.SaveChangesAsync();

        return insert.Result.Entity;
    }

    public async Task Delete(Transacoes transacao)
    {
        _bd.Transacoes.Remove(transacao);
    }

    public async Task SaveChanges()
    {
        await _bd.SaveChangesAsync();
    }
}
