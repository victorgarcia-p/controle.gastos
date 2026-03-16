using controle.gastos.App.DTOs.Pessoas;
using controle.gastos.App.Interfaces.IServices;
using Microsoft.AspNetCore.Mvc;

namespace controle.gastos.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PessoasController(IServicePessoas servicePessoas) : ControllerBase
{
    private readonly IServicePessoas _servicePessoas = servicePessoas;

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] FiltroPessoasDTO filtro)
    {
        try
        {
            var pessoas = await _servicePessoas.GetAll(filtro);
            return Ok(pessoas);
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
            var pessoa = await _servicePessoas.Get(id);
            return Ok(pessoa);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost]
    public async Task<IActionResult> Post(NovaPessoaDTO pessoaInc)
    {
        try
        {
            var pessoa = await _servicePessoas.Post(pessoaInc);
            return Ok(pessoa);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut]
    public async Task<IActionResult> Put(AlteraPessoaDTO pessoaAlt)
    {
        try
        {
            var pessoa = await _servicePessoas.Put(pessoaAlt);
            return Ok(pessoa);
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
            await _servicePessoas.Delete(id);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
