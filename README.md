# HNG14 Backend Portfolio (Stage 8b)

A clean, 3–5 minute portfolio page focused on my **backend engineering work during HNG14**.

- **Owner**: Muhammad Baba Ibrahim
- **Role**: Software Engineer · AI/ML Engineer (backend-focused)
- **Timezone**: WAT (UTC+1)
- **Email**: `ibrahimmuhammad271@gmail.com`
- **LinkedIn**: `https://www.linkedin.com/in/muhammad-ib/`
- **GitHub**: `https://github.com/Goldeno10`

---

## Stack

- **Next.js** (App Router)
- **TypeScript**
- **Tailwind CSS** (dark-teal theme)

---

## What this portfolio is meant to communicate

I wanted reviewers to quickly understand **what I can build as a backend engineer**, using real HNG work:

- What I shipped (not buzzwords)
- What I personally implemented
- The engineering decisions behind **auth, data persistence, performance, and reliability**

---

## What’s included

The page is organized to match the Stage 8b requirements:

- **Profile** (who I am, how to reach me)
- **HNG projects** (name, description, stack, my contribution, proof links)
- **Backend skills** (each tied back to a project)
- **Featured deep dive** (problem, request flow, endpoints/modules, one challenge solved)
- **Learning reflection**
- **Contact**

---

## Projects & links referenced on the page

### Insighta Labs+ (HNG Backend Stages 0–4B)

- Web (live): `https://insighta-web-swart.vercel.app/`
- Backend repo: `https://github.com/Goldeno10/insighta-backend`
- Web repo: `https://github.com/Goldeno10/insighta-web`
- CLI repo: `https://github.com/Goldeno10/insighta-cli`

### Stage 8a — Infrastructure prototypes

- Append-only event store repo: `https://github.com/Goldeno10/event_store`
- Notification batcher repo: `https://github.com/Goldeno10/notification_batcher`

### Team product (MVP)

- Clinsight (live): `https://clinsight.hng14.com/`

---

## Run locally

### Requirements

- Node.js installed

### Install

If your environment has working DNS/internet:

```bash
npm install
```

If DNS/internet is unavailable (common in locked-down environments), this workspace was set up to work with a **local `node_modules` symlink**:

```bash
ln -s /home/goldeno/Documents/Projects/insighta-web/node_modules node_modules
```

### Dev

```bash
npm run dev -- --port 3005
```

Open `http://localhost:3005`.

### Build

```bash
npm run build
```

> Note: the scripts force **webpack** (`--webpack`) because Turbopack can reject `node_modules` symlinks.

---

## Customize

Edit the content in:

- `src/app/page.tsx`

---

