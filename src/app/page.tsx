import {
  ArrowRight,
  BookOpen,
  Briefcase,
  GitBranch,
  Globe,
  GraduationCap,
  Link as LinkIcon,
  Mail,
  Phone,
  Sparkles,
  User,
  Wrench,
} from "lucide-react";

type ProofLink = {
  label: string;
  href?: string;
  note?: string;
  kind?: "github" | "live" | "doc" | "link";
};

type Project = {
  id: string;
  name: string;
  description: string;
  stack: string[];
  built: string;
  proof: ProofLink[];
  skills: string[];
};

const projects: Project[] = [
  {
    id: "insighta",
    name: "Insighta Labs+ (HNG Backend Stages 0–4B)",
    description:
      "A demographic intelligence API and query engine with GitHub OAuth (PKCE), RBAC, CLI + web clients, deterministic query parsing/normalization, caching, and streaming CSV ingestion.",
    stack: ["Next.js (API routes)", "PostgreSQL (Neon)", "Redis (Upstash)", "Prisma", "OAuth2 PKCE"],
    built:
      "Designed and implemented the backend API surface (profiles CRUD, advanced filtering/sorting/pagination, rule-based search), auth/token handling, RBAC enforcement, caching + cache invalidation, and large CSV import behavior/response shape.",
    proof: [
      { label: "Backend repo", href: "https://github.com/Goldeno10/insighta-backend", kind: "github" },
      { label: "CLI repo", href: "https://github.com/Goldeno10/insighta-cli", kind: "github" },
      { label: "Web repo", href: "https://github.com/Goldeno10/insighta-web", kind: "github" },
      { label: "Live web", href: "https://insighta-web-swart.vercel.app/", kind: "live" },
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
      { label: "Repo", href: "https://github.com/Goldeno10/event_store", kind: "github" },
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
        label: "Repo",
        href: "https://github.com/Goldeno10/notification_batcher",
        kind: "github",
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
    proof: [
      { label: "Live product", href: "https://clinsight.hng14.com/", kind: "live" },
      { label: "PRD", note: "Provided in task prompt (Clinsight MVP 1.0)", kind: "doc" },
    ],
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
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[var(--card-border)] bg-[color:var(--card)] p-6 shadow-[0_0_0_1px_rgba(0,0,0,0.02)] backdrop-blur">
      <div className="flex items-center gap-2">
        {icon ? (
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-teal-300/15 bg-black/10 text-teal-200/80">
            {icon}
          </span>
        ) : null}
        <h2 className="text-base font-semibold tracking-tight text-teal-50">
          {title}
        </h2>
      </div>
      <div className="mt-4 text-sm leading-relaxed text-teal-50/80">
        {children}
      </div>
    </section>
  );
}

function ExternalLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={
        className ??
        "text-teal-200/80 underline decoration-teal-300/25 underline-offset-4 hover:text-teal-200 hover:decoration-teal-200/60"
      }
    >
      {children}
    </a>
  );
}

function MaybeLink({ value }: { value: string }) {
  const isUrl = /^https?:\/\//i.test(value);
  const isMail = /^mailto:/i.test(value);
  const isTel = /^tel:/i.test(value);
  if (isUrl || isMail || isTel) return <ExternalLink href={value}>{value}</ExternalLink>;
  return <span className="text-teal-50/70">{value}</span>;
}

