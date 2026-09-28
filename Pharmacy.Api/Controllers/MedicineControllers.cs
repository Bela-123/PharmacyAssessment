using Microsoft.AspNetCore.Mvc;
using Pharmacy.Api.Models;
using Pharmacy.Api.Services;

namespace Pharmacy.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MedicinesController : ControllerBase
{
    private readonly MedicineService _medicineService;

    public MedicinesController(MedicineService medicineService)
    {
        _medicineService = medicineService;
    }

    // GET: api/medicines
    [HttpGet]
    public async Task<ActionResult<List<Medicine>>> GetMedicines(
        [FromQuery] string? search)
    {
        var medicines = await _medicineService.SearchAsync(search);

        return Ok(medicines);
    }

    // GET: api/medicines/1
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Medicine>> GetMedicine(int id)
    {
        var medicine = await _medicineService.GetByIdAsync(id);

        if (medicine == null)
        {
            return NotFound(new
            {
                message = "Medicine not found."
            });
        }

        return Ok(medicine);
    }

    // POST: api/medicines
    [HttpPost]
    public async Task<ActionResult<Medicine>> AddMedicine(
        [FromBody] Medicine medicine)
    {
        var createdMedicine = await _medicineService.AddAsync(medicine);

        return CreatedAtAction(
            nameof(GetMedicine),
            new { id = createdMedicine.Id },
            createdMedicine);
    }

    // PUT: api/medicines/1
    [HttpPut("{id:int}")]
    public async Task<ActionResult<Medicine>> UpdateMedicine(
        int id,
        [FromBody] Medicine medicine)
    {
        var updatedMedicine =
            await _medicineService.UpdateAsync(id, medicine);

        if (updatedMedicine == null)
        {
            return NotFound(new
            {
                message = "Medicine not found."
            });
        }

        return Ok(updatedMedicine);
    }

    // DELETE: api/medicines/1
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteMedicine(int id)
    {
        var deleted = await _medicineService.DeleteAsync(id);

        if (!deleted)
        {
            return NotFound(new
            {
                message = "Medicine not found."
            });
        }

        return NoContent();
    }
}