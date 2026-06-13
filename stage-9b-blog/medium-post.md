# Two HNG Tasks That Changed How I Think About Backend Engineering

**Muhammad Baba Ibrahim** · Software & AI/ML Engineer · HNG14 Backend  
Portfolio: https://goldeno10.github.io/ · GitHub: https://github.com/Goldeno10

---

During HNG14, I worked on individual backend stages and a team product MVP. Two tasks stuck with me — not because they were the easiest to finish, but because they forced me to think about failure modes, correctness, and what happens when real users depend on your system.

This post covers:

1. **Append-Only Event Store** (Stage 8a — individual)
2. **Guest user management & migration on Clinsight** (team product — backend feature I implemented)

---

## Task 1: Append-Only Event Store (Individual — Stage 8a)

### What it was

HNG Stage 8a asked backend engineers to prototype infrastructure solutions for a platform hitting scaling walls. I chose the **Append-Only Event Store** brief:

- `events.log` is the database — no SQLite, no JSON rewrites
- One JSON object per line, strictly append-only
- In-memory `Map<id, {offset, length}>` index
- `GET /events/:id` seeks directly to the byte range (no scans)
- Crash recovery: replay log on startup, log recovered count

**Stack:** Python 3.12, FastAPI, Uvicorn.

**Repo:** https://github.com/Goldeno10/event_store

### The problem it was solving

When systems scale, durability and recovery stop being abstract. Databases survive crashes using patterns most of us never implement ourselves: append-only writes, indexes for fast reads, and replay on restart.

This task asked me to build that pattern from scratch.

### How I approached it

