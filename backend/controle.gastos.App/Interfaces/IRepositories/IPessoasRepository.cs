using controle.gastos.App.DTOs.Pessoas;
using controle.gastos.Domain.Entities;

namespace controle.gastos.App.Interfaces.IRepositories;

public interface IPessoasRepository
{
    Task<List<Pessoas>> GetAll(FiltroPessoasDTO filtro);

    Task<Pessoas> Get(int id);

    Task<Pessoas> Post(Pessoas categoria);

    Task Delete(Pessoas categoria);

    Task SaveChanges();
}
