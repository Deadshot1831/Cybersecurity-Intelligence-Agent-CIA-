import type { AnalyzeResponse } from "./types";

/** Small deterministic hash so a given topic yields a stable sample report. */
function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function titleCase(s: string): string {
  return s
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const ACTORS = [
  "UNC5221",
  "Scattered Spider",
  "FIN7",
  "Lazarus Group",
  "Cl0p (TA505)",
  "Volt Typhoon",
];
const SEVERITIES = ["critical", "high", "medium", "low"] as const;

/**
 * Produces a realistic, well-structured SAMPLE threat-intelligence report in
 * GitHub-flavored Markdown. Output shape mirrors the real crew's report
 * (Executive Summary → Threat Details → Vulnerabilities → Defenses → References)
 * so the real backend can drop straight in. See app/api/analyze/route.ts.
 */
export function generateMockReport(rawTopic: string): AnalyzeResponse {
  const topic = titleCase(rawTopic) || "Emerging Threat Activity";
  const seed = hash(rawTopic.toLowerCase());

  const actor = ACTORS[seed % ACTORS.length];
  const actor2 = ACTORS[(seed >> 3) % ACTORS.length];
  const severity = SEVERITIES[seed % 2]; // bias sample toward critical/high
  const cvssBase = (8.1 + ((seed % 18) / 10)).toFixed(1); // 8.1 – 9.9
  const cvssBase2 = (6.4 + ((seed % 25) / 10)).toFixed(1);
  const year = 2024 + (seed % 2);
  const cve = `CVE-${year}-${21000 + (seed % 8999)}`;
  const cve2 = `CVE-${year}-${30000 + ((seed >> 5) % 8999)}`;
  const generatedAt = new Date().toISOString();
  const dateLabel = new Date(generatedAt).toLocaleString("en-US", {
    dateStyle: "long",
    timeStyle: "short",
  });

  const findings: Record<string, string> = {
    "threat-analyst": `Linked activity to ${actor}; identified active exploitation campaign.`,
    "vuln-researcher": `Mapped 2 primary CVEs — ${cve} (CVSS ${cvssBase}) and ${cve2}.`,
    "ir-advisor": `Drafted containment, detection signatures, and patch sequencing.`,
    "report-writer": `Compiled a ${severity.toUpperCase()}-rated CISO briefing with references.`,
  };

  const report = `# Threat Intelligence Report: ${topic}

> **Sample output.** This report was produced by the *stubbed* backend for UI
> demonstration. Wire in the CrewAI + Groq + Exa pipeline to generate live
> intelligence. Identifiers below are illustrative.

**Classification:** TLP:CLEAR &middot; **Overall severity:** ${severity.toUpperCase()} &middot; **Generated:** ${dateLabel}

## Executive Summary

Active exploitation related to **${topic}** has been observed across multiple
sectors, with intelligence linking the activity to the threat actor **${actor}**
and opportunistic follow-on operations attributed to **${actor2}**. The primary
vulnerability, \`${cve}\`, carries a **CVSS ${cvssBase}** base score and is being
weaponized for initial access and remote code execution.

> Organizations exposing affected services to the internet should treat this as
> an **active, time-sensitive incident** and prioritize emergency patching and
> threat hunting within the next 24–72 hours.

## Threat Details

- **Primary actor:** ${actor} — financially and/or espionage motivated, known for rapid weaponization of N-day flaws.
- **Initial access:** Exploitation of internet-facing services; phishing used for secondary footholds.
- **Objectives:** Persistence, credential theft, lateral movement, and data exfiltration.

| Attribute | Detail |
| --- | --- |
| Threat actor | ${actor} |
| Campaign status | Active / ongoing |
| Targeted sectors | Government, finance, healthcare, technology |
| Primary access vector | Exploitation of public-facing application |
| MITRE ATT&CK | T1190 (Exploit Public-Facing App), T1059, T1071 |

## Technical Vulnerabilities

| CVE | CVSS | Type | Affected | Exploit |
| --- | --- | --- | --- | --- |
| \`${cve}\` | ${cvssBase} (Critical) | Remote Code Execution | Unpatched edge appliances / services | Public PoC, in-the-wild |
| \`${cve2}\` | ${cvssBase2} (High) | Authentication Bypass | Pre-fix releases | Chained with ${cve} |

Successful exploitation of \`${cve}\` permits unauthenticated remote code
execution. When chained with the authentication bypass in \`${cve2}\`, an
attacker can establish persistence prior to credential validation.

## Defense Recommendations

### Immediate (0–72 hours)
- Apply vendor emergency patches for \`${cve}\` and \`${cve2}\`; if patching is not
  possible, remove affected services from internet exposure.
- Hunt for indicators of compromise across affected hosts and review authentication logs.

### Short-term (1–2 weeks)
- Rotate credentials and API tokens that may have been exposed on affected systems.
- Deploy detection signatures and confirm EDR coverage on all edge and exposed assets.

### Long-term
- Enforce network segmentation and least-privilege access for management interfaces.
- Establish a continuous external attack-surface monitoring program.

### Example detection logic

\`\`\`yara
rule ${actor.replace(/[^A-Za-z0-9]/g, "_")}_Exploit_Activity
{
    meta:
        description = "Heuristic for ${topic} exploitation attempts"
        severity    = "${severity}"
        reference   = "${cve}"
    strings:
        $u1 = "/api/v1/" ascii
        $p1 = "Content-Type: application/x-www-form-urlencoded" ascii
    condition:
        any of them
}
\`\`\`

## References

- NVD — National Vulnerability Database: \`${cve}\`, \`${cve2}\`
- MITRE ATT&CK — techniques T1190, T1059, T1071
- CISA Known Exploited Vulnerabilities (KEV) Catalog
`;

  return { topic: rawTopic, report, generatedAt, findings, severity, mock: true };
}
