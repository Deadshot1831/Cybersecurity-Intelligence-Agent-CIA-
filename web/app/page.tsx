"use client";

import { useRef, useState } from "react";
import { AlertTriangle, Workflow } from "lucide-react";
import { Header } from "@/components/Header";
import { TopicForm } from "@/components/TopicForm";
import { AgentPipeline } from "@/components/AgentPipeline";
import { ReportView } from "@/components/ReportView";
import { AGENT_ICONS } from "@/components/agentIcons";
import { AGENTS } from "@/lib/agents";
import type { AnalyzeResponse, StageStatus } from "@/lib/types";

type Phase = "idle" | "running" | "done" | "error";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function seedStatuses(): Record<string, StageStatus> {
  return Object.fromEntries(
    AGENTS.map((a, i) => [a.id, i === 0 ? "running" : "queued"]),
  );
}

export default function Home() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [topic, setTopic] = useState("");
  const [activeTopic, setActiveTopic] = useState("");
  const [statuses, setStatuses] = useState<Record<string, StageStatus>>({});
  const [findings, setFindings] = useState<Record<string, string>>({});
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [live, setLive] = useState("");
  const runIdRef = useRef(0);

  async function runAnalysis(raw: string) {
    const t = raw.trim();
    if (t.length < 3 || phase === "running") return;

    const runId = ++runIdRef.current;
    const stale = () => runIdRef.current !== runId;

    setActiveTopic(t);
    setError(null);
    setResult(null);
    setFindings({});
    setStatuses(seedStatuses());
    setPhase("running");
    setLive(`Analyzing ${t}. Threat Analyst working.`);

    let data: AnalyzeResponse;
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: t }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? `Request failed (${res.status}).`);
      }
      data = (await res.json()) as AnalyzeResponse;
    } catch (e) {
      if (stale()) return;
      const msg = e instanceof Error ? e.message : "Something went wrong.";
      setError(msg);
      setPhase("error");
      setLive(`Analysis failed: ${msg}`);
      return;
    }

    if (stale()) return;

    // Reveal the agents finishing one-by-one with their findings.
    for (let i = 0; i < AGENTS.length; i++) {
      await sleep(820);
      if (stale()) return;
      const id = AGENTS[i].id;
      setFindings((prev) => ({ ...prev, [id]: data.findings[id] ?? "" }));
      setStatuses((prev) => {
        const next = { ...prev, [id]: "done" as StageStatus };
        if (i + 1 < AGENTS.length) next[AGENTS[i + 1].id] = "running";
        return next;
      });
      setLive(`${AGENTS[i].name} complete.`);
    }

    if (stale()) return;
    setResult(data);
    setPhase("done");
    setLive("Intelligence report ready.");
  }

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-8">
        <p className="sr-only" role="status" aria-live="polite">
          {live}
        </p>

        <TopicForm
          value={topic}
          onChange={setTopic}
          onSubmit={runAnalysis}
          running={phase === "running"}
        />

        {phase === "idle" && <Intro />}

        {phase !== "idle" && (
          <div className="mt-6 grid gap-6 lg:grid-cols-[330px_minmax(0,1fr)]">
            <aside className="lg:sticky lg:top-20 lg:self-start">
              <div className="rounded-[var(--radius-card)] border border-border bg-panel/70 p-4 shadow-2xl shadow-black/40">
                <div className="mb-3 flex items-center gap-2 px-1">
                  <Workflow className="size-4 text-accent" aria-hidden />
                  <h2 className="text-sm font-semibold text-fg">Agent pipeline</h2>
                </div>
                <p
                  className="mb-3 truncate px-1 text-xs text-fg-subtle"
                  title={activeTopic}
                >
                  Topic: <span className="text-fg-muted">{activeTopic}</span>
                </p>
                <AgentPipeline statuses={statuses} findings={findings} />
              </div>
            </aside>

            <div>
              {phase === "running" && <BuildingReport />}
              {phase === "error" && <ErrorPanel message={error} />}
              {phase === "done" && result && <ReportView result={result} />}
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-border px-5 py-4 text-center text-xs text-fg-subtle">
        Sample intelligence only. Verify findings against authoritative sources
        before acting.
      </footer>
    </>
  );
}

function Intro() {
  return (
    <section className="mt-8 animate-rise">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-fg-subtle">
        How it works
      </h2>
      <p className="mt-1 max-w-2xl text-sm text-fg-muted">
        A crew of four specialized agents runs sequentially &mdash; each one&apos;s
        output feeds the next &mdash; to turn a single topic into a structured,
        CISO-ready threat report.
      </p>

      <ol className="mt-5 grid gap-3 sm:grid-cols-2">
        {AGENTS.map((agent, i) => {
          const Icon = AGENT_ICONS[agent.icon];
          return (
            <li
              key={agent.id}
              className="flex gap-3.5 rounded-[var(--radius-card)] border border-border bg-panel/50 p-4 transition hover:border-border-strong"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-border-strong bg-panel-2 text-accent">
                <Icon className="size-5" strokeWidth={2} aria-hidden />
              </span>
              <div className="min-w-0">
                <span className="text-xs font-medium text-fg-subtle">
                  Step {i + 1}
                </span>
                <p className="text-sm font-semibold text-fg">{agent.name}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-fg-subtle">
                  {agent.blurb}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function BuildingReport() {
  return (
    <div
      className="rounded-[var(--radius-card)] border border-border bg-panel/50 p-6"
      aria-hidden
    >
      <div className="flex items-center gap-2 text-sm font-medium text-fg-muted">
        <span className="size-2 rounded-full bg-accent dot-live" />
        Compiling intelligence report&hellip;
      </div>
      <div className="mt-6 space-y-3">
        <div className="skeleton h-7 w-2/3 rounded-md" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-11/12 rounded" />
        <div className="skeleton h-4 w-4/5 rounded" />
        <div className="skeleton mt-6 h-24 w-full rounded-lg" />
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-4 w-5/6 rounded" />
      </div>
    </div>
  );
}

function ErrorPanel({ message }: { message: string | null }) {
  return (
    <div className="animate-rise rounded-[var(--radius-card)] border border-critical/40 bg-critical/10 p-6">
      <div className="flex items-center gap-2 text-critical">
        <AlertTriangle className="size-5" aria-hidden />
        <h2 className="font-semibold">Analysis failed</h2>
      </div>
      <p className="mt-2 text-sm text-fg-muted">
        {message ?? "An unexpected error occurred."}
      </p>
      <p className="mt-1 text-sm text-fg-subtle">
        Adjust the topic above and run the analysis again.
      </p>
    </div>
  );
}
