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
    public async Task<IActionResult> Get([FromQuery] FiltroCategoriasDTO filtro)
    {
        try
        {
            var categorias = await _serviceCategorias.GetAll(filtro);
            return Ok(categorias);
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
            var categoria = await _serviceCategorias.Get(id);
            return Ok(categoria);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost]
    public async Task<IActionResult> Post(NovaCategoriaDTO categoriaInc)
    {
        try
        {
            var categoria = await _serviceCategorias.Post(categoriaInc);
            return Ok(categoria);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut]
    public async Task<IActionResult> Put(AlteraCategoriaDTO categoriaAlt)
    {
        try
        {
            var categoria = await _serviceCategorias.Put(categoriaAlt);
            return Ok(categoria);
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
            await _serviceCategorias.Delete(id);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
