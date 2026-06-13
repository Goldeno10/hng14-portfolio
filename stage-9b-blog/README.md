# Stage 9b — Technical Blog Post

HNG14 final stage: blog post covering one individual task and one team task.

## Contents

| File | Purpose |
|------|---------|
| `medium-post.md` | Full article (Markdown) — **paste into a public GitHub Gist** |
| `linkedin-post.md` | Shorter LinkedIn version — link to your Gist |
| `diagrams/*.mmd` | Mermaid source diagrams |
| `diagrams/*.png` | Rendered diagram images for Medium |

## Topics covered

1. **Individual:** Append-Only Event Store (Stage 8a)
2. **Team:** Clinsight guest user management, limits, and signup migration (`clinical-api`)

## Diagrams

- `event-store-flow.png` — write / read / recovery paths
- `guest-session-flow.png` — session creation, limits, migration
- `guest-upload-count-timing.png` — when `upload_count` increments

### Regenerate PNGs from Mermaid

If you edit `.mmd` files, re-render PNGs:

```bash
cd diagrams
python3 << 'PY'
import base64, urllib.request, pathlib
for mmd in pathlib.Path(".").glob("*.mmd"):
    encoded = base64.urlsafe_b64encode(mmd.read_text().encode()).decode()
    url = f"https://mermaid.ink/img/{encoded}?type=png"
    out = mmd.with_suffix(".png")
    with urllib.request.urlopen(url, timeout=120) as resp:
        out.write_bytes(resp.read())
    print(f"Wrote {out}")
PY
```

Or with local CLI (when npm works):

```bash
npx @mermaid-js/mermaid-cli -i event-store-flow.mmd -o event-store-flow.png
```

## Publish checklist (GitHub Gist)

1. Create a **public gist** at https://gist.github.com
2. Paste contents of `medium-post.md` (images use raw GitHub URLs — works after this repo is pushed)
3. Submit the gist URL on the Stage 9b form
4. Post `linkedin-post.md` on LinkedIn with link to the gist
5. Deadline: **June 13, 2026, 5:00 PM**

## Submission note (for form)

**Stack used (portfolio):** Next.js + Tailwind CSS

**What the portfolio communicates:** What I can build as a backend engineer — real HNG systems, personal contributions, and technical decisions around auth, persistence, performance, and reliability.
