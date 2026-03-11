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
    public async Task<IActionResult> GetAll([FromQuery] FiltroPessoasDTO filtro) //Caso queira retornar todas as pessoas, basta não adicionar nenhum filtro a query
    {
        var pessoas = await _servicePessoas.GetAll(filtro);

        if (pessoas.Count == 0)
            return NotFound();

        return Ok(pessoas);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var pessoas = await _servicePessoas.Get(id);
        return Ok(pessoas);
    }

    [HttpPost]
    public async Task<IActionResult> Post(NovaPessoaDTO pessoaInc)
    {
        var pessoas = await _servicePessoas.Post(pessoaInc);
        return Ok(pessoas);
    }

    [HttpPut]
    public async Task<IActionResult> Put(AlteraPessoaDTO pessoaAlt)
    {
        var pessoas = await _servicePessoas.Put(pessoaAlt);
        return Ok(pessoas);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _servicePessoas.Delete(id);
        return Ok();
    }
}
