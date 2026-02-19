FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /workspace

# Copy project files first to maximize Docker layer caching for restore
COPY src/ThatDish.sln src/ThatDish.sln
COPY src/ThatDish.Api/ThatDish.Api.csproj src/ThatDish.Api/
COPY src/ThatDish.Application/ThatDish.Application.csproj src/ThatDish.Application/
COPY src/ThatDish.Domain/ThatDish.Domain.csproj src/ThatDish.Domain/
COPY src/ThatDish.Infrastructure/ThatDish.Infrastructure.csproj src/ThatDish.Infrastructure/

RUN dotnet restore src/ThatDish.Api/ThatDish.Api.csproj

# Copy full backend source and publish API
COPY src/ src/
RUN dotnet publish src/ThatDish.Api/ThatDish.Api.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

COPY --from=build /app/publish .

# Railway injects PORT. Keep a sensible default for local docker runs.
ENV PORT=8080
ENV ASPNETCORE_URLS=http://0.0.0.0:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "ThatDish.Api.dll"]
