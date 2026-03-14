using controle.gastos.App.Interfaces.IRepositories;
using controle.gastos.App.Interfaces.IServices;
using controle.gastos.App.Services;
using controle.gastos.Infra.Context;
using controle.gastos.Infra.Repositories;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers()
    .AddJsonOptions(options =>
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles); ;
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy("frontend",
        policy =>
        {
            policy
                .AllowAnyOrigin()
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

builder.Services.AddDbContext<ContextDb>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

#region Injections

/*Services*/
builder.Services.AddScoped<IServiceCategorias, ServiceCategorias>();
builder.Services.AddScoped<IServicePessoas, ServicePessoas>();
builder.Services.AddScoped<IServiceTransacoes, ServiceTransacoes>();

/*Repositories*/
builder.Services.AddScoped<ICategoriasRepository, CategoriasRepository>();
builder.Services.AddScoped<IPessoasRepository, PessoasRepository>();
builder.Services.AddScoped<ITransacoesRepository, TransacoesRepository>();

#endregion Injections

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

app.UseCors("frontend");

app.UseAuthorization();

app.MapControllers();

app.Run();
