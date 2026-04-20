import { db } from "@/lib/db";
import { problems } from "@/lib/db/schema";
import { getOrCreateUser } from "@/lib/db/user-sync";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { problem } = await request.json();

    if (!problem || !problem.title || !problem.statement) {
      return Response.json({ error: "Invalid problem data" }, { status: 400 });
    }

    // sync user
    const dbUser = await getOrCreateUser(
      userId,
      user.emailAddresses[0].emailAddress,
      `${user.firstName || ""} ${user.lastName ||""}`.trim()
    );

    // save problem
    const [savedProblem] = await db
      .insert(problems)
      .values({
        userId: dbUser.id,
        title: problem.title,
        description: problem.statement,
        difficulty: problem.difficulty || "Medium",
        inputFormat: problem.inputFormat,
        outputFormat: problem.outputFormat,
        idea: problem.idea || "Generated via Workspace",
        constraints: Array.isArray(problem.constraints) 
          ? problem.constraints.join("\n") 
          : problem.constraints,
        sampleCases: problem.sampleCases,
        hiddenCases: problem.hiddenCases || [],
      })
      .returning();

    return Response.json({ success: true, problemId: savedProblem.id });
  } catch (error) {
    console.error("Save problem error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to save problem" },
      { status: 500 }
    );
  }
}
