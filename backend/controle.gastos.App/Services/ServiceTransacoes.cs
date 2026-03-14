using controle.gastos.App.DTOs.Transacoes;
using controle.gastos.App.Interfaces.IRepositories;
using controle.gastos.App.Interfaces.IServices;
using controle.gastos.Domain.Entities;
using controle.gastos.Domain.Enums;

namespace controle.gastos.App.Services;

public class ServiceTransacoes(ITransacoesRepository transacoesRepository, IPessoasRepository pessoasRepository, ICategoriasRepository categoriasRepository) : IServiceTransacoes
{
    private readonly ITransacoesRepository _transacoesRepository = transacoesRepository;
    private readonly IPessoasRepository _pessoasRepository = pessoasRepository;
    private readonly ICategoriasRepository _categoriasRepository = categoriasRepository;

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
        var pessoa = await _pessoasRepository.Get(transacaoInc.PessoaId);
        var categoria = await _categoriasRepository.Get(transacaoInc.CategoriaId);

        /*Método validador das regras de negócio*/
        ValidarTransacao(transacaoInc, pessoa, categoria);

        var transacao = new Transacoes
        {
            Descricao = transacaoInc.Descricao,
            Valor = transacaoInc.Valor,
            Tipo = transacaoInc.Tipo.GetTipo(),
            Data = transacaoInc.Data,
            PessoaId = transacaoInc.PessoaId,
            CategoriaId = transacaoInc.CategoriaId
        };

        return await _transacoesRepository.Post(transacao);
    }

    public async Task<Transacoes> Put(AlteraTransacaoDTO transacaoAlt)
    {
        /*Obtenho a transação*/
        var transacao = await _transacoesRepository.Get(transacaoAlt.Id);

        /*Altero os dados se necessário, utilizando operador ternário para verificar se o campo precisa ser alterado.*/
        /*Essa verificação é mais para evitar que algum campo seja excluido sem intenção. Em geral o Front costuma mandar os valores mesmo que não sejam diferentes.*/
        transacao.Descricao = !string.IsNullOrWhiteSpace(transacaoAlt.Descricao) ? transacaoAlt.Descricao : transacao.Descricao;
        transacao.Valor = transacaoAlt.Valor.HasValue ? transacaoAlt.Valor.Value : transacao.Valor;
        transacao.Tipo = !string.IsNullOrEmpty(transacaoAlt.Tipo) ? transacaoAlt.Tipo.GetTipo() : transacao.Tipo;
        transacao.Data = transacaoAlt.Data.HasValue ? transacaoAlt.Data.Value : transacao.Data;
        transacao.PessoaId = transacaoAlt.PessoaId.HasValue ? transacaoAlt.PessoaId.Value : transacao.PessoaId;
        transacao.CategoriaId = transacaoAlt.CategoriaId.HasValue ? transacaoAlt.CategoriaId.Value : transacao.CategoriaId;

        await _transacoesRepository.SaveChanges();

        return transacao;
    }

    public async Task Delete(int id)
    {
        /*Obtem a transação pelo ID, verifica se ela existe antes de exclui-la*/
        var transacao = await _transacoesRepository.Get(id);

        if (transacao is null)
            throw new Exception("Não foi possivel localizar a transação.");

        await _transacoesRepository.Delete(transacao);
        await _transacoesRepository.SaveChanges();
    }

    private void ValidarTransacao(NovaTransacaoDTO transacao, Pessoas pessoa, Categorias categoria)
    {
        var idadePessoa = CalcularIdade(pessoa.Nascimento);

        if (transacao.Tipo == Tipo.Ambas.ToString())
            throw new Exception("Uma transação não pode ser Despesa e Receita ao mesmo tempo.");

        if (categoria.Tipo != Tipo.Ambas && categoria.Tipo.ToString() != transacao.Tipo)
            throw new Exception("Categoria não é compatível com o tipo da transação.");

        if (idadePessoa < 18 && transacao.Tipo != Tipo.Despesa.ToString())
            throw new Exception("Menores de idade não podem registrar Receita.");
    }

    private int CalcularIdade(DateTime nascimento)
    {
        var hoje = DateTime.Today;
        var idade = hoje.Year - nascimento.Year;

        if (nascimento.Date > hoje.AddYears(-idade))
            idade--;

        return idade;
    }
}
