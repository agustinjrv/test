# Task Board

A small full-stack starter used to exercise the Cloud Agent development environment end to end.

- **API** — Express + TypeScript REST service with an in-memory task store (`server/`).
- **Web** — Vite + React + TypeScript single-page app that talks to the API (`web/`).

## Requirements

- Node.js >= 20
- npm (uses npm workspaces)

## Setup

```bash
npm install
```

## Develop

Run both dev servers together:

```bash
npm run dev
```

- Web: http://localhost:5173
- API: http://localhost:3001 (the web dev server proxies `/api` to it)

Or run them individually:

```bash
npm run dev:api   # Express API on :3001 (tsx watch)
npm run dev:web   # Vite dev server on :5173
```

## Quality checks

```bash
npm run typecheck   # tsc --noEmit for both packages
npm test            # server API tests (vitest + supertest)
npm run build       # production build of API and web
```

## API

| Method | Path              | Description        |
| ------ | ----------------- | ------------------ |
| GET    | `/api/health`     | Health probe       |
| GET    | `/api/tasks`      | List tasks         |
| POST   | `/api/tasks`      | Create a task      |
| PATCH  | `/api/tasks/:id`  | Toggle done state  |
| DELETE | `/api/tasks/:id`  | Delete a task      |

## Cloud Agent environment

`.cursor/environment.json` installs dependencies with `npm install` and starts two
terminals (`api`, `web`) so a Cloud Agent boots straight into a running full stack.
