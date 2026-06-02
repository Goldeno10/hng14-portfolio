const projects = [
  {
    id: "insighta",
    name: "Insighta Labs+ (HNG Backend Stages 0–4B)",
    description:
      "A demographic intelligence API and query engine with GitHub OAuth (PKCE), RBAC, CLI + web clients, deterministic query parsing/normalization, caching, and streaming CSV ingestion.",
    stack: ["Next.js (API routes)", "PostgreSQL (Neon)", "Redis (Upstash)", "Prisma", "OAuth2 PKCE"],
    built:
      "Designed and implemented the backend API surface (profiles CRUD, advanced filtering/sorting/pagination, rule-based search), auth/token handling, RBAC enforcement, caching + cache invalidation, and large CSV import behavior/response shape.",
    proof: [
      { label: "Backend repo", note: "Local: /home/goldeno/Documents/Projects/insighta-backend" },
      { label: "CLI repo", note: "Local: /home/goldeno/Documents/Projects/insighta-cli" },
      { label: "Web repo", note: "Local: /home/goldeno/Documents/Projects/insighta-web" },
    ],
    skills: [
      "API design",
      "Authentication (OAuth2 PKCE)",
      "RBAC",
      "PostgreSQL indexing",
      "Caching + invalidation",
      "Query normalization",
      "Streaming ingestion",
      "Documentation",
    ],
  },
  {
    id: "event-store",
    name: "Append-Only Event Store (Stage 8a — Infrastructure)",
    description:
      "An append-only log-backed event store where the log file is the database. Writes append one JSON object per line; reads seek directly by byte offset using an in-memory index; crash recovery rebuilds the index by replaying the log at startup.",
    stack: ["Python 3.12", "FastAPI", "Uvicorn", "Append-only file I/O"],
    built:
      "Implemented append-only write path, byte-accurate (offset,length) index, direct seek reads (no scans), and crash recovery (replay + truncate partial trailing line).",
    proof: [
      { label: "README", note: "Local: /home/goldeno/Documents/Projects/hng14_be_stage_8/event_store/README.md" },
    ],
    skills: ["Durability reasoning", "File I/O (byte offsets)", "Crash recovery", "Testing"],
  },
  {
    id: "notification-batcher",
    name: "Notification Batcher (Stage 8a — Infrastructure)",
    description:
      "A notification service that automatically switches between individual vs grouped notifications based on a true sliding 60s per-post like rate. Buffers likes per post and flushes a grouped notification on a timer.",
    stack: ["Python 3.12", "FastAPI", "SQLite", "Timers + in-memory buffers"],
    built:
      "Implemented sliding-window rate counting, per-post buffer, single flush-timer lifecycle, hysteresis to prevent threshold thrashing, and strict notifications.log format.",
    proof: [
      {
        label: "README",
        note: "Local: /home/goldeno/Documents/Projects/hng14_be_stage_8/notification_batcher/README.md",
      },
    ],
    skills: ["Rate limiting (sliding window)", "Background jobs/timers", "Concurrency safety", "SQLite durability"],
  },
  {
    id: "clinsight",
    name: "Clinsight (Team Product — MVP)",
    description:
      "A Nigeria-first product that turns lab results into plain-language interpretations and (post-MVP) supports verified doctor reviews. MVP includes upload, OCR extraction, interpretation history, and notifications when analysis completes.",
    stack: ["Backend services", "File upload + processing", "Notifications (MVP)"],
    built:
      "Contributed as a backend engineer on the team MVP—working on backend endpoints, integrations, and reliability constraints needed for upload/processing and notification-style flows.",
    proof: [{ label: "PRD", note: "Provided in task prompt (Clinsight MVP 1.0)" }],
    skills: ["Backend API design", "Asynchronous processing patterns", "Safety constraints (non-prescriptive output)"],
  },
];

