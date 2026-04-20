import { db } from "@/lib/db";
import { problems, submissions, users } from "@/lib/db/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { eq, desc, count, avg, and } from "drizzle-orm";
import { getOrCreateUser } from "@/lib/db/user-sync";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
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

    // fetch statistics
    const problemsCount = await db
      .select({ count: count() })
      .from(problems)
      .where(eq(problems.userId, dbUser.id));

    const submissionsCount = await db
      .select({ count: count() })
      .from(submissions)
      .where(eq(submissions.userId, dbUser.id));

    const acSubmissions = await db
      .select({ count: count() })
      .from(submissions)
      .where(and(eq(submissions.userId, dbUser.id), eq(submissions.verdict, "AC")));

    // fetch recent problems
    const userProblems = await db.query.problems.findMany({
      where: eq(problems.userId, dbUser.id),
      orderBy: [desc(problems.createdAt)],
      limit: 10,
    });

    // fetch recent submissions
    const userSubmissions = await db.query.submissions.findMany({
      where: eq(submissions.userId, dbUser.id),
      with: {
        problem: true,
      },
      orderBy: [desc(submissions.createdAt)],
      limit: 10,
    });

    return Response.json({
      stats: {
        problemsTotal: problemsCount[0].count,
        submissionsTotal: submissionsCount[0].count,
        accuracy: submissionsCount[0].count > 0 
          ? ((acSubmissions[0].count / submissionsCount[0].count) * 100).toFixed(1)
          : "0.0",
      },
      problems: userProblems,
      submissions: userSubmissions,
    });
  } catch (error) {
    console.error("Dashboard data error:", error);
    return Response.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