![Event store write, read, and recovery flow](https://raw.githubusercontent.com/Goldeno10/hng14-portfolio/main/stage-9b-blog/diagrams/event-store-flow.png)

**Write path:** stamp `id` + `createdAt` → serialize JSON line → append to `events.log` → `fsync` → update in-memory index.

**Read path:** index lookup → `seek(offset)` → `read(length)` → parse JSON. O(1), no scan.

**Recovery:** stream the log on startup, rebuild the index, truncate any partial trailing line from a crash mid-write.

### What broke (and how I fixed it)

**Byte vs character offsets.** My first version used string lengths and text-mode I/O. ASCII worked; unicode (`"café 日本語"`) returned garbled JSON. Fix: measure offsets in **UTF-8 bytes**, use binary mode.

**Partial trailing lines.** A simulated crash left a half-written line that recovery treated as valid. Fix: if the last line has no trailing `\n`, truncate it on startup.

**`fsync` blocking the event loop.** Calling `fsync` inside an async endpoint stalled the server. Fix: offload file I/O to a threadpool with `run_in_threadpool`.

### What I took away

Append-only + fsync survives crashes because old bytes are never touched. Indexes are derived state — replay the log if lost. File I/O correctness depends on bytes, not characters.

### Why I picked it

It made “the database” stop being a black box. I had to reason about partial writes, restart behavior, and whether reads scale with data size.

---

## Task 2: Guest User Management & Migration (Team — Clinsight)

### What it was

**Clinsight** is a Nigeria-first health product: patients upload lab results, OCR extracts values, and AI generates plain-language interpretation.

I implemented **guest user management** on the backend (`clinical-api`): anonymous sessions, usage limits, and **migration of guest data when a user signs up**.

**Live product:** https://clinsight.hng14.com/

### The problem it was solving

The PRD required a guest flow: users can try the product without signing up, but with limits. When they eventually create an account, they must not lose their uploaded case, interpretation, or chat history.

That is a backend identity lifecycle problem — not just “add a signup endpoint.”

### How I approached it

![Guest session lifecycle: create, limits, migration](https://raw.githubusercontent.com/Goldeno10/hng14-portfolio/main/stage-9b-blog/diagrams/guest-session-flow.png)

#### 1. Server-owned guest sessions (Postgres)

Guest identity lives in a `guest_sessions` table, not only in a client cookie:

| Field | Purpose |
|-------|---------|
| `ip_hash` | Hashed client IP (peppered SHA-256) |
| `device_fingerprint` | From `X-Device-Fingerprint` header |
| `chat_count` / `upload_count` | Usage counters |
| `expires_at` | Session TTL (default **1 hour**) |
| `revoked` / `migrated_user_id` | Lifecycle flags |

**Create or reuse:** `POST /api/v1/guest-session` returns an existing active session for the same IP + device fingerprint, or creates a new one. Same device → same session (deduplicated).

**Rate limit:** 30 session-creation requests per hashed IP per hour (Redis fixed window).

#### 2. Guest limitations (config-driven)

From `app/core/config.py`:

| Limit | Default | Enforced on |
|-------|---------|-------------|
| `GUEST_UPLOAD_LIMIT` | **1** | `POST /api/v1/upload` |
| `GUEST_CHAT_MESSAGE_LIMIT` | **3** | Patient chat messages only |
| `GUEST_SESSION_TTL_SECONDS` | **3600** (1 hour) | Session expiry + touch |

Guests send `X-Guest-Session-Id` on protected routes. Authenticated users **cannot** upload with a guest session simultaneously (403 if both JWT and guest header are present).

#### 3. When does the upload count?

This was deliberate: the counter increments **after a successful upload**, not on session creation.

![Guest upload count timing](https://raw.githubusercontent.com/Goldeno10/hng14-portfolio/main/stage-9b-blog/diagrams/guest-upload-count-timing.png)

Flow in `POST /api/v1/upload`:

1. **`can_use(UPLOAD)`** — reject if `upload_count >= GUEST_UPLOAD_LIMIT` (403: *"Upload limit reached. Please sign up to upload more results."*)
2. Validate file type (JPEG, PNG, WebP, PDF) and size (≤ 10MB)
3. Create `MedicalCase` with `guest_session_id` set, store file, enqueue OCR/AI pipeline
4. **`increment_upload()`** — atomic SQL `UPDATE ... WHERE upload_count < limit`

The increment uses `try_increment_counter` in the repository: a conditional update so concurrent requests cannot bypass the limit. A second upload on the same session returns **403**. Tests confirm this (`test_second_guest_upload_returns_403`).

**Chat limits work the same way:** check before the patient message is saved, increment after success. The 4th patient message returns 403 (`test_guest_fourth_patient_message_returns_403`).

#### 4. Migration on signup

When a guest creates an account, their data must move to the authenticated user.

Migration runs on:

- **`POST /api/v1/auth/verify-otp`** — after email verification (accepts `guest_session_id` in body or `X-Guest-Session-Id` header)
- **`GET /api/v1/auth/google/callback`** — guest session ID carried in OAuth state

`GuestSessionManager.migrate()`:

1. **`SELECT ... FOR UPDATE`** on the guest row (row lock)
2. If `migrated_user_id` already set → **idempotent no-op** (no double-attach)
3. Set `MedicalCase.user_id`, clear `case.guest_session_id`
4. Assign `user_id` to orphan chat messages on those cases
5. Set `migrated_user_id`, mark session **revoked**

Tests verify: guest upload → signup → verify OTP with guest session ID → authenticated user can fetch the same case (`test_verify_otp_migrates_guest_case`). Double migration returns `cases_migrated=0` the second time (`test_migrate_twice_is_idempotent`).

### What broke (and how I fixed it)

**Session deduplication vs new devices.** Without IP + fingerprint binding, every page load could mint a new guest session and reset limits. Fix: reuse active session per `(ip_hash, device_fingerprint)`.

**Race on counters.** A naive read-check-write on `upload_count` could allow two uploads under concurrency. Fix: atomic conditional `UPDATE` in Postgres — increment only when `upload_count < limit`.

**Double migration.** Calling migrate twice (e.g. retry on verify-otp) could re-attach or corrupt ownership. Fix: check `migrated_user_id` under row lock; second call is a no-op.

**Wrong session accessing a case.** Guest A cannot read Guest B’s case — enforced on case access by matching `guest_session_id` (403 on mismatch).

### What I took away

- Guest flows need **server-owned state** with explicit counters — client-only limits are not enforceable
- **When** you increment matters: after success, not before validation
- Signup is a **data migration event**, not just auth — design it idempotent from day one
- Product limits (`1 upload`, `3 chats`) are backend contracts that drive conversion to signup

### Why I picked it

I built this feature end-to-end. It was harder than it looked on the PRD: limits, timing, concurrency, migration, and “no data loss on signup” as an acceptance criterion. That is real backend product work.

---

## Closing thought

The event store taught me failure modes at the **byte** level. Guest sessions taught me failure modes at the **identity** level — who owns this case, when does usage count, and what happens when anonymous becomes authenticated.

That is the backend engineer I want to be.

---

**Contact:** ibrahimmuhammad271@gmail.com · [LinkedIn](https://www.linkedin.com/in/muhammad-ib/) · [GitHub](https://github.com/Goldeno10)
