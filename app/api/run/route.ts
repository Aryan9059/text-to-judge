import { judgeSubmission } from "@/lib/judge";
import { db } from "@/lib/db";
import { submissions } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { getOrCreateUser } from "@/lib/db/user-sync";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const { code, sampleCases, hiddenCases, mode, problemId } = await request.json();

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

    const { userId } = await auth();
    const user = await currentUser();

    const result = await judgeSubmission(
      code,
      sampleCases,
      hiddenCases || [],
      mode
    );

    // auto saving the submission if mode is submit and there is problem already in db
    if (mode === "submit" && userId && user && problemId) {
      try {
        const dbUser = await getOrCreateUser(
          userId,
          user.emailAddresses[0].emailAddress,
          `${user.firstName || ""} ${user.lastName || ""}`.trim()
        );

        await db.insert(submissions).values({
          userId: dbUser.id,
          problemId: problemId,
          code: code,
          verdict: result.overallVerdict,
          executionTime: result.results[0]?.executionTimeMs ? Math.round(result.results[0].executionTimeMs) : 0,
        });
      } catch (saveError) {
        console.error("Failed to save submission:", saveError);
      }
    }

    return Response.json({ result });
  } catch (error) {
    console.error("Run error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to run code";
    return Response.json({ error: message }, { status: 500 });
  }
}

