# Verxio Web — Desktop Port Implementation Plan

Port `hermes-agent/apps/desktop` into this repo as a browser-native Verxio product. Hermes Python stays upstream; only the UI lives here.

**Backend contract:** `hermes dashboard` on `:9119` — REST `/api/*` + WebSocket `/api/ws` (JSON-RPC, same as desktop Electron shell).

**Commit rule:** One git commit per completed phase below.

---

## Architecture

```text
Browser (verxio-web, Vite :5180)
    │  REST /api/*
    │  WebSocket /api/ws
    ▼
hermes dashboard (:9119)
    ▼
tui_gateway → AIAgent → tools → LLM
```

---

## Phase 0 — Scaffold ✅

**Goal:** Runnable Vite app that proves dashboard connectivity.

**Deliverables:**
- [x] Vite + React 19 + TypeScript + Tailwind v4
- [x] Dev proxy to Hermes dashboard
- [x] Session token injection for dev
- [x] Health check shell UI
- [x] Repo under Axio-Lab

**Commit:** `chore: scaffold verxio-web phase 0 vite shell`

**Verify:**
```bash
hermes dashboard --no-open   # terminal 1
npm run dev                  # terminal 2 → green health on :5180
```

---

## Phase 1 — Tooling & design foundation

**Goal:** Match desktop dev ergonomics and theme system before porting features.

**Tasks:**
1. Copy `apps/desktop` toolchain configs:
   - ESLint, Prettier, `tsconfig` paths
   - Vitest setup
2. Port `src/styles.css` + `src/themes/` from desktop (full design tokens)
3. Port `src/i18n/` skeleton (English only first; rename product strings to Verxio)
4. Add `src/lib/query-client.ts`, providers in `main.tsx`:
   - `QueryClientProvider`, `ThemeProvider`, `I18nProvider`
5. Vendor `@hermes/shared` via `file:../hermes-agent/apps/shared` (document sibling clone in README)
6. Add `src/lib/utils.ts` (`cn()`), basic UI primitives or wire `@nous-research/ui`

**Do not port yet:** Chat, Electron bridges, install overlay.

**Commit:** `feat: phase 1 design system and dev tooling`

**Verify:** `npm run type-check && npm run dev` — themed shell, no runtime errors.

---

## Phase 2 — Gateway client & connection boot

**Goal:** Browser can open a WebSocket JSON-RPC session like desktop.

**Source files to port/adapt:**
- `apps/desktop/src/hermes.ts` → `src/lib/hermes-gateway.ts`
- `apps/desktop/src/lib/gateway-ws-url.ts`
- `apps/desktop/src/lib/gateway-events.ts`
- `apps/desktop/src/types/hermes.ts`
- `apps/desktop/src/store/gateway.ts`
- `apps/desktop/src/store/boot.ts` (simplified — no Electron install steps)

**Replace Electron with browser:**
| Desktop | Verxio Web |
|---------|------------|
| `window.hermesDesktop.getConnection()` | Fetch dashboard HTML for token + `ws://host/api/ws?token=…` |
| Electron boot progress IPC | Polling `/api/health` + WS `gateway.ready` event |
| `HERMES_DESKTOP_HERMES_ROOT` | `VITE_HERMES_DASHBOARD_URL` env |

**Deliverables:**
- `HermesGateway` class connects and receives `gateway.ready`
- Boot overlay (spinner + status text)
- Connection error state with retry

**Commit:** `feat: phase 2 gateway websocket client and boot flow`

**Verify:** DevTools → WS connected; `gateway.ready` logged; boot overlay dismisses.

---

## Phase 3 — Onboarding (provider setup)

**Goal:** First-run experience like desktop — pick provider before chat.

**Source files to port:**
- `components/desktop-onboarding-overlay.tsx` (+ subcomponents)
- `store/onboarding.ts`
- `lib/runtime-readiness.ts`
- `lib/provider-setup-errors.ts`

**Adaptations:**
- Remove `window.hermesDesktop` OAuth — use `window.open` for sign-in URLs (desktop already has this fallback)
- Rebrand all user-facing copy: Hermes → Verxio
- Persist `firstRunSkipped` / `configured` in `localStorage` (same keys pattern as desktop)

**RPC methods used:**
- `setup.status`
- `setup.runtime_check`
- Provider OAuth endpoints via existing gateway RPC

**Commit:** `feat: phase 3 onboarding and provider setup overlay`

