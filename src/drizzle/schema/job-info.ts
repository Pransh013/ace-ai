import { pgTable, varchar, text, pgEnum } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schema-helpers";
import { UserTable } from "./user";
import { relations } from "drizzle-orm";
import { QuestionTable } from "./question";
import { InterviewTable } from "./interview";

export const experienceLevels = ["junior", "mid-level", "senior"] as const;
export type ExperienceLevel = (typeof experienceLevels)[number];
export const experienceLevelEnum = pgEnum(
  "job_infos_experience_level",
  experienceLevels
);

export const JobInfoTable = pgTable("job_infos", {
  id,
  title: varchar({ length: 255 }),
  name: varchar({ length: 255 }).notNull(),
  description: text().notNull(),
  userId: varchar("user_id")
    .references(() => UserTable.id, { onDelete: "cascade" })
    .notNull(),
  experienceLevel: experienceLevelEnum("experience_level").notNull(),
  createdAt,
  updatedAt,
});

export const jobInfoRelations = relations(JobInfoTable, ({ one, many }) => ({
  user: one(UserTable, {
    fields: [JobInfoTable.userId],
    references: [UserTable.id],
  }),
  questions: many(QuestionTable),
  interviews: many(InterviewTable),
}));
