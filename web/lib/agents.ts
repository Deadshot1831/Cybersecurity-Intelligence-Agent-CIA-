import type { AgentMeta } from "./types";

/**
 * The four-agent pipeline, mirroring the CrewAI agents in the Python project
 * (agents.py). Order matches the sequential crew process.
 */
export const AGENTS: AgentMeta[] = [
  {
    id: "threat-analyst",
    name: "Threat Analyst",
    role: "Lead Threat Intelligence Analyst",
    blurb:
      "Scans OSINT and recent reporting to surface threat actors, active campaigns, and TTPs.",
    icon: "radar",
    produces: "Threat intelligence log",
  },
  {
    id: "vuln-researcher",
    name: "Vulnerability Researcher",
    role: "Senior Vulnerability Researcher",
    blurb:
      "Maps the threat to concrete CVEs, CVSS severity, affected versions, and exploit availability.",
    icon: "bug",
    produces: "Vulnerability registry",
  },
  {
    id: "ir-advisor",
    name: "Incident Response Advisor",
    role: "Incident Response Specialist & Architect",
    blurb:
      "Designs containment, detection signatures, patch guidance, and hardening controls.",
    icon: "shield-check",
    produces: "Defense & mitigation plan",
  },
  {
    id: "report-writer",
    name: "Report Writer",
    role: "Principal Cybersecurity Technical Writer",
    blurb:
      "Synthesizes every finding into a structured, CISO-ready intelligence report.",
    icon: "file-text",
    produces: "Final markdown report",
  },
];

export const EXAMPLE_TOPICS = [
  "Ivanti VPN zero-day exploits",
  "MOVEit Transfer ransomware campaign",
  "Akira ransomware targeting SonicWall",
  "Log4Shell exploitation in the wild",
];
