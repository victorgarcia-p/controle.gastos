using controle.gastos.App.DTOs.Pessoas;
using controle.gastos.App.DTOs.Transacoes;
using controle.gastos.Domain.Entities;

namespace controle.gastos.App.Interfaces.IRepositories;

public interface ITransacoesRepository
{
    Task<List<Transacoes>> GetAll(FiltroTransacoesDTO filtro);

    Task<Transacoes> Get(int id);

    Task<Transacoes> Post(Transacoes transacao);

    Task Delete(Transacoes transacao);

    Task SaveChanges();
}
