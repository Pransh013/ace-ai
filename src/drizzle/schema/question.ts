import { pgTable, text, pgEnum, uuid } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schema-helpers";
import { relations } from "drizzle-orm";
import { JobInfoTable } from "./job-info";

export const questionDifficulties = ["easy", "medium", "hard"] as const;
export type QuestionDifficulty = (typeof questionDifficulties)[number];
export const questionDifficultyEnum = pgEnum(
  "questions_question_difficulty",
  questionDifficulties
);

export const QuestionTable = pgTable("questions", {
  id,
  text: text().notNull(),
  jobInfoId: uuid("job_info_id")
    .references(() => JobInfoTable.id, { onDelete: "cascade" })
    .notNull(),
  difficulty: questionDifficultyEnum().notNull(),
  createdAt,
  updatedAt,
});

export const questionRelations = relations(QuestionTable, ({ one }) => ({
  jobInfo: one(JobInfoTable, {
    fields: [QuestionTable.jobInfoId],
    references: [JobInfoTable.id],
  }),
}));
