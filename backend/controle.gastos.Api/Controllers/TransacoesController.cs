using controle.gastos.App.DTOs.Pessoas;
using controle.gastos.App.DTOs.Transacoes;
using controle.gastos.App.Interfaces.IServices;
using Microsoft.AspNetCore.Mvc;

namespace controle.gastos.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransacoesController(IServiceTransacoes serviceTransacoes) : ControllerBase
{
    private readonly IServiceTransacoes _serviceTransacoes = serviceTransacoes;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] FiltroTransacoesDTO filtro) //Caso queira retornar todas as pessoas, basta não adicionar nenhum filtro a query
    {
        var pessoas = await _serviceTransacoes.GetAll(filtro);

        if (pessoas.Count == 0)
            return NotFound();

        return Ok(pessoas);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var pessoas = await _serviceTransacoes.Get(id);
        return Ok(pessoas);
    }

    [HttpPost]
    public async Task<IActionResult> Post(NovaTransacaoDTO pessoaInc)
    {
        var pessoas = await _serviceTransacoes.Post(pessoaInc);
        return Ok(pessoas);
    }

    [HttpPut]
    public async Task<IActionResult> Put(AlteraTransacaoDTO pessoaAlt)
    {
        var pessoas = await _serviceTransacoes.Put(pessoaAlt);
        return Ok(pessoas);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _serviceTransacoes.Delete(id);
        return Ok();
    }
}
