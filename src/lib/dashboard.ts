const DEFAULT_DASHBOARD = "http://127.0.0.1:9119";

export function getSessionToken(): string | undefined {
  return window.__HERMES_SESSION_TOKEN__;
}

export async function fetchDashboardHealth(): Promise<{
  ok: boolean;
  detail: string;
}> {
  try {
    const res = await fetch("/api/health", {
      headers: authHeaders(),
    });
    if (!res.ok) {
      return { ok: false, detail: `Dashboard returned ${res.status}` };
    }
    return { ok: true, detail: "Hermes dashboard is reachable." };
  } catch (error) {
    return {
      ok: false,
      detail:
        error instanceof Error
          ? error.message
          : "Could not reach Hermes dashboard.",
    };
  }
}

export function authHeaders(): HeadersInit {
  const token = getSessionToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

export function dashboardUrl(): string {
  return import.meta.env.VITE_HERMES_DASHBOARD_URL ?? DEFAULT_DASHBOARD;
}
