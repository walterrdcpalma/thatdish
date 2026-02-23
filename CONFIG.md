# Configuração da API

## Ficheiros de configuração

- **appsettings.json** – Base com valores vazios. Usado quando não há ambiente específico (ex.: Production). Não coloques segredos aqui.
- **appsettings.Development.json** – Preenchido com connection string Postgres (Supabase) e chaves Supabase para desenvolvimento. Este ficheiro está no `.gitignore` para não versionar segredos.

Só existem estes dois: Development e o resto (appsettings.json).

---

## Mapeamento: variável de ambiente → chave de config

Se quiseres sobrepor com env vars (em vez de appsettings.Development.json):

| Variável de ambiente | Chave de configuração |
|----------------------|------------------------|
| `ConnectionStrings__DefaultConnection` | `ConnectionStrings:DefaultConnection` |
| `Supabase__ProjectUrl` | `Supabase:ProjectUrl` |
| `Supabase__ServiceRoleKey` | `Supabase:ServiceRoleKey` |
| `Supabase__StorageBucket` | `Supabase:StorageBucket` |
| `Supabase__JwtSecret` | `Supabase:JwtSecret` |
| `Supabase__Issuer` | `Supabase:Issuer` (opcional; se vazio, é derivado de ProjectUrl + `/auth/v1`) |

Em .NET, `__` (dois underscores) em variáveis de ambiente corresponde a `:` na configuração.
