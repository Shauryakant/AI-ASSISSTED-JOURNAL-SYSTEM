# AI-Assisted Journal System

A production-ready full-stack application for journaling and AI-driven emotion analysis using Groq.

## System Requirements
- Node.js (v18+)
- MongoDB running locally or Atlas URI
- Docker & Docker Compose (optional for containerized deployment)

## Environment Variables

### Backend (`/backend/.env`)
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-journal
GROQ_API_KEY=your_groq_api_key_here
```

### Frontend (`/frontend/.env.local`)
Create a `.env.local` file in the `frontend/` directory if your backend is not running on `http://localhost:5000`:
```env
INTERNAL_API_URL=http://localhost:5000
```

The frontend uses same-origin `/api/*` requests and proxies them through Next.js to `INTERNAL_API_URL`, so the same frontend code works for local runs and Docker.

## How to Run Locally

### 1. Backend
Open a terminal and navigate to the backend directory:
```bash
cd backend
npm install
npm run dev
```
*(Server will start on http://localhost:5000)*

### 2. Frontend
Open another terminal and navigate to the frontend directory:
```bash
cd frontend
npm install
npm run dev
```
*(Client will start on http://localhost:3000)*

If your backend is on a different host or port, set `INTERNAL_API_URL` in `frontend/.env.local` before starting the frontend.

## How to Set Up Docker Desktop
Docker Desktop provides a simple way to run all components inside containers without local dependency conflict.
1. Download Docker Desktop from `https://www.docker.com/products/docker-desktop/`.
2. Follow the installer for Windows/Mac and ensure the Docker Desktop application is running in the background.

## How to Run with Docker
If you have Docker Desktop running, you can spin up the entire application (MongoDB, Backend, Frontend) with one command.

1. Ensure you have Docker Desktop running.
2. Create a `backend/.env` file with your `GROQ_API_KEY`.
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
- **Frontend**: Next.js App Router, Tailwind CSS, Lucide Icons, Axios.
- **Backend**: Node.js, Express, Mongoose, Groq SDK, Zod, Helmet.
