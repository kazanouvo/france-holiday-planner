# Prioritized Tasks

This list is the current cross-repository queue. Add app-specific detail to the app's own task tracker or README when available. Keep items actionable and mark ownership/status in the branch or pull request.

## P0 - Required Before Production Promotion

- [x] Configure GitHub branch protection for `main`: pull request review, required status checks, and no direct pushes.
- [ ] Confirm CI runs relevant backend tests, frontend checks, and builds for changed app directories.
- [ ] Audit tracked files and CI logs for secrets before the next production merge.

## P1 - Current Engineering Work

- [x] Inventory each app's supported test, lint, type-check, and build commands and expose them consistently in its README where missing.
- [ ] Add or complete focused regression tests for changed API and UI behavior in the affected app.
- [x] Review app-local `.env.example` files for completeness without adding real credentials.

## P2 - Follow-Up Improvements

- [ ] Reduce duplicated app scaffolding and shared configuration only when a stable shared contract is identified.
- [ ] Document any cross-app architecture or infrastructure decision in `DECISIONS.md` before implementation.

## Working Rules

- New tasks should identify the app, expected behavior, and validation command.
- Do not remove a task because it is difficult; split it into smaller verifiable tasks.
- Update this file on `development`, not on `main`.

## App-Specific Notes

### France Holiday Planner

**Validation Commands:**
- Backend tests: `cd backend && python -m pytest tests/ -v` (requires pytest)
- Frontend build: `cd frontend && npm run build`
- Docker compose: `cd /opt/data/home/france-holiday-planner && docker compose up --build`

**App-Local Tests:**
- Trip CRUD operations (create, read, update, delete)
- Route optimization calculations
- Expense management within trips
- Budget summary and validation

**Known Gaps:**
- Missing `pytest` in backend environment
- Frontend calls `http://localhost:8001` but API runs on 8000 in docker-compose
- No generated Dockerfiles for backend or frontend
- No CI configuration for automated testing