**Verify:** Fresh `HERMES_HOME` or cleared keys → onboarding shows; OAuth flow completes; overlay dismisses when runtime ready.

---

## Phase 4 — Chat core

**Goal:** Send a message, stream assistant response and tool activity.

**Source files to port (largest phase):**
- `app/desktop-controller.tsx` → split into `app/shell.tsx` + routes
- `app/chat/` (entire directory)
- `store/session.ts`, `store/composer.ts`, `store/subagents.ts`
- `lib/chat-runtime.ts`, `lib/chat-messages.ts`
- `app/gateway/hooks/use-gateway-boot.ts`

**Skip in v1:**
- Electron file picker → `<input type="file">` stub
- `node-pty` embedded terminal → hide or Phase 6
- Voice → Phase 7
- Haptics → drop

**Deliverables:**
- `/chat` route with session sidebar
- Composer sends user message via gateway RPC
- Streaming text + tool cards render

**Commit:** `feat: phase 4 chat streaming and sessions`

**Verify:** Complete one full turn (message → tool call → response) in browser.

---

## Phase 5 — Settings & model picker

**Goal:** Change model/provider from UI after onboarding.

**Source files to port:**
- `app/settings/` views
- `components/model-picker.tsx`, `model-visibility-dialog.tsx`
- `store/profile.ts`, `store/model-visibility.ts`

**Commit:** `feat: phase 5 settings and model picker`

**Verify:** Switch model from UI; next message uses new model (check via `/api/model/info`).

---

## Phase 6 — Previews & file browser (optional)

**Source:** `app/artifacts/`, preview pane stores, file tree components.

**Commit:** `feat: phase 6 preview pane and file browser`

---

## Phase 7 — Voice & polish (optional)

**Source:** voice playback stores, microphone permission (browser `getUserMedia`).

**Commit:** `feat: phase 7 voice input and playback`

---

## Phase 8 — Production build & deploy

**Goal:** Ship static assets against Hermes dashboard in production.

**Tasks:**
1. `npm run build` → `dist/`
2. Serve via `HERMES_WEB_DIST=/path/to/verxio-web/dist hermes dashboard --skip-build`
   OR nginx/CDN in front of static + proxy `/api` to dashboard
3. Document production env vars
4. CI: `type-check`, `lint`, `test:ui`

**Commit:** `chore: phase 8 production build and deploy docs`

---

## Phase 9 — verxio-api integration (optional)

Keep `verxio-api` as BFF for Verxio-specific APIs (workspaces, audit). Chat continues to talk to `hermes dashboard` directly — do not route chat through gateway `:8642` polling unless there is a strong reason.

**Commit:** `docs: phase 9 verxio-api integration notes`

---

## File mapping reference

| Desktop (`apps/desktop/src`) | Verxio Web (`verxio-web/src`) |
|------------------------------|-------------------------------|
| `electron/*` | **Drop** — browser boot in `lib/boot.ts` |
| `app/desktop-controller.tsx` | `app/shell.tsx` |
| `app/chat/` | `app/chat/` |
| `components/desktop-onboarding-overlay.tsx` | `components/onboarding-overlay.tsx` |
| `components/desktop-install-overlay.tsx` | **Drop** (Hermes installed separately) |
| `store/*` | `store/*` (same patterns) |
| `themes/*` | `themes/*` |
| `i18n/*` | `i18n/*` (Verxio strings) |
| `hermes.ts` | `lib/hermes-gateway.ts` |

---

## Syncing with upstream Hermes desktop

When Nous ships desktop fixes:

1. Identify changed files under `apps/desktop/src/`
2. Cherry-pick or merge into matching `verxio-web/src/` paths
3. Re-apply Verxio branding diffs
4. Run `npm run type-check && npm run test:ui`

---

## What we intentionally do not port

- Electron `main.cjs` / preload / auto-update
- Bootstrap installer (`apps/bootstrap-installer`)
- macOS/Windows code signing
- `hermes-agent/web/` admin dashboard (different product surface)

---

## Current status

| Phase | Status |
|-------|--------|
| 0 Scaffold | ✅ Complete |
| 1 Design foundation | ⬜ Pending |
| 2 Gateway client | ⬜ Pending |
| 3 Onboarding | ⬜ Pending |
| 4 Chat | ⬜ Pending |
| 5 Settings | ⬜ Pending |
| 6–9 | ⬜ Optional / later |
