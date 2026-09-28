using System.Text.Json;
using Pharmacy.Api.Models;

namespace Pharmacy.Api.Services;

public class MedicineService
{
    private readonly string _filePath;

    public MedicineService(IWebHostEnvironment environment)
    {
        _filePath = Path.Combine(
            environment.ContentRootPath,
            "Data",
            "medicines.json");
    }

    public async Task<List<Medicine>> GetAllAsync()
    {
        if (!File.Exists(_filePath))
        {
            return new List<Medicine>();
        }

       var json = await File.ReadAllTextAsync(_filePath);

var options = new JsonSerializerOptions
{
    PropertyNameCaseInsensitive = true
};

return JsonSerializer.Deserialize<List<Medicine>>(json, options)
       ?? new List<Medicine>();
    }

    public async Task<Medicine?> GetByIdAsync(int id)
    {
        var medicines = await GetAllAsync();

        return medicines.FirstOrDefault(m => m.Id == id);
    }

    public async Task<List<Medicine>> SearchAsync(string? name)
    {
        var medicines = await GetAllAsync();

        if (string.IsNullOrWhiteSpace(name))
        {
            return medicines;
        }

        return medicines
            .Where(m => m.FullName.Contains(
                name,
                StringComparison.OrdinalIgnoreCase))
            .ToList();
    }

    public async Task<Medicine> AddAsync(Medicine medicine)
    {
        var medicines = await GetAllAsync();

        medicine.Id = medicines.Count == 0
            ? 1
            : medicines.Max(m => m.Id) + 1;

        medicines.Add(medicine);

        await SaveAsync(medicines);

        return medicine;
    }

    public async Task<Medicine?> UpdateAsync(int id, Medicine medicine)
    {
        var medicines = await GetAllAsync();

        var existingMedicine = medicines.FirstOrDefault(m => m.Id == id);

        if (existingMedicine == null)
        {
            return null;
        }

        existingMedicine.FullName = medicine.FullName;
        existingMedicine.Notes = medicine.Notes;
        existingMedicine.ExpiryDate = medicine.ExpiryDate;
        existingMedicine.Quantity = medicine.Quantity;
        existingMedicine.Price = medicine.Price;
        existingMedicine.Brand = medicine.Brand;

        await SaveAsync(medicines);

        return existingMedicine;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var medicines = await GetAllAsync();

        var medicine = medicines.FirstOrDefault(m => m.Id == id);

        if (medicine == null)
        {
            return false;
        }

        medicines.Remove(medicine);

        await SaveAsync(medicines);

        return true;
    }

    private async Task SaveAsync(List<Medicine> medicines)
    {
        var options = new JsonSerializerOptions
        {
            WriteIndented = true
        };

        var json = JsonSerializer.Serialize(medicines, options);

        await File.WriteAllTextAsync(_filePath, json);
    }
}