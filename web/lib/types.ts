export type StageStatus = "queued" | "running" | "done";

export interface AgentMeta {
  id: string;
  /** Short name shown in the pipeline. */
  name: string;
  /** Full role/title from the CrewAI agent definition. */
  role: string;
  /** What this agent does, in one sentence. */
  blurb: string;
  /** lucide-react icon key, resolved in the client. */
  icon: "radar" | "bug" | "shield-check" | "file-text";
  /** The artifact this agent produces. */
  produces: string;
}

export interface AnalyzeResponse {
  topic: string;
  /** Full report as GitHub-flavored Markdown. */
  report: string;
  /** ISO timestamp of when the report was produced. */
  generatedAt: string;
  /** One-line result per agent id, surfaced as each stage completes. */
  findings: Record<string, string>;
  /** Highest severity detected, drives the report header badge. */
  severity: "critical" | "high" | "medium" | "low";
  /** True while the backend is the instant mock (vs. the real crew). */
  mock: boolean;
}
