# 🎬 Unified Streaming Hub

> A universal discovery, watchlist, and routing platform — helping users search, track, and open content across Netflix, Prime Video, Disney+, YouTube, and more using subscriptions they already hold.

---

## 🧠 Concept

This is **not** a re-streaming app. It's a **streaming operating layer** — a free platform where users configure their country and subscriptions once, search across all services from one place, maintain a single cross-platform watchlist, and launch the right provider app with one click.

---

## ✅ What's Done

### Infrastructure & Setup
- [x] Monorepo structure (`apps/web`, `apps/api`)
- [x] Next.js 16 frontend (`apps/web`) with TypeScript
- [x] Express.js API backend (`apps/api`) with TypeScript
- [x] Prisma ORM — migrated to **PostgreSQL**
- [x] `.gitignore` hardened — no secrets, no `.env`, no `.db` or `.pdf` files committed

### Authentication
- [x] Clerk integrated for user authentication
- [x] Sign-up and Sign-in pages (`/sign-up`, `/sign-in`)
- [x] Route protection via `proxy.ts` (Next.js 16 convention) — `/dashboard` and `/onboarding` are gated
- [x] Onboarding page post sign-up
- [x] Real Clerk `userId` extracted from JWT on every API request (no mock users)
- [x] Lazy user sync — user row created in PostgreSQL on first API call (`GET /api/watchlist`)
- [x] `GET /api/me` endpoint for explicit user sync

### Account Management
- [x] `/dashboard/settings` — full account settings page using Clerk `<UserProfile />`
  - Edit name and avatar
  - Manage email addresses
  - **Add a password** (even after signing up with Google/GitHub SSO)
  - Two-factor authentication
  - Active session management
  - Manage connected OAuth accounts
- [x] **My Subscriptions** — select active services (Netflix, Prime, etc.)
  - Persistent storage in PostgreSQL
  - Real-time auto-sync

### Search & Discovery
- [x] **TMDB API Integration** — search 1M+ titles with real-time metadata
- [x] **Watchmode API Integration** — live streaming availability check
- [x] **"Unified" Experience** — titles are highlighted if available on the user's active subscriptions
- [x] Dashboard search page (`/dashboard/search`) with trending fallback
- [x] Title detail page (`/dashboard/titles/[type]/[id]`)
  - Immersive hero section with backdrops
  - Cast gallery and director info
  - Direct links to streaming platforms
  - Trailer integration (YouTube)

---

## 🚧 Roadmap

### 🔴 Priority 1 — Search & Discovery
- [ ] Integrate **TMDB API** for title metadata, artwork, cast, genres, trailers
- [ ] Integrate **Watchmode API** for streaming availability by provider & region
- [ ] Build universal search page (`/dashboard/search`)
- [ ] Build title detail page (`/dashboard/titles/[id]`)

### 🟠 Priority 2 — Providers & Deep Links
- [ ] Provider selection UI — Netflix, Prime, Disney+, Hulu, Max, YouTube…
- [ ] Save user's active subscriptions to DB
- [x] Deep link service — "Watch on Netflix" button routes to correct provider URL
- [x] Track outbound click events for analytics

### 🟡 Priority 3 — Recommendations
- [x] Recommendation feed (`/dashboard`) — "Available on your services", "Because you liked…"
- [ ] Rules-based ranking using subscriptions, watchlist, genres, and popularity
- [ ] Country/region filtering

### 🟢 Priority 4 — Infrastructure & Scale
- [ ] **Clerk Webhooks** — sync users to DB instantly on sign-up (replaces lazy sync)
- [ ] Add **Redis** caching for search and availability responses
- [ ] Add **Meilisearch** for fast full-text search
- [ ] Watchlist availability alerts (notifications when a title lands on a subscribed service)
- [ ] Admin panel — sync job visibility, provider health status
- [ ] Mobile app (React Native) — post-MVP

---

## 🗺️ Architecture

```
Client (Next.js 16)
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
| Frontend | Next.js 16, React, TypeScript, Tailwind CSS, shadcn/ui |
| Backend | Node.js, Express (→ NestJS at scale), TypeScript |
| Database | PostgreSQL via Prisma ORM |
| Auth | Clerk (SSO + password, JWT verification) |
| Cache | Redis (upcoming) |
| Search | Meilisearch (upcoming) |
| CI/CD | GitHub Actions (upcoming) |
| Hosting | Vercel (frontend), Render/Railway (backend) |

---

## 🚀 Local Development

### Prerequisites
- Node.js 20+
- PostgreSQL 14+ installed and running

### Frontend
```bash
cd apps/web
# Create .env with your Clerk keys (see Environment Variables below)
npm install
npm run dev                  # http://localhost:3000
```

### API
```bash
cd apps/api
# Create .env with your DATABASE_URL and Clerk keys
npm install
npx prisma migrate dev --name init_postgresql
npm run dev                  # http://localhost:4000
```

---

## 🔐 Environment Variables

**`apps/web/.env`**
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_API_URL=http://localhost:4000
```

**`apps/api/.env`**
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/streaming_hub
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
FRONTEND_URL=http://localhost:3000
PORT=4000
```

> Keys are available at [dashboard.clerk.com](https://dashboard.clerk.com) → your app → API Keys.

---

## 📐 Blueprint

This project is built according to the **Unified Streaming Hub Blueprint v2** — a full product spec including executive summary, architecture diagram, service specifications, data flow, non-functional requirements, legal constraints, and a 12-month implementation plan.

---

## ⚖️ Legal Notice

This platform is a **discovery and routing service** only. No content is re-streamed or hosted. Content access depends entirely on the user's own active subscriptions with third-party providers. Provider deeplinks open the official provider app or website.
