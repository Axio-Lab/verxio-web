import { useEffect, useState } from "react";
import { fetchDashboardHealth } from "@/lib/dashboard";

type Health = { ok: boolean; detail: string } | null;

export default function App() {
  const [health, setHealth] = useState<Health>(null);

  useEffect(() => {
    let cancelled = false;
    void fetchDashboardHealth().then((result) => {
      if (!cancelled) setHealth(result);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="flex min-h-full flex-col items-center justify-center gap-6 p-8">
      <div className="text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-[var(--color-muted-foreground)]">
          Verxio
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Web shell (Phase 0)</h1>
        <p className="mt-3 max-w-lg text-[var(--color-muted-foreground)]">
          Browser UI for the Hermes Agent runtime. Desktop parity ports in
          later phases — see <code>IMPLEMENTATION_PLAN.md</code>.
        </p>
      </div>

      <div className="w-full max-w-md rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)] p-4">
        <p className="text-sm font-medium">Hermes dashboard</p>
        {health === null ? (
          <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
            Checking connection…
          </p>
        ) : (
          <p
            className={`mt-2 text-sm ${health.ok ? "text-emerald-400" : "text-amber-400"}`}
          >
            {health.detail}
          </p>
        )}
        {!health?.ok ? (
          <p className="mt-3 text-xs text-[var(--color-muted-foreground)]">
            Start the backend:{" "}
            <code className="text-[var(--color-foreground)]">
              hermes dashboard --no-open
            </code>
          </p>
        ) : null}
      </div>
    </main>
  );
}
