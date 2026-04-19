import { regenerateTestCases } from "@/lib/groq";
import type { GeneratedProblem } from "@/lib/groq";

export async function POST(request: Request) {
  try {
    const { problem } = await request.json();

    if (!problem || !problem.title || !problem.statement) {
      return Response.json(
        { error: "A valid problem is required to regenerate test cases" },
        { status: 400 }
      );
    }

    const result = await regenerateTestCases(problem as GeneratedProblem);
    return Response.json(result);
  } catch (error) {
    console.error("Regenerate tests error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to regenerate test cases";
    return Response.json({ error: message }, { status: 500 });
  }
}
