using controle.gastos.App.DTOs.Pessoas;
using controle.gastos.App.DTOs.Transacoes;
using controle.gastos.Domain.Entities;

namespace controle.gastos.App.Interfaces.IServices;

public interface IServiceTransacoes
{
    Task<List<Transacoes>> GetAll(FiltroTransacoesDTO filtro);
    Task<Transacoes> Get(int id);
    Task<Transacoes> Post(NovaTransacaoDTO pessoaInc);
    Task<Transacoes> Put(AlteraTransacaoDTO pessoaAlt);
    Task Delete(int id);
}
