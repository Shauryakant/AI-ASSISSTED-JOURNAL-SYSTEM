# AI-Assisted Journal System Architecture

## 1. Scaling to 100k Users
The system is built as a single Next.js application with server-side API routes, prioritizing horizontal scalability:
- **Application Layer (Next.js)**: Stateless route handlers can be scaled horizontally behind a load balancer or through Vercel's serverless infrastructure.
- **Database (MongoDB)**: We can use MongoDB Atlas with sharding enabled based on the `userId`. Read-heavy workloads map nicely to read-replicas.
- **Frontend Delivery**: Static assets and the UI can be served efficiently through a CDN-backed deployment platform.
- **Infrastructure**: The application can be deployed as one service, while MongoDB remains an external managed dependency.

## 2. Reducing LLM Cost
Calling LLM APIs per entry can be costly. We employ the following strategies:
- **Smaller/Faster Models**: We use Groq's `llama-3.1-8b-instant` model, which is suitable for lightweight structured tasks like emotion detection and keyword extraction.
- **Strict Temperature/Tokens**: Model responses are restricted (`temperature: 0.1`, max output tokens `300`) to limit processing cost and generation length.
- **Prompt Engineering**: Instructing the model to only output JSON without conversational filler text significantly decreases token usage.

## 3. Caching Strategy for Repeated Analysis
We can cache LLM analysis requests using Redis to prevent duplicate API queries:
- **Exact Match Caching**: Hash the `text` string (e.g., using SHA-256) and use it as a Redis key for the result.
- **Debouncing**: Ensure requests hitting the API route for identical content before caching finishes are queued/deduplicated.
- **In-Memory Alternative**: For simpler setups, a memory store (like Node cache) works well for local testing before integrating Redis.

## 4. Protecting Sensitive Journal Data
Mental health data is highly sensitive and demands robust protection:
- **Input Sanitization**: `Helmet` is used to prevent XSS attacks. `Zod` validates the exact shape of incoming request bodies.
- **Rate-Limiting**: Strict rate-limiters are implemented (specifically on LLM-powered `/analyze` points) to prevent abuse and brute-force attacks.
- **At Rest**: Ensure your MongoDB clusters have Encryption at Rest enabled. 
- **In Transit**: Always stream API responses through HTTPS/TLS in production. 
- **PII Stripping (Future Enhancement)**: Before sending data to the LLM, we could run lightweight regex-based strippers locally to remove names, phone numbers, and emails.
