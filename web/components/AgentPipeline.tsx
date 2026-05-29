"use client";

import { Check } from "lucide-react";
import { AGENTS } from "@/lib/agents";
import type { StageStatus } from "@/lib/types";
import { AGENT_ICONS } from "./agentIcons";

interface Props {
  statuses: Record<string, StageStatus>;
  findings: Record<string, string>;
}

const STATUS_LABEL: Record<StageStatus, string> = {
  queued: "Queued",
  running: "Working…",
  done: "Complete",
};

export function AgentPipeline({ statuses, findings }: Props) {
  return (
    <ol className="relative space-y-1">
      {AGENTS.map((agent, i) => {
        const status = statuses[agent.id] ?? "queued";
        const Icon = AGENT_ICONS[agent.icon];
        const finding = findings[agent.id];
        const isLast = i === AGENTS.length - 1;

        return (
          <li
            key={agent.id}
            aria-current={status === "running" ? "step" : undefined}
            className="relative flex gap-3.5 rounded-xl px-2 py-2.5 transition data-[on=true]:bg-panel-2/60"
            data-on={status !== "queued"}
          >
            {!isLast && (
              <span
                aria-hidden
                className={`absolute left-[27px] top-12 h-[calc(100%-1.5rem)] w-px ${
                  status === "done" ? "bg-accent/40" : "bg-border"
                }`}
              />
            )}

            <span
              aria-hidden
              className={`relative z-10 grid size-9 shrink-0 place-items-center rounded-full border transition ${
                status === "done"
                  ? "border-accent/50 bg-accent-soft text-accent"
                  : status === "running"
                    ? "dot-live border-accent bg-accent text-on-accent"
                    : "border-border bg-panel text-fg-subtle"
              }`}
            >
              {status === "done" ? (
                <Check className="size-4.5" strokeWidth={2.5} />
              ) : (
                <Icon className="size-4.5" strokeWidth={2} />
              )}
            </span>

            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex items-baseline justify-between gap-2">
                <p
                  className={`truncate text-sm font-semibold ${
                    status === "queued" ? "text-fg-subtle" : "text-fg"
                  }`}
                >
                  {agent.name}
                </p>
                <span
                  className={`shrink-0 text-xs font-medium ${
                    status === "done"
                      ? "text-accent"
                      : status === "running"
                        ? "text-fg"
                        : "text-fg-subtle"
                  }`}
                >
                  {STATUS_LABEL[status]}
                </span>
              </div>
              <p className="mt-0.5 text-xs leading-relaxed text-fg-subtle">
                {status === "done" && finding ? finding : agent.blurb}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
