import { judgeSubmission } from "@/lib/judge";

export async function POST(request: Request) {
  try {
    const { code, sampleCases, hiddenCases, mode } = await request.json();

    if (!code || typeof code !== "string") {
      return Response.json(
        { error: "No code provided" },
        { status: 400 }
      );
    }

    if (!sampleCases || !Array.isArray(sampleCases)) {
      return Response.json(
        { error: "No test cases provided" },
        { status: 400 }
      );
    }

    if (mode !== "run" && mode !== "submit") {
      return Response.json(
        { error: "Mode must be 'run' or 'submit'" },
        { status: 400 }
      );
    }

    const result = await judgeSubmission(
      code,
      sampleCases,
      hiddenCases || [],
      mode
    );

    return Response.json({ result });
  } catch (error) {
    console.error("Run error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to run code";
    return Response.json({ error: message }, { status: 500 });
  }
}
