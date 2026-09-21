# France Holiday Planner — Empire Workspace App

Built from user's `france_holiday_planner.html`.

## Overview

A comprehensive travel planning application with trip CRUD, route optimization, budget tracking, and AI-powered itinerary planning. The app uses a deterministic planner that requires no external geocoder and supports multiple French destinations.

## Architecture

### Frontend: Next.js 15 + React + TypeScript
- Pages router with responsive UI
- Tailwind CSS styling with shadcn/ui components
- State management with React hooks and localStorage
- API client using fetch with environment-based configuration

### Backend: FastAPI + Python
- RESTful API with Trip, Expense, and Route models
- Deterministic route optimization using pre-calculated destination coordinates
- SQLite persistence for trips and expenses
- Transport mode selection (car, train, flight) based on distance

### Runtime
- Local development with Docker Compose
- PostgreSQL for production, SQLite for development
- Redis for caching (planned)

## API Endpoints

### Trip Management
- `GET /api/trips` - List all trips
- `POST /api/trips` - Create new trip
- `GET /api/trips/{id}` - Get specific trip
- `PUT /api/trips/{id}` - Update trip
- `PATCH /api/trips/{id}` - Partial update
- `DELETE /api/trips/{id}` - Delete trip
- `POST /api/trips/{id}/expenses` - Add expense to trip
- `DELETE /api/trips/{id}/expenses/{expenseId}` - Remove expense
- `GET /api/trips/{id}/summary` - Get trip budget summary

### Route Planning
- `POST /api/routes/optimize` - Optimize route between destinations with transport options
- `POST /api/optimize-route` - Legacy endpoint for backward compatibility

### Destinations & Trip Plan
- `GET /api/destinations` - List all supported destinations with coordinates
- `GET /api/trip-plan` - Get the sample France holiday plan

### Health
- `GET /health` - Service health check

## Tech Stack

### Frontend Dependencies
- `next` (15.0.0)
- `react` (18.2.0)
- `react-dom` (18.2.0)

### Backend Dependencies
- `fastapi` (for web framework)
- `uvicorn[standard]` (ASGI server)
- `pydantic` (data validation)
- `python-multipart` (file uploads)
- `sqlalchemy` (ORM)

## Development Setup

### Local Development
```bash
cd france-holiday-planner
# Start API and frontend via Docker Compose
cd docker/
docker compose up --build
```

### Backend-Only Testing
```bash
cd backend
source venv/bin/activate  # or use uv
python -m pytest tests/ -v
```

### Frontend Development
```bash
cd frontend
npm run dev
```

## Environment Variables

Create `.env.local`:
```
API_URL=http://localhost:8000
DATABASE_URL=sqlite:///./france.db
```

## App Features

### Trip Planning
- Create trips with titles, dates, currencies, budgets
- Add multiple stops and expenses per trip
- Track spending against budget with status indicators

### Route Optimization
- Automatic stop ordering for minimal travel distance
- Multi-modal transport options (car, train, flight)
- Deterministic planning based on pre-calculated coordinates

### Budget Management
- Real-time expense tracking per category
- Budget vs. actual comparison
- Over/under budget status

### Data Persistence
- JSON file-based storage for trips and expenses
- LocalStorage fallback for offline expense editing
- Thread-safe database operations

## Quality Standards

- **Frontend**: TypeScript strict mode, ESLint, Prettier
- **Backend**: Pydantic validation, comprehensive tests
- **API**: OpenAPI specification, request/response validation
- **Code**: Consistent formatting, minimal comments, focused functions
- **Testing**: Unit tests for business logic, integration tests for API

## Project Status

This app demonstrates the Empire Workspace pattern of small, independently deployable SaaS applications with clear separation of concerns, comprehensive testing, and production-ready Docker deployments.

## Future Enhancements

Potential improvements based on user feedback and usage patterns:
- Real geocoder integration for dynamic destination resolution
- External booking service integration (flights, hotels)
- AI-powered itinerary suggestions
- Multi-language support
- Mobile app companion

## License

Empire Workspace applications are developed under open-source principles with focus on practical, production-ready solutions.