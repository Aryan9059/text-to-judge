import { pgTable, text, timestamp, uuid, jsonb, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkId: text("clerk_id").notNull().unique(),
  email: text("email").notNull(),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const problems = pgTable("problems", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  idea: text("idea").notNull(), // The original prompt
  constraints: text("constraints").notNull(),
  sampleCases: jsonb("sample_cases").notNull(),
  hiddenCases: jsonb("hidden_cases"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const submissions = pgTable("submissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  problemId: uuid("problem_id").references(() => problems.id, { onDelete: "cascade" }),
  code: text("code").notNull(),
  language: text("language").default("cpp").notNull(),
  verdict: text("verdict").notNull(), // AC, WA, TLE, CE
  executionTime: integer("execution_time"), // ms
  memoryUsed: integer("memory_used"), // KB
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
