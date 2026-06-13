# LinkedIn post (Stage 9b)

**Use this as the LinkedIn version. Link to your Medium article after publishing.**

---

Two HNG tasks that changed how I build backend systems.

HNG14 Stage 9b — final stage, no code. Just reflection on two projects that stuck.

---

**1. Append-Only Event Store (Individual — Stage 8a)**

I built a minimal event store where the log file *is* the database:
→ Append-only writes to `events.log`
→ In-memory index for O(1) reads by byte offset
→ Crash recovery by replaying the log on startup

What broke:
→ Unicode payloads broke character-based offsets — fixed with UTF-8 byte I/O
→ Simulated crashes left partial lines — fixed with trailing-newline detection + truncate
→ `fsync` blocked FastAPI’s async loop — moved to threadpool

Takeaway: databases aren’t magic. Append + index + replay is how real systems survive crashes.

Repo: https://github.com/Goldeno10/event_store

---

**2. Guest user management on Clinsight (Team — feature I built)**

Clinsight lets users try the product before signup. I implemented the backend guest system:

**Limits (server-enforced):**
→ 1 lab upload per guest session
→ 3 patient chat messages
→ 1-hour session TTL, deduplicated by IP hash + device fingerprint

**When upload counts:** only after a *successful* upload — check limit first, increment atomically after case + file are created. Second upload → 403.

**Migration on signup:** when user verifies OTP or completes Google OAuth, guest cases and chats move to their account. Row-locked, idempotent — no double-attach on retry.

What broke:
→ Counter races under concurrency → atomic SQL UPDATE
→ Duplicate guest sessions per device → reuse by fingerprint
→ Double migration on auth retry → `migrated_user_id` guard under FOR UPDATE

Takeaway: signup is a data migration event, not just authentication.

Live: https://clinsight.hng14.com/

---

Why these two? The event store taught me failure at the byte level. Guest sessions taught me failure at the identity level.

Full write-up with architecture diagrams: [PASTE MEDIUM URL HERE]

#HNG14 #BackendEngineering #SystemDesign #FastAPI #Python

---

**Author:** Muhammad Baba Ibrahim  
Portfolio: https://goldeno10.github.io/
