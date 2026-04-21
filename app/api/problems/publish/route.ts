import { db } from "@/lib/db";
import { problems } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const { problemId, description, companyTags, tags } =
    await req.json();

  await db
    .update(problems)
    .set({
      isPublic: true,
      description,
      companyTags,
      tags,
    })
    .where(eq(problems.id, problemId));

  return Response.json({ success: true });
}