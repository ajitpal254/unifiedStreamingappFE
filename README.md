# 🎬 Unified Streaming Hub

> A universal discovery, watchlist, and routing platform — helping users search, track, and open content across Netflix, Prime Video, Disney+, YouTube, and more using subscriptions they already hold.

---

## 🧠 Concept

This is **not** a re-streaming app. It's a **streaming operating layer** — a free platform where users configure their country and subscriptions once, search across all services from one place, maintain a single cross-platform watchlist, and launch the right provider app with one click.

---

## ✅ What's Done (Phase 1)

### Infrastructure & Setup
- [x] Monorepo structure (`apps/web`, `apps/api`)
- [x] Next.js 15 frontend (`apps/web`) with TypeScript
- [x] Express.js API backend (`apps/api`) with TypeScript
- [x] Prisma ORM with SQLite (dev) — migration to PostgreSQL next
- [x] `.gitignore` hardened — no secrets, no `.env`, no `.db` files committed

### Authentication
- [x] Clerk integrated for user authentication
- [x] Sign-up and Sign-in pages (`/sign-up`, `/sign-in`)
- [x] Route middleware protecting `/dashboard` and `/onboarding`
- [x] Onboarding page post sign-up

### Dashboard & Watchlist
- [x] Dashboard layout with navigation
- [x] Watchlist page (`/dashboard/watchlist`) with full UI
  - Search and filter controls
  - Tab filtering: All / Movies / Series / Completed
  - Delete items (optimistic UI)
  - Loading and empty states
- [x] Watchlist API (`GET /api/watchlist`, `POST /api/watchlist`, `DELETE /api/watchlist/:id`)
- [x] Prisma schema: `User`, `WatchlistItem`, `Provider` models

---

## 🚧 Upcoming Tasks (Roadmap)

### 🔴 Priority 1 — Database & Auth Hardening
- [ ] Migrate from SQLite → **PostgreSQL** (Neon / Supabase / local)
- [ ] Extract real `userId` from Clerk JWT in the API (remove mock `user_123`)
- [ ] Add `userId` filtering to all watchlist queries (currently returns all items)

### 🟠 Priority 2 — Search & Discovery
- [ ] Integrate **TMDB API** for title metadata, artwork, cast, genres, trailers
- [ ] Integrate **Watchmode API** for streaming availability by provider & region
- [ ] Build universal search page (`/dashboard/search`)
- [ ] Build title detail page (`/dashboard/titles/[id]`)

### 🟡 Priority 3 — Providers & Deep Links
- [ ] Provider selection UI (Netflix, Prime, Disney+, Hulu, Max, YouTube…)
- [ ] Save user's active subscriptions to DB
- [ ] Deep link service — "Watch on Netflix" button routes user to correct provider URL
- [ ] Track outbound click events for analytics

### 🟢 Priority 4 — Recommendations
- [ ] Recommendation feed (`/dashboard/home`) — "Available on your services", "Because you liked…"
- [ ] Rules-based ranking using subscriptions, watchlist, genres, and popularity
- [ ] Country/region filtering

### 🔵 Priority 5 — Polish & Scale
- [ ] Add **Redis** caching for search and availability responses
- [ ] Add **Meilisearch** for fast full-text search
- [ ] Watchlist availability alerts (notifications when a title lands on a subscribed service)
- [ ] Admin panel — sync job visibility, provider health status
- [ ] Mobile app (React Native) — post-MVP

---

## 🗺️ Architecture

```
Client (Next.js)
    │
    ▼
API Gateway (Express / later NestJS)
    │
    ├── User Service       → Prisma + PostgreSQL
    ├── Catalog Service    → TMDB API
    ├── Availability Svc   → Watchmode API
    ├── Recommendation Svc → Rules engine
    ├── DeepLink Service   → Provider URL routing
    └── Notification Svc   → Watchlist alerts
```

**External Data Providers:**
- [TMDB](https://www.themoviedb.org/documentation/api) — Title metadata, artwork, cast
- [Watchmode](https://api.watchmode.com/) — Streaming availability by provider & region
- [YouTube Data API](https://developers.google.com/youtube/v3) — YouTube search and metadata

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, React, TypeScript, Tailwind CSS, shadcn/ui |
| Backend | Node.js, Express (→ NestJS at scale), TypeScript |
| Database | PostgreSQL (dev: SQLite via Prisma) |
| Auth | Clerk |
| Cache | Redis (upcoming) |
| Search | Meilisearch (upcoming) |
| CI/CD | GitHub Actions |
| Hosting | Vercel (frontend), Render/Railway (backend) |

---

## 🚀 Local Development

### Prerequisites
- Node.js 20+
- PostgreSQL (or use the SQLite dev DB for now)

### Frontend
```bash
cd apps/web
cp .env.example .env.local   # Fill in Clerk keys
npm install
npm run dev                  # http://localhost:3000
```

### API
```bash
cd apps/api
cp .env.example .env         # Fill in DATABASE_URL
npm install
npx prisma migrate dev
npm run dev                  # http://localhost:4000
```

---

## 🔐 Environment Variables

**`apps/web/.env.local`**
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

**`apps/api/.env`**
```
DATABASE_URL=postgresql://user:password@localhost:5432/streaming_hub
PORT=4000
```

---

## 📐 Blueprint

This project is built according to the **Unified Streaming Hub Blueprint v2** — a full product spec including executive summary, architecture diagram, service specifications, data flow, non-functional requirements, legal constraints, and a 12-month implementation plan.

---

## ⚖️ Legal Notice

This platform is a **discovery and routing service** only. No content is re-streamed or hosted. Content access depends entirely on the user's own active subscriptions with third-party providers. Provider deeplinks open the official provider app or website.
