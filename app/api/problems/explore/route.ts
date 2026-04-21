import { db } from "@/lib/db";
import { problems } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const difficulty = searchParams.get("difficulty");
    const tag = searchParams.get("tag");

    const publicProblems = await db.query.problems.findMany({
      where: eq(problems.isPublic, true),
      with: {
        user: {
          columns: {
            name: true,
            email: true,
          }
        }
      },
      orderBy: [desc(problems.createdAt)],
    });


    let filtered = publicProblems;
    if (difficulty && difficulty !== "All") {
      filtered = filtered.filter(p => p.difficulty === difficulty);
    }
   
    if (tag) {
      filtered = filtered.filter(p => {
        const pTags = p.tags as string[] || [];
        const cTags = p.companyTags as string[] || [];
        return pTags.includes(tag) || cTags.includes(tag);
      });
    }

    return Response.json({ problems: filtered });
  } catch (error) {
    console.error("Explore API Error:", error);
    return Response.json({ error: "Failed to fetch problems" }, { status: 500 });
  }
}
