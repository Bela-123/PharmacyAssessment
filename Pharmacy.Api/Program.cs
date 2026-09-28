using Pharmacy.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});
builder.Services.AddSingleton<MedicineService>();
builder.Services.AddSingleton<SaleService>();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();
app.UseCors("ReactApp");
app.MapControllers();

app.Run();