# AI-Assisted Journal System Architecture

## 1. Scaling to 100k Users
The system is built on Node.js and Next.js, prioritizing horizontal scalability:
- **Backend (Node.js)**: Stateless architecture allowing easy deployment of multiple instances behind a load balancer (e.g., Nginx, AWS ALB).
- **Database (MongoDB)**: We can use MongoDB Atlas with sharding enabled based on the `userId`. Read-heavy workloads map nicely to read-replicas.
- **Frontend (Next.js)**: Deployed to edge networks (like Vercel or AWS CloudFront) using static asset caching for the client code.
- **Infrastructure**: The provided `docker-compose` setup natively supports clustering using Docker Swarm or migration to Kubernetes.

## 2. Reducing LLM Cost
Calling LLM APIs per entry can be costly. We employ the following strategies:
- **Smaller/Faster Models**: We use Groq's `llama-3.1-8b-instant` model, which is suitable for lightweight structured tasks like emotion detection and keyword extraction.
- **Strict Temperature/Tokens**: Model responses are restricted (`temperature: 0.1`, max output tokens `300`) to limit processing cost and generation length.
- **Prompt Engineering**: Instructing the model to only output JSON without conversational filler text significantly decreases token usage.

## 3. Caching Strategy for Repeated Analysis
We can cache LLM analysis requests using Redis to prevent duplicate API queries:
- **Exact Match Caching**: Hash the `text` string (e.g., using SHA-256) and use it as a Redis key for the result.
- **Debouncing**: Ensure requests hitting the backend for identical content before caching finishes are queued/deduplicated.
- **In-Memory Alternative**: For simpler setups, a memory store (like Node cache) works well for local testing before integrating Redis.

## 4. Protecting Sensitive Journal Data
Mental health data is highly sensitive and demands robust protection:
- **Input Sanitization**: `Helmet` is used to prevent XSS attacks. `Zod` validates the exact shape of incoming request bodies.
- **Rate-Limiting**: Strict rate-limiters are implemented (specifically on LLM-powered `/analyze` points) to prevent abuse and brute-force attacks.
- **At Rest**: Ensure your MongoDB clusters have Encryption at Rest enabled. 
- **In Transit**: Always stream API responses through HTTPS/TLS in production. 
- **PII Stripping (Future Enhancement)**: Before sending data to the LLM, we could run lightweight regex-based strippers locally to remove names, phone numbers, and emails.