function ButtonLink({
  href,
  icon,
  children,
  variant = "primary",
}: {
  href: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  const cls =
    variant === "primary"
      ? "bg-teal-400/15 text-teal-50 ring-1 ring-teal-200/25 hover:bg-teal-400/20 hover:ring-teal-200/35"
      : "bg-black/10 text-teal-50/85 ring-1 ring-teal-200/15 hover:bg-black/15 hover:ring-teal-200/25";

  return (
    <ExternalLink
      href={href}
      className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition ${cls}`}
    >
      {icon ? <span className="text-teal-200/80">{icon}</span> : null}
      <span>{children}</span>
      <ArrowRight size={16} className="ml-0.5 text-teal-200/60" aria-hidden />
    </ExternalLink>
  );
}

function ProofBadge({ item }: { item: ProofLink }) {
  const icon =
    item.kind === "github" ? (
      <GitBranch size={16} aria-hidden />
    ) : item.kind === "live" ? (
      <Globe size={16} aria-hidden />
    ) : item.kind === "doc" ? (
      <BookOpen size={16} aria-hidden />
    ) : (
      <LinkIcon size={16} aria-hidden />
    );

  if (item.href) {
    return (
      <ExternalLink
        href={item.href}
        className="inline-flex items-center gap-2 rounded-full border border-teal-300/15 bg-black/10 px-3 py-1.5 text-xs font-medium text-teal-50/85 transition hover:border-teal-200/30 hover:bg-black/15"
      >
        <span className="text-teal-200/75">{icon}</span>
        <span>{item.label}</span>
      </ExternalLink>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-teal-300/15 bg-black/10 px-3 py-1.5 text-xs font-medium text-teal-50/75">
      <span className="text-teal-200/60">{icon}</span>
      <span>{item.label}</span>
    </span>
  );
}

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-10 md:px-8 md:py-14">
      <header className="relative overflow-hidden rounded-3xl border border-[var(--card-border)] bg-[color:var(--card)] p-7 shadow-[0_0_0_1px_rgba(0,0,0,0.02)] backdrop-blur md:p-10">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute -left-20 -top-24 h-72 w-72 rounded-full bg-teal-400/10 blur-3xl" />
          <div className="absolute -right-20 -top-28 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="absolute -bottom-36 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-teal-300/10 blur-3xl" />
        </div>

        <div className="relative">
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-teal-300/15 bg-black/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-teal-200/70">
                <Sparkles size={14} aria-hidden />
                HNG14 · Backend portfolio
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-teal-300/10 bg-black/10 px-3 py-1.5 text-xs text-teal-50/70">
                <span className="text-teal-200/60">Timezone</span> WAT (UTC+1)
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-teal-50 md:text-4xl">
                Muhammad Baba Ibrahim
              </h1>
              <p className="text-sm text-teal-50/75 md:text-base">
                Software Engineer · AI/ML Engineer · Backend-focused systems
              </p>
              <p className="max-w-3xl text-sm leading-relaxed text-teal-50/70">
                I build backend systems with clear, testable behavior: secure auth,
                deterministic request parsing, reliable data flows, and pragmatic
                performance work. This page is designed to be reviewed in 3–5
                minutes and leave no ambiguity about what I shipped.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <ButtonLink
                href="mailto:ibrahimmuhammad271@gmail.com"
                icon={<Mail size={16} aria-hidden />}
              >
                Email
              </ButtonLink>
              <ButtonLink
                href="https://www.linkedin.com/in/muhammad-ib/"
                variant="secondary"
                icon={<LinkIcon size={16} aria-hidden />}
              >
                LinkedIn
              </ButtonLink>
              <ButtonLink
                href="https://github.com/Goldeno10"
                variant="secondary"
                icon={<GitBranch size={16} aria-hidden />}
              >
                GitHub
              </ButtonLink>
              <ButtonLink
                href="tel:+2347013013462"
                variant="secondary"
                icon={<Phone size={16} aria-hidden />}
              >
                Call
              </ButtonLink>
            </div>
          </div>
        </div>
      </header>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Card title="Profile" icon={<User size={18} aria-hidden />}>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-teal-300/15 bg-black/10 text-sm font-semibold text-teal-50">
                MBI
              </div>
              <div className="min-w-0">
                <p className="text-base font-semibold leading-tight text-teal-50">
                  Muhammad Baba Ibrahim
                </p>
                <p className="mt-1 text-sm text-teal-50/70">
                  Software Engineer · AI/ML Engineer
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Pill>Backend</Pill>
                  <Pill>APIs</Pill>
                  <Pill>Auth</Pill>
                  <Pill>Databases</Pill>
                  <Pill>Performance</Pill>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-teal-300/15 bg-black/10 p-4">
              <div className="grid gap-2 text-sm">
                <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="text-teal-200/70">Timezone</span>
                  <span className="text-teal-50/80">WAT (UTC+1)</span>
                </p>
                <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="text-teal-200/70">Email</span>
                  <ExternalLink href="mailto:ibrahimmuhammad271@gmail.com">
                    ibrahimmuhammad271@gmail.com
                  </ExternalLink>
                </p>
                <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="text-teal-200/70">LinkedIn</span>
                  <ExternalLink href="https://www.linkedin.com/in/muhammad-ib/">
                    linkedin.com/in/muhammad-ib
                  </ExternalLink>
                </p>
                <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="text-teal-200/70">GitHub</span>
                  <ExternalLink href="https://github.com/Goldeno10">
                    github.com/Goldeno10
                  </ExternalLink>
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-200/70">
                Highlights
              </p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-teal-50/75">
                <li>
                  Backend systems with clear contracts: validation, response
                  shapes, and deterministic request parsing.
                </li>
                <li>
                  Security + reliability: OAuth2 PKCE, RBAC enforcement, and
                  crash-safe persistence patterns.
                </li>
                <li>
                  Performance work that’s explainable: indexing, caching, and
                  safe invalidation under load.
                </li>
              </ul>
            </div>
          </div>
        </Card>

        <Card title="Submission note (Stage 8b)" icon={<BookOpen size={18} aria-hidden />}>
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
          <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight text-teal-50">
            <Briefcase size={18} className="text-teal-200/75" aria-hidden />
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
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.proof.map((item) => (
                      <ProofBadge key={item.label} item={item} />
                    ))}
                  </div>
                  {p.proof.some((x) => x.note) ? (
                    <ul className="mt-3 space-y-1 text-sm text-teal-50/70">
                      {p.proof
                        .filter((x) => x.note)
                        .map((x) => (
                          <li key={`${p.id}-${x.label}-note`}>
                            <span className="text-teal-50/85">{x.label}:</span>{" "}
                            <span className="text-teal-50/65">{x.note}</span>
                          </li>
                        ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <Card title="Backend skills (with evidence)" icon={<Wrench size={18} aria-hidden />}>
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

        <Card title={featured.name} icon={<Sparkles size={18} aria-hidden />}>
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
        <Card title="Learning reflection" icon={<GraduationCap size={18} aria-hidden />}>
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

        <Card title="Contact" icon={<Mail size={18} aria-hidden />}>
          <div className="space-y-3">
            <p className="text-teal-50/70">
              If you want to discuss any of the projects above (especially the
              event store or the Insighta scaling work), reach me here:
            </p>
            <div className="rounded-xl border border-teal-300/15 bg-black/10 p-4">
              <p className="text-sm text-teal-50/80">
                <span className="text-teal-200/70">Email:</span>{" "}
                <MaybeLink value="mailto:ibrahimmuhammad271@gmail.com" />
              </p>
              <p className="mt-2 text-sm text-teal-50/80">
                <span className="text-teal-200/70">LinkedIn:</span>{" "}
                <MaybeLink value="https://www.linkedin.com/in/muhammad-ib/" />
              </p>
              <p className="mt-2 text-sm text-teal-50/80">
                <span className="text-teal-200/70">GitHub:</span>{" "}
                <MaybeLink value="https://github.com/Goldeno10" />
              </p>
              <p className="mt-2 text-sm text-teal-50/80">
                <span className="text-teal-200/70">Phone:</span>{" "}
                <MaybeLink value="tel:+2347013013462" />
              </p>
            </div>
          </div>
        </Card>
      </section>

      <footer className="mt-12 border-t border-teal-300/10 pt-6 text-xs text-teal-200/55">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} Muhammad Baba Ibrahim · HNG14 Backend ·
            Stage 8b
          </p>
          <p className="text-teal-200/45">
            Built with Next.js + Tailwind CSS · Dark-teal theme
          </p>
        </div>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
          <ExternalLink href="mailto:ibrahimmuhammad271@gmail.com">Email</ExternalLink>
          <ExternalLink href="https://www.linkedin.com/in/muhammad-ib/">LinkedIn</ExternalLink>
          <ExternalLink href="https://github.com/Goldeno10">GitHub</ExternalLink>
          <ExternalLink href="tel:+2347013013462">Phone</ExternalLink>
        </div>
      </footer>
    </main>
  );
}

