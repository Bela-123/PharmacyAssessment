using Microsoft.AspNetCore.Mvc;
using Pharmacy.Api.Models;
using Pharmacy.Api.Services;

namespace Pharmacy.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SalesController : ControllerBase
{
    private readonly SaleService _saleService;

    public SalesController(SaleService saleService)
    {
        _saleService = saleService;
    }

    // GET: api/sales
    [HttpGet]
    public async Task<ActionResult<List<Sale>>> GetSales()
    {
        var sales = await _saleService.GetAllAsync();

        return Ok(sales);
    }

    // POST: api/sales
    [HttpPost]
    public async Task<ActionResult<Sale>> CreateSale(
        [FromBody] CreateSaleRequest request)
    {
        var result = await _saleService.AddSaleAsync(
            request.MedicineId,
            request.Quantity);

        if (result.Sale == null)
        {
            return BadRequest(new
            {
                message = result.Error
            });
        }

        return Ok(result.Sale);
    }
}

public class CreateSaleRequest
{
    public int MedicineId { get; set; }

    public int Quantity { get; set; }
}