# Auth (Supabase)

## Apple Sign-In (Supabase)

Para o botão "Apple" funcionar:

1. **Supabase Dashboard** → **Authentication** → **Providers** → **Apple**: ativar o provider.
2. **Apple Developer**:
   - Criar um **Service ID** (ex.: `com.yourapp.signin`) e configurar **Sign in with Apple**.
   - Em **Keys** criar uma **Sign in with Apple Key**; descarregar o ficheiro `.p8` e anotar **Key ID** e **Team ID** / **Service ID**.
3. **Supabase** → Apple provider: preencher **Services ID**, **Secret Key** (conteúdo do `.p8`), **Key ID**, **Team ID**, **Bundle ID** (ex.: `com.walter.thatdish`).
4. **Redirect URLs**: usar as mesmas que para Google (ex.: `https://your-site.com/auth/callback` e, em dev mobile, o URL `exp://...` do Metro). Em **URL Configuration** → **Redirect URLs** devem estar todas as URLs para onde o login pode redirecionar (web + mobile).

Sem este setup, o botão Apple pode devolver erro ao iniciar OAuth; o resto da app (Google, email/password) continua a funcionar.
