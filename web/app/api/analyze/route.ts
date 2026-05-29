import { generateMockReport } from "@/lib/mock-report";
import type { AnalyzeResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

/**
 * POST /api/analyze  { topic: string }  ->  AnalyzeResponse
 *
 * STUBBED BACKEND. Returns an instant, deterministic sample report.
 *
 * ── To wire in the real CrewAI pipeline ──────────────────────────────────────
 * The Python crew (../main.py) runs sequentially and takes minutes. Two options:
 *
 *   1. Stand up a small FastAPI service that imports the existing
 *      agents/tasks/crew and exposes POST /analyze, then call it here:
 *         const r = await fetch(`${process.env.CREW_API_URL}/analyze`, {
 *           method: "POST", body: JSON.stringify({ topic }),
 *         });
 *      Because a run is long, prefer streaming (SSE/ReadableStream) so the UI
 *      can show real per-agent progress instead of the simulated stages.
 *
 *   2. Spawn `python main.py` and read the generated threat_intelligence_report.md.
 *
 * Keep this response shape (AnalyzeResponse) and the frontend works unchanged.
 */
export async function POST(request: Request): Promise<Response> {
  let topic: unknown;
  try {
    ({ topic } = await request.json());
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (typeof topic !== "string" || topic.trim().length < 3) {
    return Response.json(
      { error: "Provide a threat topic of at least 3 characters." },
      { status: 422 },
    );
  }
  if (topic.length > 200) {
    return Response.json(
      { error: "Topic is too long (max 200 characters)." },
      { status: 422 },
    );
  }

  // Brief delay so the request feels like work; the client animates the
  // 4-agent pipeline over a few seconds on top of this.
  await new Promise((r) => setTimeout(r, 600));

  const payload: AnalyzeResponse = generateMockReport(topic);
  return Response.json(payload);
}
