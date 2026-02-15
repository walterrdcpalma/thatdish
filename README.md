# thatdish

Mobile-first app to discover restaurants by their most worth-it dishes.

## Quick start

**Backend (API)**  
```bash
cd src && dotnet run --project ThatDish.Api
```
API: http://localhost:5000 (health: /health, dishes: /api/dishes)

**Frontend (Expo – web or mobile)**  
```bash
cd app && npm install && npm run web
```
Then open the URL in the browser (e.g. http://localhost:8081) or press `w` in the Expo CLI.  
Ensure the API is running so the feed loads dishes.

See [src/README.md](src/README.md) for backend details and [app/README.md](app/README.md) for the Expo app.