const featured = {
  name: "Featured deep dive: Append-Only Event Store",
  problem:
    "When systems scale, durability and recovery matter. This project demonstrates a minimal, practical pattern used by real databases: append-only storage + indexing + replay on restart.",
  requestFlow: [
    "POST /events → validate + stamp id/createdAt → serialize JSON line → append to events.log → fsync → update in-memory index",
    "GET /events/:id → index lookup → seek(offset) → read(length) → parse JSON → return event",
    "Startup → stream events.log line-by-line → rebuild index → truncate partial trailing line (crash mid-write) → log recovered count",
  ],
  keyEndpoints: [
    { route: "POST /events", note: "Append a single JSON-line event." },
    { route: "GET /events/:id", note: "Direct seek read by byte range." },
    { route: "GET /stats", note: "Sanity stats (count, bytes)." },
  ],
  challenge:
    "Tracking offsets in characters instead of bytes breaks correctness with UTF‑8 payloads (e.g., emoji or non‑Latin text).",
  solution:
    "Measure offsets/lengths strictly in UTF‑8 bytes and perform file I/O in binary mode. The index stores (offset,length) in bytes, so seek/read returns the exact record regardless of unicode content.",
};

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-teal-300/20 bg-teal-200/5 px-2.5 py-1 text-xs text-teal-50/85">
      {children}
    </span>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[var(--card-border)] bg-[color:var(--card)] p-6 shadow-[0_0_0_1px_rgba(0,0,0,0.02)] backdrop-blur">
      <h2 className="text-base font-semibold tracking-tight text-teal-50">
        {title}
      </h2>
      <div className="mt-4 text-sm leading-relaxed text-teal-50/80">
        {children}
      </div>
    </section>
  );
}

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-12 md:px-8 md:py-16">
      <header className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200/70">
            HNG14 · Backend Engineer Portfolio
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-teal-50 md:text-4xl">
            Backend work, clearly explained.
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-teal-50/70">
            This page summarizes the backend systems I built during the HNG
            internship and what I can build under real constraints: API design,
            auth, data modeling, performance work, background processing, and
            operational correctness.
          </p>
        </div>
      </header>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Card title="Profile">
          <div className="space-y-3">
            <div>
              <p className="font-medium text-teal-50">Goldeno</p>
              <p className="text-teal-50/70">
                Backend Engineer · HNG14 Internship
              </p>
            </div>
            <div className="grid gap-2 text-sm">
              <p>
                <span className="text-teal-200/70">Timezone:</span>{" "}
                <span className="text-teal-50/85">WAT (UTC+1)</span>
              </p>
              <p>
                <span className="text-teal-200/70">GitHub:</span>{" "}
                <span className="text-teal-50/85">@Goldeno10</span>
              </p>
              <p>
                <span className="text-teal-200/70">Contact:</span>{" "}
                <span className="text-teal-50/85">
                  (add your email + LinkedIn here)
                </span>
              </p>
            </div>
            <p className="text-teal-50/70">
              I focus on building reliable APIs with clear behavior: strict input
              validation, deterministic parsing, careful caching, and pragmatic
              performance improvements.
            </p>
          </div>
        </Card>

        <Card title="Submission note (Stage 8b)">
          <div className="space-y-3">
            <p>
              <span className="text-teal-200/70">Stack used:</span>{" "}
              <span className="text-teal-50/85">Next.js + Tailwind CSS</span>
            </p>
            <p className="text-teal-50/70">
              Intent: a reviewer should understand what I built, what trade-offs
              I made, and the backend skills I can apply in production—within a
              3–5 minute skim.
            </p>
          </div>
        </Card>
      </div>

      <section className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-lg font-semibold tracking-tight text-teal-50">
            HNG Projects
          </h2>
          <p className="text-xs text-teal-200/60">
            Each project includes stack + what I personally built.
          </p>
        </div>

        <div className="mt-5 grid gap-6">
          {projects.map((p) => (
            <section
              key={p.id}
              className="rounded-2xl border border-[var(--card-border)] bg-[color:var(--card)] p-6 backdrop-blur"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-teal-50">
                    {p.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-teal-50/75">
                    {p.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {p.stack.map((s) => (
                  <Pill key={s}>{s}</Pill>
                ))}
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-teal-300/15 bg-black/10 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-200/70">
                    What I built
                  </p>
                  <p className="mt-2 text-sm text-teal-50/80">{p.built}</p>
                </div>
                <div className="rounded-xl border border-teal-300/15 bg-black/10 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-200/70">
                    Proof / notes
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-teal-50/75">
                    {p.proof.map((pr) => (
                      <li key={pr.label}>
                        <span className="text-teal-50/90">{pr.label}:</span>{" "}
                        <span className="text-teal-50/70">{pr.note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <Card title="Backend skills (with evidence)">
          <div className="space-y-4">
            <p className="text-teal-50/70">
              Each skill below maps back to at least one project above.
            </p>
            <div className="grid gap-3">
              {[
                {
                  skill: "API design + validation",
                  evidence: "Insighta Labs+; Notification Batcher endpoints",
                },
                {
                  skill: "Authentication (OAuth2 PKCE) + sessions",
                  evidence: "Insighta Labs+ (CLI + web clients)",
                },
                {
                  skill: "RBAC enforcement",
                  evidence: "Insighta Labs+ (admin vs analyst)",
                },
                {
                  skill: "Databases + indexing",
                  evidence: "Insighta Labs+ (Postgres indexes for read paths)",
                },
                {
                  skill: "Caching + invalidation",
                  evidence: "Insighta Labs+ (Redis response caching + version keys)",
                },
                {
                  skill: "Background jobs / timers",
                  evidence: "Notification Batcher (flush timers, hysteresis)",
                },
                {
                  skill: "Durability + crash recovery",
                  evidence: "Append-Only Event Store (replay + truncate partial line)",
                },
                {
                  skill: "Testing time-dependent logic",
                  evidence: "Notification Batcher tests (clock injection, small intervals)",
                },
              ].map((row) => (
                <div
                  key={row.skill}
                  className="rounded-xl border border-teal-300/15 bg-black/10 p-4"
                >
                  <p className="font-medium text-teal-50">{row.skill}</p>
                  <p className="mt-1 text-sm text-teal-50/70">{row.evidence}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card title={featured.name}>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-teal-50">Problem</p>
              <p className="mt-1 text-teal-50/70">{featured.problem}</p>
            </div>

            <div>
              <p className="text-sm font-semibold text-teal-50">
                Architecture / request flow
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-teal-50/75">
                {featured.requestFlow.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-sm font-semibold text-teal-50">
                Key endpoints / modules
              </p>
              <ul className="mt-2 space-y-1 text-teal-50/75">
                {featured.keyEndpoints.map((e) => (
                  <li key={e.route}>
                    <span className="text-teal-50/90">{e.route}</span>{" "}
                    <span className="text-teal-50/65">— {e.note}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-teal-300/15 bg-black/10 p-4">
              <p className="text-sm font-semibold text-teal-50">
                One challenge + how I solved it
              </p>
              <p className="mt-2 text-sm text-teal-50/70">
                <span className="text-teal-50/90">Challenge:</span>{" "}
                {featured.challenge}
              </p>
              <p className="mt-2 text-sm text-teal-50/70">
                <span className="text-teal-50/90">Solution:</span>{" "}
                {featured.solution}
              </p>
            </div>
          </div>
        </Card>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <Card title="Learning reflection">
          <div className="space-y-3">
            <p className="text-teal-50/70">
              During HNG, I improved most in areas that show up under scale and
              pressure:
            </p>
            <ul className="list-disc space-y-1 pl-5 text-teal-50/75">
              <li>
                I learned to treat behavior as a contract: response shapes,
                edge-cases, and deterministic parsing (no “magic” interpretation).
              </li>
              <li>
                I got more deliberate about performance: index-first thinking,
                cache keys, and invalidation correctness (not just “add Redis”).
              </li>
              <li>
                I became more careful about operational failure modes: restarts,
                partial writes, time-based logic, and concurrency safety.
              </li>
            </ul>
          </div>
        </Card>

        <Card title="Contact">
          <div className="space-y-3">
            <p className="text-teal-50/70">
              If you want to discuss any of the projects above (especially the
              event store or the Insighta scaling work), reach me here:
            </p>
            <div className="rounded-xl border border-teal-300/15 bg-black/10 p-4">
              <p className="text-sm text-teal-50/80">
                <span className="text-teal-200/70">Email:</span> add-email-here
              </p>
              <p className="mt-2 text-sm text-teal-50/80">
                <span className="text-teal-200/70">LinkedIn:</span>{" "}
                add-link-here
              </p>
              <p className="mt-2 text-sm text-teal-50/80">
                <span className="text-teal-200/70">GitHub:</span> @Goldeno10
              </p>
            </div>
            <p className="text-xs text-teal-200/55">
              Tip: update the placeholders above before submitting.
            </p>
          </div>
        </Card>
      </section>

      <footer className="mt-12 border-t border-teal-300/10 pt-6 text-xs text-teal-200/55">
        Built with Next.js + Tailwind CSS · Dark-teal theme · Designed for a 3–5
        minute review.
      </footer>
    </main>
  );
}

