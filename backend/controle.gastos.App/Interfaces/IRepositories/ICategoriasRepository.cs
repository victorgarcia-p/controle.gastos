using controle.gastos.App.DTOs.Pessoas;
using controle.gastos.Domain.Entities;

namespace controle.gastos.App.Interfaces.IRepositories;

public interface ICategoriasRepository
{
    Task<List<Categorias>> GetAll(FiltroCategoriasDTO filtro);

    Task<Categorias> Get(int id);

    Task<Categorias> Post(Categorias categoria);

    Task Delete(Categorias categoria);

    Task SaveChanges();
}
