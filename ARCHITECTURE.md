# MobileAI System Architecture & Pipeline

This document outlines the professional organization of the codebase and the data pipeline.

## 🏗️ Project Structure

```
mobile-prediction-system/
├── client/                 # Frontend: React + Vite + Tailwind
│   ├── src/
│   │   ├── components/     # UI Components (Atomic Design)
│   │   ├── pages/          # Full page views
│   │   ├── services/       # API abstraction layer
│   │   └── lib/            # Shared utilities (cn, formatters)
├── server/                 # Backend: Node.js + Express
│   ├── ai/                 # AI Strategy (OpenRouter integration)
│   ├── controllers/        # Request handling & Orchestration
│   ├── models/             # Data Schemas (Mongoose)
│   ├── routes/             # API Endpoint definitions
│   ├── services/           # Business Logic & DB Querying
│   ├── prompts/            # AI Behavioral Definitions
│   └── scripts/            # Management (Seeding, migration)
└── legacy/                 # Original Flask prototype (Organized)
```

## 🔄 Data Pipeline (The "Intelligence Flow")

1.  **Request Phase**:
    - User sends a natural language query from the React **ChatWindow**.
    - Frontend sends the query to the Express **ChatController**.

2.  **Extraction Phase**:
    - **ChatController** calls the **AI Extraction Service**.
    - AI analyzes the text and returns structured requirements (e.g., `budget: 50000`, `priority: gaming`).

3.  **Database Phase**:
    - The structured requirements are passed to the **RecommendationService**.
    - A dynamic MongoDB query is built to fetch the most relevant phones.

4.  **Enrichment Phase**:
    - The **ChatController** combines the user's message history + database results + global knowledge instructions.
    - This "Hybrid Context" is sent to the **OpenRouter SSE Stream**.

5.  **Streaming Response**:
    - The AI streams the response back to the frontend in real-time.
    - The frontend renders Markdown and original product images dynamically.

## 🛠️ Management Commands

- **Seed Database**: `cd server && node scripts/seed.js`
- **Run Backend**: `cd server && npm start`
- **Run Frontend**: `cd client && npm run dev`
