# Configurar Supabase (registo e login com Google)

O login é feito **só com Google**. O Supabase cria o utilizador automaticamente; não há registo manual com email/palavra-passe.

---

## 1. Criar projeto no Supabase

1. Abre [supabase.com](https://supabase.com) e inicia sessão (ou cria conta).
2. Clica em **New Project**.
3. Escolhe organização, nome do projeto (ex: `thatdish`) e uma password para a base de dados (guarda-a).
4. Escolhe região e clica **Create new project**. Espera uns minutos até o projeto ficar pronto.

---

## 2. Obter os valores na API do Supabase

1. No dashboard do projeto, vai a **Project Settings** (ícone de engrenagem na barra lateral).
2. Clica em **API** no menu à esquerda.
3. Vais precisar de:
   - **Project URL** – algo como `https://abcdefghijk.supabase.co`
   - **anon public** (em Project API keys) – uma chave longa que começa por `eyJ...`
   - **JWT Secret** – mais abaixo na mesma página (em "JWT Settings"); é um secret que o backend usa para validar os tokens. Clica em "Reveal" se estiver oculto.

---

## 3. Ativar Google no Supabase e configurar redirect URLs

1. No Supabase: **Authentication** → **Providers** → **Google**. Ativa o provider.
2. Cria credenciais no Google (próxima secção). Depois cola no Supabase o **Client ID** e **Client Secret** do Google e guarda.
3. Em **Authentication** → **URL Configuration** → **Redirect URLs**, adiciona:
   - Para **web** (Expo no browser): `http://localhost:8081` (e em produção a URL da tua app, ex: `https://thatdish.vercel.app`).
   - Para **mobile** (Expo Go / app nativa): `app://` (o scheme do `app.json`).

---

## 4. Google Cloud Console (credenciais para Google Sign-In)

1. Abre [Google Cloud Console](https://console.cloud.google.com).
2. Cria ou escolhe um projeto.
3. Vai a **APIs & Services** → **Credentials** → **Create Credentials** → **OAuth client ID**.
4. Se pedir, configura o ecrã de consentimento OAuth (tipo "External", nome da app, email de suporte).
5. Tipo de cliente: **Web application** (para Expo web). Nome: ex. "thatdish web".
6. Em **Authorized redirect URIs** adiciona exatamente:  
   `https://O_TEU_PROJECT_REF.supabase.co/auth/v1/callback`  
   (substitui `O_TEU_PROJECT_REF` pelo ID do teu projeto Supabase, que está no URL do projeto: `https://xxxx.supabase.co`).
7. Cria. Copia o **Client ID** e **Client Secret** e cola no Supabase em Authentication → Providers → Google.

---

## 5. Configurar o frontend (Expo)

1. Na pasta **app** do repositório, cria um ficheiro `.env` (se ainda não existir).
2. Copia o conteúdo de `app/.env.example` para `.env`.
3. Preenche no `.env`:
   - **EXPO_PUBLIC_SUPABASE_URL** = o **Project URL** (ex: `https://abcdefghijk.supabase.co`).
   - **EXPO_PUBLIC_SUPABASE_ANON_KEY** = a chave **anon public**.
4. Guarda o ficheiro. **Reinicia o Expo** para carregar as variáveis:
   ```bash
   cd app && npx expo start --web --clear
   ```

---

## 6. Configurar o backend (API .NET)

1. Abre o ficheiro **src/ThatDish.Api/appsettings.Development.json**.
2. Na secção **Supabase**:
   - **Issuer**: usa o **Project URL** + `/auth/v1`  
     Exemplo: se o Project URL for `https://abcdefghijk.supabase.co`, põe  
     `https://abcdefghijk.supabase.co/auth/v1`
   - **JwtSecret**: cola o **JWT Secret** que viste nas definições da API do Supabase.
3. Guarda o ficheiro.
4. Reinicia a API:
   ```bash
   cd src && dotnet run --project ThatDish.Api
   ```

---

## 7. Testar

1. Com a API e o Expo a correr, abre a app no browser (ex: `http://localhost:8081`).
2. Vai ao separador **Profile**.
3. Clica em **Entrar com Google**. Deves ser redirecionado para o Google, escolher a conta e voltar à app já autenticado.
4. O teu email (Google) deve aparecer no Profile. Clica em **Sair** e volta a **Entrar com Google** para confirmar.

---

## Notas

- O ficheiro **.env** da pasta **app** não deve ser commitado (já deve estar no `.gitignore`). O **appsettings.Development.json** normalmente também não é commitado com secrets reais; podes usar User Secrets em produção.
- O **redirect URI** no Google Cloud tem de ser exatamente `https://O_TEU_PROJECT_REF.supabase.co/auth/v1/callback` (com o teu project ref do Supabase).
- Se o login falhar, confirma: (1) Redirect URLs no Supabase incluem `http://localhost:8081` para web; (2) Google OAuth tem o callback do Supabase; (3) **Issuer** e **JwtSecret** no backend estão corretos.
