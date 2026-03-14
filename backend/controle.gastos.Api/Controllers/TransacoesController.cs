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
    public async Task<IActionResult> Get([FromQuery] FiltroTransacoesDTO filtro)
    {
        try
        {
            var transacoes = await _serviceTransacoes.GetAll(filtro);
            return Ok(transacoes);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }

    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        try
        {
            var transacao = await _serviceTransacoes.Get(id);
            return Ok(transacao);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }

    }

    [HttpPost]
    public async Task<IActionResult> Post(NovaTransacaoDTO pessoaInc)
    {
        try
        {
            var transacao = await _serviceTransacoes.Post(pessoaInc);
            return Ok(transacao);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }

    }

    [HttpPut]
    public async Task<IActionResult> Put(AlteraTransacaoDTO pessoaAlt)
    {
        try
        {
            var transacao = await _serviceTransacoes.Put(pessoaAlt);
            return Ok(transacao);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }

    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await _serviceTransacoes.Delete(id);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
