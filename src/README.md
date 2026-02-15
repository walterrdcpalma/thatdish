# thatdish backend

.NET 10 modular monolith: Api, Application, Domain, Infrastructure.

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- **Development:** none (uses SQLite by default). **Production / PostgreSQL:** install PostgreSQL and EF Core tools: `dotnet tool install --global dotnet-ef`

## Setup

**Development (default)**  
No setup. The API uses SQLite and creates `thatdish.db` in the current directory on first run. No PostgreSQL required.

**PostgreSQL (staging/production)**  
1. Edit `ThatDish.Api/appsettings.Development.json` and set `ConnectionStrings:DefaultConnection` to your PostgreSQL connection string (e.g. `Host=localhost;Database=thatdish;Username=postgres;Password=postgres`).  
2. Create the database, then from `src/`:  
   `dotnet ef database update --project ThatDish.Infrastructure --startup-project ThatDish.Api`

## Run

From `src/`:

```bash
dotnet run --project ThatDish.Api
```

- **Health:** `GET http://localhost:5000/health`
- **List dishes:** `GET http://localhost:5000/api/dishes?page=1&pageSize=20`  
  Optional query: `foodType` (enum value, e.g. `Pasta`, `Grill`).

## Projects

| Project | Role |
|--------|------|
| **ThatDish.Api** | HTTP endpoints, DI registration |
| **ThatDish.Application** | Use cases, DTOs, interfaces (e.g. `IDishRepository`) |
| **ThatDish.Domain** | Entities, enums (no dependencies) |
| **ThatDish.Infrastructure** | EF Core, DbContext, repository implementations |

## Tests

From `src/`:

```bash
dotnet test
```

- **ThatDish.Api.Tests**: integration tests (WebApplicationFactory, SQLite test DB, seeded data). Health and `GET /api/dishes` (OK, JSON list, filter by food type, pagination).
- **ThatDish.Application.Tests**: unit tests for `DishListService` with mocked `IDishRepository` (NSubstitute).

## New migrations

From `src/`:

```bash
dotnet ef migrations add YourMigrationName --project ThatDish.Infrastructure --startup-project ThatDish.Api
dotnet ef database update --project ThatDish.Infrastructure --startup-project ThatDish.Api
```
