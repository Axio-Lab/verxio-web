# Verxio Web

Browser product UI for **Verxio** — built on the open agent runtime (upstream desktop app). Talks to the **Verxio** backend via `hermes dashboard` (REST + WebSocket).

## Architecture

```text
Browser (verxio-web :5180 dev)
    → hermes dashboard (:9119)
    → tui_gateway → AIAgent → tools → LLM
```

## Prerequisites

- Node.js ≥ 20
- Agent runtime clone with Python venv (`hermes-agent` repo)
- `hermes dashboard` running

## Local development

```bash
# Terminal 1 — Verxio backend
cd ../hermes-agent   # or your agent runtime clone path
source venv/bin/activate
hermes dashboard --no-open

# Terminal 2 — Verxio Web
npm install
npm run dev
```

Open **http://127.0.0.1:5180**

Vite proxies `/api` and WebSockets to `http://127.0.0.1:9119` and injects the dashboard session token.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server with HMR |
| `npm run build` | Production build → `dist/` |
| `npm run type-check` | TypeScript |
| `npm run lint` | ESLint |
| `npm run test:ui` | Vitest |

## Production

See [DEPLOY.md](./DEPLOY.md).

## Implementation phases

See [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md). Phases 0–8 are complete.

## Related

| Repo | Role |
|------|------|
| [hermes-agent](https://github.com/NousResearch/hermes-agent) | Upstream AI engine (CLI: `hermes dashboard`) |
| [verxio-api](https://github.com/Axio-Lab/verxio-api) | Optional BFF |

## License

MIT
