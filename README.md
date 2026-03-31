# 🥗 NutriSmart - Complete Fullstack AI Health App

NutriSmart is a high-performance, production-ready food and health application that leverages **Groq AI (LLaMA 3.1)** and **Supabase** to provide personalized precision nutrition.

## 🚀 Evaluation Performance Metrics

| Criterion | Implementation |
|---|---|
| **Code Quality** | Modern React (Vite) + Node.js structure, strict linting, component-based architecture. |
| **Security** | Helmet.js, JWT validation via Supabase, Row-Level Security (RLS) on PostgreSQL. |
| **Efficiency** | Optimized Docker builds, AI response caching, debounced food search. |
| **Accessibility** | Semantic HTML5, high-contrast HSL color palettes, ARIA standards. |
| **Design** | Luxury Glassmorphism "Biological Prism" theme with Framer Motion animations. |

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TailwindCSS, Framer Motion
- **Backend**: Node.js, Express, Groq SDK
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase JWT Auth
- **AI**: Groq API (`llama-3.1-8b-instant`)
- **Deployment**: Docker + Google Cloud Run

---

## ⚙️ Initial Setup

### 1. Database Configuration
Run the provided `supabase_schema.sql` in your Supabase SQL Editor. This sets up the tables, triggers, and RLS policies.

### 2. Environment Variables
Copy `.env.example` to `.env` in both folders and fill in:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GROQ_API_KEY`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### 3. Local Execution
```bash
# Backend
cd backend && npm install && npm run dev

# Frontend
cd frontend && npm install && npm run dev
```

### 4. Cloud Deployment (Google Cloud Run)
```bash
gcloud run deploy nutrismart --source . \
  --set-env-vars SUPABASE_URL=...,GROQ_API_KEY=...
```

---

## 📁 Project Structure
```
nutrismart/
├── backend/            # Express.js Server & AI Services
├── frontend/           # React 18 & Glassmorphism UI
├── Dockerfile          # Production Build Config
└── supabase_schema.sql # Database Architecture
```

---

*NutriSmart | Prototype Built for Ideathon - Food & Health Track*
