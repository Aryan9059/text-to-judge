import { generateProblem } from "@/lib/groq";

export async function POST(request: Request) {
  try {
    const { idea } = await request.json();

    if (!idea || typeof idea !== "string" || idea.trim().length === 0) {
      return Response.json(
        { error: "Please provide a coding idea" },
        { status: 400 }
      );
    }

    if (idea.length > 500) {
      return Response.json(
        { error: "Idea is too long (max 500 characters)" },
        { status: 400 }
      );
    }

    const problem = await generateProblem(idea.trim());
    return Response.json({ problem });
  } catch (error) {
    console.error("Generate error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to generate problem";
    return Response.json({ error: message }, { status: 500 });
  }
}
