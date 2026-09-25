# France Holiday Planner — Flight, Insurance & Car Rental Quote Engine

## App Name
**France Holiday Planner** (anagram-friendly: "HOLIDAY PLANNER" → "PLAN A HOLIDAY" or "PLANNER HOLIDAY")

## Architecture
- Frontend: Next.js 15 + React + TypeScript + Tailwind
- Backend: FastAPI + Python + Pydantic
- API Gateway: Routes `/api/flights/*`, `/api/insurance/*`, `/api/cars/*` to external quote APIs

## API Gateway Pattern
The backend proxies calls to external APIs with deterministic fallbacks:
- `/api/flights?origin=PAR&dest=MRS&date=2026-07-01` → returns cheapest flight quotes
- `/api/insurance?dest=MRS&date=2026-07-01&duration=7` → returns cheapest insurance quotes
- `/api/cars?dest=MRS&date=2026-07-01&duration=7` → returns cheapest car rental quotes

All API calls use the same pattern: input origin/destination → fetch cheapest quote from external provider → return structured response.