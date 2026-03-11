using controle.gastos.App.DTOs.Pessoas;
using controle.gastos.Domain.Entities;

namespace controle.gastos.App.Interfaces.IServices;

public interface IServicePessoas
{
    Task<List<Pessoas>> GetAll(FiltroPessoasDTO filtro);
    Task<Pessoas> Get(int id);
    Task<Pessoas> Post(NovaPessoaDTO pessoaInc);
    Task<Pessoas> Put(AlteraPessoaDTO pessoaAlt);
    Task Delete(int id);
}
