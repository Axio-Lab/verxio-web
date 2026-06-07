# Verxio Web

Browser product shell for [Verxio](https://github.com/Axio-Lab/verxio-web) — a branded UI over the [Hermes Agent](https://github.com/NousResearch/hermes-agent) runtime.

Ported from `hermes-agent/apps/desktop` (Vite + React + Tailwind). The Python agent engine stays in a separate Hermes clone; this repo is UI only.

## Prerequisites

- Node.js ≥ 20
- A local [Hermes Agent](https://github.com/NousResearch/hermes-agent) clone with `venv` set up
- `hermes dashboard` running (FastAPI + WebSocket on port 9119)

## Local development

```bash
# Terminal 1 — Hermes backend (from your hermes-agent clone)
cd ../hermes-agent
source venv/bin/activate
hermes dashboard --no-open

# Terminal 2 — Verxio Web
npm install
npm run dev
```

Open `http://127.0.0.1:5180`.

The Vite dev server proxies `/api` to `http://127.0.0.1:9119` and injects the dashboard session token automatically.

## Environment

Copy `.env.example` to `.env` if you need a non-default dashboard URL:

```bash
HERMES_DASHBOARD_URL=http://127.0.0.1:9119
```

## Implementation phases

See [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) for the full desktop → Verxio port roadmap. Each phase gets its own commit.

## Related repos

| Repo | Role |
|------|------|
| `hermes-agent` | AI engine (agent loop, tools, gateway) |
| `verxio-web` (this) | Product UI |
| `verxio-api` | Optional BFF / run API (separate from chat UI) |

## License

MIT
