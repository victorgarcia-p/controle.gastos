using controle.gastos.App.DTOs.Pessoas;
using controle.gastos.App.Interfaces.IRepositories;
using controle.gastos.App.Interfaces.IServices;
using controle.gastos.Domain.Entities;

namespace controle.gastos.App.Services;

public class ServiceCategorias(ICategoriasRepository categoriasRepository) : IServiceCategorias
{
    private readonly ICategoriasRepository _categoriasRepository = categoriasRepository;

    public async Task<List<Categorias>> GetAll(FiltroCategoriasDTO filtro)
    {
        var categorias = await _categoriasRepository.GetAll(filtro);
        return categorias;
    }

    public async Task<Categorias> Get(int id)
    {
        var pessoa = await _categoriasRepository.Get(id);
        return pessoa;
    }

    public async Task<Categorias> Post(NovaCategoriaDTO categoriaInc)
    {
        var categoria = new Categorias
        {
            Descricao = categoriaInc.Descricao,
            Tipo = categoriaInc.Tipo
        };

        return await _categoriasRepository.Post(categoria);
    }

    public async Task<Categorias> Put(AlteraCategoriaDTO categoriaAlt)
    {
        var categoria = await _categoriasRepository.Get(categoriaAlt.Id);

        if (!string.IsNullOrWhiteSpace(categoriaAlt.Descricao))
            categoria.Descricao = categoriaAlt.Descricao;

        if (categoriaAlt.Tipo is not null)
            categoria.Tipo = categoriaAlt.Tipo.Value;

        await _categoriasRepository.SaveChanges();

        return categoria;
    }

    public async Task Delete(int id)
    {
        var categoria = await _categoriasRepository.Get(id);

        if(categoria is not null && categoria.Transacoes.Any())
        {
            throw new Exception($"Não é possivel remover a categoria '{categoria.Descricao}', pois existem transações utilizando esta categoria. Caso deseje, favor inativar a transação.");
        }

        await _categoriasRepository.Delete(categoria);
        await _categoriasRepository.SaveChanges();
    }
}
