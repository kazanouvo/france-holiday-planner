# France Holiday Planner — Agent Guide

## Scope

Empire Workspace is a monorepo of independently deployable SaaS applications. This app (`/opt/data/home/france-holiday-planner`) follows Empire conventions: frontend in `frontend/`, API in `backend/`, tests in `backend/tests/`, and local development with Docker Compose.

## Repository Workflow

- Normal development targets `development`.
- Never commit directly to `main`.
- Create `feature/*` or `fix/*` branches from `development`.
- Integrate through review: feature/fix branch -> `development` -> `main`.
- Do not merge or promote to `main` until relevant checks pass.

## Engineering Rules

- Use the target app's actual dependencies and conventions; do not assume every app has the same stack.
- Do not add a dependency without a concrete reason and documentation in the change.
- Keep changes focused and avoid unrelated generated-file churn.
- Never weaken, skip, delete, or hide tests to make them pass.
- Never expose secrets, API keys, credentials, tokens, private keys, or populated `.env` files. Use environment variables and `.env.example` placeholders.
- Do not make destructive database changes or change production infrastructure without explicit approval.
- Record significant cross-app, data, deployment, or public-interface decisions in `DECISIONS.md`.

## Validation

Run the narrowest relevant app-local tests first. Then run available frontend lint/type-check/build and backend lint/type-check commands. Use root PowerShell smoke/build scripts only when their scope matches the change. Before handoff, review the diff and report commands run, failures, and skipped checks.

## Common Shape

This app follows the standard Empire pattern:
- Frontend: Next.js 15, React, TypeScript, Tailwind CSS (Next.js pages router)
- API: FastAPI on Python with Pydantic, SQLite persistence in `trips.json`
- Tests: pytest with FastAPI TestClient
- Runtime: Docker Compose with API on port 8000, frontend on port 3000

Confirm `frontend/package.json`, `backend/requirements.txt`, `docker-compose.yml`, and `README.md` before relying on this convention.