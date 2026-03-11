using controle.gastos.App.DTOs.Transacoes;
using controle.gastos.App.Interfaces.IRepositories;
using controle.gastos.App.Interfaces.IServices;
using controle.gastos.Domain.Entities;

namespace controle.gastos.App.Services;

public class ServiceTransacoes(ITransacoesRepository transacoesRepository) : IServiceTransacoes
{
    private readonly ITransacoesRepository _transacoesRepository = transacoesRepository;

    public async Task<List<Transacoes>> GetAll(FiltroTransacoesDTO filtro)
    {
        var categorias = await _transacoesRepository.GetAll(filtro);
        return categorias;
    }

    public async Task<Transacoes> Get(int id)
    {
        var pessoa = await _transacoesRepository.Get(id);
        return pessoa;
    }

    public async Task<Transacoes> Post(NovaTransacaoDTO transacaoInc)
    {
        var transacao = new Transacoes
        {

        };

        return await _transacoesRepository.Post(transacao);
    }

    public async Task<Transacoes> Put(AlteraTransacaoDTO transacaoAlt)
    {
        var transacao = await _transacoesRepository.Get(transacaoAlt.Id);

        transacao.Descricao = !string.IsNullOrWhiteSpace(transacaoAlt.Descricao) ? transacaoAlt.Descricao : transacao.Descricao;
        transacao.Valor = transacaoAlt.Valor.HasValue ? transacaoAlt.Valor.Value : transacao.Valor;
        transacao.Tipo = transacaoAlt.Tipo.HasValue ? transacaoAlt.Tipo.Value : transacao.Tipo;
        transacao.Data = transacaoAlt.Data.HasValue ? transacaoAlt.Data.Value : transacao.Data;
        transacao.PessoaId = transacaoAlt.PessoaId.HasValue ? transacaoAlt.PessoaId.Value : transacao.PessoaId;
        transacao.CategoriaId = transacaoAlt.CategoriaId.HasValue ? transacaoAlt.CategoriaId.Value : transacao.CategoriaId;

        await _transacoesRepository.SaveChanges();

        return transacao;
    }

    public async Task Delete(int id)
    {
        var categoria = await _transacoesRepository.Get(id);
        await _transacoesRepository.Delete(categoria);
        await _transacoesRepository.SaveChanges();
    }
}
