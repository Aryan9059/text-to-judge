import { reviewCode } from "@/lib/groq";

export async function POST(request: Request) {
  try {
    const { code, problem } = await request.json();

    if (!code || typeof code !== "string") {
      return Response.json(
        { error: "No code provided" },
        { status: 400 }
      );
    }

    if (!problem) {
      return Response.json(
        { error: "No problem context provided" },
        { status: 400 }
      );
    }

    const review = await reviewCode(code, problem);
    return Response.json({ review });
  } catch (error) {
    console.error("Review error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to review code";
    return Response.json({ error: message }, { status: 500 });
  }
}
