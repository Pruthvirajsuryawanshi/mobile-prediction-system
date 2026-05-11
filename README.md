# 📱 MobileAI Prediction System

A premium, AI-powered smartphone discovery and recommendation platform built with the MERN stack and OpenRouter AI.

---

## 🚀 Key Features

- **🧠 Hybrid Intelligence**: Combines a local MongoDB database of available stock with global market knowledge. Recommends the latest phones worldwide while highlighting what's in local stock.
- **💬 Minimal Chat Mode**: A dedicated toggle to switch between a detailed "Expert Consultation" and a "Direct Answer" mode for faster results.
- **🛍️ Rich Shopping Experience**:
  - **Live Product Images**: Automatically displays phone photos with a smart fallback system.
  - **Price Comparison**: Structured tables comparing estimated prices across Amazon, Flipkart, and Official stores.
  - **One-Click Shopping**: Guaranteed accurate links using dynamic search queries for Amazon and Flipkart.
- **✨ Premium UI**: Modern dark-themed interface with Glassmorphism, Framer Motion animations, and Markdown rendering support.

## 🏗️ Project Organization

The project is structured for high readability and modularity:

```text
├── client/                 # Frontend: React + Vite + Tailwind + Framer Motion
│   ├── src/
│   │   ├── components/     # Atomic UI components (Chat, Cards, Navbar)
│   │   ├── pages/          # Full page views (Home, Chat, Trending)
│   │   ├── services/       # API abstraction layer (Axios)
│   │   └── lib/            # Shared utilities (cn, formatters)
├── server/                 # Backend: Node.js + Express + Mongoose
│   ├── ai/                 # OpenRouter SSE Streaming logic
│   ├── controllers/        # Request handling & Orchestration
│   ├── models/             # Mongoose schemas (User, Mobile, Conversation)
│   ├── routes/             # API Endpoints
│   ├── services/           # Business logic (Recommendation engine)
│   ├── prompts/            # AI Behavioral Definitions (System Prompts)
│   └── scripts/            # Management scripts (Database Seeding)
└── ARCHITECTURE.md         # Detailed Data Pipeline & Design documentation
```

## 🛠️ Setup & Run Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally)
- OpenRouter API Key (in `server/.env`)

### The One-Click Method (Recommended)
From the root directory, run:
```bash
npm run dev
```
*This will start both the backend (Port 5000) and frontend (Port 5173) simultaneously.*

### Manual Startup (Alternative)
**1. Backend**:
```bash
cd server && npm start
```
**2. Frontend**:
```bash
cd client && npm run dev
```


## 📜 Documentation
For a deep dive into the data pipeline and how the AI extraction works, please refer to [ARCHITECTURE.md](./ARCHITECTURE.md).

---
Developed as a premium AI-powered mobile recommendation solution.
