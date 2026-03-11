using controle.gastos.App.DTOs.Pessoas;
using controle.gastos.App.Interfaces.IRepositories;
using controle.gastos.App.Interfaces.IServices;
using controle.gastos.Domain.Entities;

namespace controle.gastos.App.Services;

public class ServicePessoas(IPessoasRepository pessoasRepository) : IServicePessoas
{
    private readonly IPessoasRepository _pessoasRepository = pessoasRepository;

    public async Task<List<Pessoas>> GetAll(FiltroPessoasDTO filtro)
    {
        var pessoas = await _pessoasRepository.GetAll(filtro);
        return pessoas;
    }

    public async Task<Pessoas> Get(int id)
    {
        var pessoa = await _pessoasRepository.Get(id);
        return pessoa;
    }

    public async Task<Pessoas> Post(NovaPessoaDTO pessoaInc)
    {
        var pessoa = new Pessoas
        {
            Nome = pessoaInc.Nome,
            Nascimento = pessoaInc.Nascimento
        };

        return await _pessoasRepository.Post(pessoa);
    }

    public async Task<Pessoas> Put(AlteraPessoaDTO pessoaAlt)
    {
        var pessoa = await _pessoasRepository.Get(pessoaAlt.Id);

        if (!string.IsNullOrWhiteSpace(pessoaAlt.Nome))
            pessoa.Nome = pessoaAlt.Nome;

        if (pessoaAlt.Nascimento.HasValue)
            pessoa.Nascimento = pessoaAlt.Nascimento.Value;

        await _pessoasRepository.SaveChanges();

        return pessoa;

    }

    public async Task Delete(int id)
    {
        var pessoa = await _pessoasRepository.Get(id);
        await _pessoasRepository.Delete(pessoa);
        await _pessoasRepository.SaveChanges();
    }
}
