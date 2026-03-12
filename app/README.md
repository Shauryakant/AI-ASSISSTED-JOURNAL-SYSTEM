# App

This Next.js application serves both the Mindscape Journal UI and the API.

## Overview

- Renders the journal entry form, recent entries, and insights dashboard.
- Exposes the required journal APIs through Next.js route handlers.
- Can be deployed as a single Vercel project.

## Environment

Create `app/.env.local` with the server-side environment variables. You can copy `app/.env.example`:

```env
MONGODB_URI=mongodb://localhost:27017/ai-journal
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.1-8b-instant
```

If `MONGODB_URI` is omitted locally, the app falls back to an in-memory MongoDB instance. On Vercel, `MONGODB_URI` is required.

## Local Development

```bash
npm install
npm run dev
```

The app runs at `http://localhost:3000`.

## Docker

The root `docker-compose.yml` runs this app with MongoDB for local containerized development.

## API Flow

Browser requests:

```text
/api/journal/*
```

Next.js route handlers live in:

```text
src/app/api/journal/*
```
