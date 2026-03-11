using controle.gastos.App.DTOs.Pessoas;
using controle.gastos.App.Interfaces.IServices;
using Microsoft.AspNetCore.Mvc;

namespace controle.gastos.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriasController(IServiceCategorias serviceCategorias) : ControllerBase
{
    private readonly IServiceCategorias _serviceCategorias = serviceCategorias;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] FiltroCategoriasDTO filtro)
    {
        var pessoas = await _serviceCategorias.GetAll(filtro);

        if (pessoas.Count == 0)
            return NotFound();

        return Ok(pessoas);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var pessoas = await _serviceCategorias.Get(id);
        return Ok(pessoas);
    }

    [HttpPost]
    public async Task<IActionResult> Post(NovaCategoriaDTO categoriaInc)
    {
        var pessoas = await _serviceCategorias.Post(categoriaInc);
        return Ok(pessoas);
    }

    [HttpPut]
    public async Task<IActionResult> Put(AlteraCategoriaDTO categoriaAlt)
    {
        var pessoas = await _serviceCategorias.Put(categoriaAlt);
        return Ok(pessoas);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _serviceCategorias.Delete(id);
        return Ok();
    }
}
