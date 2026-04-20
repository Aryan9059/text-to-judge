import { db } from "@/lib/db";
import { problems } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import { getOrCreateUser } from "@/lib/db/user-sync";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // sync user to get the id
    const dbUser = await getOrCreateUser(
      userId,
      user.emailAddresses[0].emailAddress,
      `${user.firstName || ""} ${user.lastName || ""}`.trim()
    );

    // fetch problem
    const problem = await db.query.problems.findFirst({
      where: and(
        eq(problems.id, id),
        eq(problems.userId, dbUser.id)
      ),
    });

    if (!problem) {
      return Response.json({ error: "Problem not found" }, { status: 404 });
    }

    // map db fields back to generatedProblem format
    const formattedProblem = {
      title: problem.title,
      statement: problem.description,
      idea: problem.idea,
      difficulty: problem.difficulty,
      inputFormat: problem.inputFormat,
      outputFormat: problem.outputFormat,
      constraints: problem.constraints.split("\n"),
      sampleCases: problem.sampleCases,
      hiddenCases: problem.hiddenCases,
    };

    return Response.json({ problem: formattedProblem });
  } catch (error) {
    console.error("Fetch problem error:", error);
    return Response.json({ error: "Failed to fetch problem" }, { status: 500 });
  }
}
