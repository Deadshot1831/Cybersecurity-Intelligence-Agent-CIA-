"use client";

import { useState } from "react";
import { Check, Copy, Download, FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { AnalyzeResponse } from "@/lib/types";

const SEVERITY_STYLES: Record<AnalyzeResponse["severity"], string> = {
  critical: "border-critical/40 bg-critical/15 text-critical",
  high: "border-high/40 bg-high/15 text-high",
  medium: "border-medium/40 bg-medium/15 text-medium",
  low: "border-low/40 bg-low/15 text-low",
};

function slugify(s: string): string {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 50) || "report"
  );
}

export function ReportView({ result }: { result: AnalyzeResponse }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(result.report);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  }

  function download() {
    const blob = new Blob([result.report], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `threat-report-${slugify(result.topic)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const generated = new Date(result.generatedAt).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <article className="animate-rise overflow-hidden rounded-[var(--radius-card)] border border-border bg-panel/70 shadow-2xl shadow-black/40">
      <div className="flex flex-wrap items-center gap-3 border-b border-border bg-panel-2/50 px-5 py-3">
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-fg">
          <FileText className="size-4 text-accent" aria-hidden />
          Intelligence Report
        </span>
        <span
          className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${SEVERITY_STYLES[result.severity]}`}
        >
          {result.severity}
        </span>
        <span className="hidden text-xs text-fg-subtle sm:inline">
          Generated {generated}
        </span>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-panel px-3 py-1.5 text-xs font-medium text-fg-muted transition hover:border-border-strong hover:text-fg"
          >
            {copied ? (
              <>
                <Check className="size-3.5 text-success" aria-hidden /> Copied
              </>
            ) : (
              <>
                <Copy className="size-3.5" aria-hidden /> Copy
              </>
            )}
          </button>
          <button
            type="button"
            onClick={download}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-panel px-3 py-1.5 text-xs font-medium text-fg-muted transition hover:border-border-strong hover:text-fg"
          >
            <Download className="size-3.5" aria-hidden /> .md
          </button>
        </div>
      </div>

      <div className="prose-report px-5 py-6 sm:px-8 sm:py-7">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{result.report}</ReactMarkdown>
      </div>
    </article>
  );
}
