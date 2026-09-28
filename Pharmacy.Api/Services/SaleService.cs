using System.Text.Json;
using Pharmacy.Api.Models;

namespace Pharmacy.Api.Services;

public class SaleService
{
    private readonly string _filePath;
    private readonly MedicineService _medicineService;

    public SaleService(
        IWebHostEnvironment environment,
        MedicineService medicineService)
    {
        _filePath = Path.Combine(
            environment.ContentRootPath,
            "Data",
            "sales.json");

        _medicineService = medicineService;
    }

    public async Task<List<Sale>> GetAllAsync()
    {
        if (!File.Exists(_filePath))
        {
            return new List<Sale>();
        }

        var json = await File.ReadAllTextAsync(_filePath);

        return JsonSerializer.Deserialize<List<Sale>>(json)
               ?? new List<Sale>();
    }

    public async Task<(Sale? Sale, string? Error)> AddSaleAsync(
        int medicineId,
        int quantity)
    {
        if (quantity <= 0)
        {
            return (null, "Sale quantity must be greater than zero.");
        }

        var medicine =
            await _medicineService.GetByIdAsync(medicineId);

        if (medicine == null)
        {
            return (null, "Medicine not found.");
        }

        if (medicine.Quantity < quantity)
        {
            return (null, "Insufficient stock.");
        }

        medicine.Quantity -= quantity;

        var updatedMedicine =
            await _medicineService.UpdateAsync(
                medicineId,
                medicine);

        if (updatedMedicine == null)
        {
            return (null, "Unable to update medicine stock.");
        }

        var sales = await GetAllAsync();

        var sale = new Sale
        {
            Id = sales.Count == 0
                ? 1
                : sales.Max(s => s.Id) + 1,

            MedicineId = medicineId,

            QuantitySold = quantity,

            SaleDate = DateTime.UtcNow
        };

        sales.Add(sale);

        await SaveAsync(sales);

        return (sale, null);
    }

    private async Task SaveAsync(List<Sale> sales)
    {
        var options = new JsonSerializerOptions
        {
            WriteIndented = true
        };

        var json = JsonSerializer.Serialize(sales, options);

        await File.WriteAllTextAsync(_filePath, json);
    }
}