"use client";

import { useState } from "react";
import { Loader2, Radar, Search } from "lucide-react";
import { EXAMPLE_TOPICS } from "@/lib/agents";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSubmit: (v: string) => void;
  running: boolean;
}

export function TopicForm({ value, onChange, onSubmit, running }: Props) {
  // Local validation message — keeps the submit button responsive so a click
  // never feels dead. The remote error (network / server) is shown elsewhere.
  const [validation, setValidation] = useState<string | null>(null);

  function attempt(raw: string) {
    if (running) return;
    const t = raw.trim();
    if (t.length < 3) {
      setValidation("Enter at least 3 characters to run an analysis.");
      return;
    }
    setValidation(null);
    onSubmit(t);
  }

  return (
    <section className="rounded-[var(--radius-card)] border border-border bg-panel/70 p-5 shadow-2xl shadow-black/40 sm:p-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          attempt(value);
        }}
        noValidate
      >
        <label htmlFor="topic" className="block text-sm font-medium text-fg">
          Threat topic
        </label>
        <p className="mb-3 mt-0.5 text-sm text-fg-subtle">
          Name a campaign, CVE, actor, or technique. The crew will research it
          and compile an intelligence report.
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
              aria-invalid={validation ? true : undefined}
              aria-describedby={validation ? "topic-error" : undefined}
              onChange={(e) => {
                onChange(e.target.value);
                if (validation) setValidation(null);
              }}
              placeholder="e.g. Ivanti VPN zero-day exploits"
              className="w-full rounded-xl border border-border-strong bg-bg py-3 pl-10 pr-3 text-fg placeholder:text-fg-subtle/70 transition focus:border-accent focus:outline-none aria-[invalid=true]:border-critical disabled:opacity-60"
            />
          </div>
          <button
            type="submit"
            disabled={running}
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

        {validation && (
          <p
            id="topic-error"
            role="alert"
            className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-critical"
          >
            {validation}
          </p>
        )}
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
              attempt(t);
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
