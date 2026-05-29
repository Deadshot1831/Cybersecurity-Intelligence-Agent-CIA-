"use client";

import { Loader2, Radar, Search } from "lucide-react";
import { EXAMPLE_TOPICS } from "@/lib/agents";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSubmit: (v: string) => void;
  running: boolean;
}

export function TopicForm({ value, onChange, onSubmit, running }: Props) {
  const canSubmit = value.trim().length >= 3 && !running;

  return (
    <section className="rounded-[var(--radius-card)] border border-border bg-panel/70 p-5 shadow-2xl shadow-black/40 sm:p-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (canSubmit) onSubmit(value);
        }}
      >
        <label htmlFor="topic" className="block text-sm font-medium text-fg">
          Threat topic
        </label>
        <p className="mb-3 mt-0.5 text-sm text-fg-subtle">
          Name a campaign, CVE, actor, or technique. The crew will research it and
          compile an intelligence report.
        </p>

        <div className="flex flex-col gap-2.5 sm:flex-row">
          <div className="relative flex-1">
            <Search
              aria-hidden
              className="pointer-events-none absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-fg-subtle"
            />
            <input
              id="topic"
              name="topic"
              type="text"
              autoComplete="off"
              maxLength={200}
              disabled={running}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="e.g. Ivanti VPN zero-day exploits"
              className="w-full rounded-xl border border-border-strong bg-bg py-3 pl-10 pr-3 text-fg placeholder:text-fg-subtle/70 transition focus:border-accent focus:outline-none disabled:opacity-60"
            />
          </div>
          <button
            type="submit"
            disabled={!canSubmit}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-on-accent transition hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-45"
          >
            {running ? (
              <>
                <Loader2 className="size-4.5 spin" aria-hidden />
                Analyzing
              </>
            ) : (
              <>
                <Radar className="size-4.5" aria-hidden />
                Run analysis
              </>
            )}
          </button>
        </div>
      </form>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs text-fg-subtle">Try:</span>
        {EXAMPLE_TOPICS.map((t) => (
          <button
            key={t}
            type="button"
            disabled={running}
            onClick={() => {
              onChange(t);
              onSubmit(t);
            }}
            className="rounded-full border border-border bg-panel-2 px-3 py-1 text-xs text-fg-muted transition hover:border-border-strong hover:text-fg disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t}
          </button>
        ))}
      </div>
    </section>
  );
}
