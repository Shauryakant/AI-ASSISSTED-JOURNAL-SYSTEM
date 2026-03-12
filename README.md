# AI-Assisted Journal System

A full-stack journaling application with AI-driven emotion analysis using Groq. The Next.js app in `app/` now serves both the UI and the API for single-project deployment.

## System Requirements
- Node.js (v18+)
- MongoDB running locally or Atlas URI
- Docker & Docker Compose (optional for containerized deployment)

## Environment Variables

### App (`/app/.env.local`)
Create a `.env.local` file in the `app/` directory. You can copy from `app/.env.example`:
```env
MONGODB_URI=mongodb://localhost:27017/ai-journal
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.1-8b-instant
```

If `MONGODB_URI` is omitted locally, the app falls back to an in-memory MongoDB instance. For Vercel deployments, set `MONGODB_URI` explicitly.

## How to Run Locally

Open a terminal and navigate to the app directory:
```bash
cd app
npm install
npm run dev
```
*(The app will start on http://localhost:3000)*

## How to Set Up Docker Desktop
Docker Desktop provides a simple way to run all components inside containers without local dependency conflict.
1. Download Docker Desktop from `https://www.docker.com/products/docker-desktop/`.
2. Follow the installer for Windows/Mac and ensure the Docker Desktop application is running in the background.

## How to Run with Docker
If you have Docker Desktop running, you can run the single Next.js app and MongoDB together with Docker Compose.

1. Ensure you have Docker Desktop running.
2. Create an `app/.env.local` file with your `GROQ_API_KEY`.
3. Run from the project root:
```bash
docker-compose up --build
```
4. Visit `http://localhost:3000`.

## API Documentation

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `POST` | `/api/journal` | Creates a new entry | `{ userId, ambience, text }` |
| `GET`  | `/api/journal/:userId` | Gets all entries | N/A |
| `POST` | `/api/journal/analyze` | Returns LLM insights | `{ text }` |
| `GET`  | `/api/journal/insights/:userId` | Aggregated stats | N/A |

## Tech Stack
- **App**: Next.js App Router, Route Handlers, Tailwind CSS, Lucide Icons, Axios
- **Data/AI**: MongoDB, Mongoose, Groq SDK, Zod
