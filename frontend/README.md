# Frontend

This frontend is built with Next.js App Router and serves the Mindscape Journal UI.

## Overview

- Renders the journal entry form, recent entries, and insights dashboard.
- Uses a same-origin `/api/*` proxy layer through Next.js route handlers.
- Avoids exposing backend hostnames directly to the browser.

## Environment

Create `frontend/.env.local` only if the backend is not available at `http://localhost:5000`:

```env
INTERNAL_API_URL=http://localhost:5000
```

If omitted, the frontend assumes the backend is running on `http://localhost:5000`.

## Local Development

```bash
npm install
npm run dev
```

The frontend runs at `http://localhost:3000`.

## Docker

When started through the root `docker-compose.yml`, the frontend uses:

```env
INTERNAL_API_URL=http://backend:5000
```

This works because `backend` is resolvable inside the Docker network, while the browser still calls the frontend on `http://localhost:3000`.

## API Flow

Browser requests:

```text
/api/journal/*
```

Next.js route handler forwards those requests to:

```text
${INTERNAL_API_URL}/api/journal/*
```

The proxy route lives in `src/app/api/[...path]/route.ts`.
