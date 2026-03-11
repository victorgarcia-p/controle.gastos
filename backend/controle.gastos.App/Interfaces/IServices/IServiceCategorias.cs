using controle.gastos.App.DTOs.Pessoas;
using controle.gastos.Domain.Entities;

namespace controle.gastos.App.Interfaces.IServices;

public interface IServiceCategorias
{
    Task<List<Categorias>> GetAll(FiltroCategoriasDTO filtro);
    Task<Categorias> Get(int id);
    Task<Categorias> Post(NovaCategoriaDTO pessoaInc);
    Task<Categorias> Put(AlteraCategoriaDTO pessoaAlt);
    Task Delete(int id);
}
