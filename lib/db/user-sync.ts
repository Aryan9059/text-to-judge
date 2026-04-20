import { db } from "./index";
import { users } from "./schema";
import { eq } from "drizzle-orm";

export async function getOrCreateUser(clerkUserId: string, email: string, name?: string) {
  // Check if user exists
  const existingUser = await db.query.users.findFirst({
    where: eq(users.clerkId, clerkUserId),
  });

  if (existingUser) {
    return existingUser;
  }

  // create a new user if doesn't exist
  const [newUser] = await db
    .insert(users)
    .values({
      clerkId: clerkUserId,
      email: email,
      name: name,
    })
    .returning();

  return newUser;
}
