"use server";

import { and, eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

import { db } from "@/drizzle/db";
import { insertInterview, updateInterview as updateInterviewDb } from "./db";
import { InterviewTable, JobInfoTable } from "@/drizzle/schema";
import { getJobInfoIdTag } from "../job-infos/db-cache";
import { getCurrentUser } from "@/services/clerk/lib/get-current-user";
import { getInterviewIdTag } from "./db-cache";

export async function createInterview({
  jobInfoId,
}: {
  jobInfoId: string;
}): Promise<{ error: true; message: string } | { error: false; id: string }> {
  const { userId } = await getCurrentUser();
  if (!userId) {
    return {
      error: true,
      message: "You don't have permissions to do this",
    };
  }

  const jobInfo = await getJobInfo(jobInfoId, userId);
  if (!jobInfo) {
    return {
      error: true,
      message: "You don't have permissions to do this",
    };
  }

  const interview = await insertInterview({ jobInfoId, duration: "00:00:00" });

  return { error: false, id: interview.id };
}

export async function updateInterview(
  id: string,
  data: {
    humeChatId?: string;
    duration?: string;
  }
): Promise<{ error: true; message: string } | { error: false }> {
  const { userId } = await getCurrentUser();
  if (!userId) {
    return {
      error: true,
      message: "You don't have permissions to do this",
    };
  }

  const interview = await getInterview(id, userId);
  if (!interview) {
    return {
      error: true,
      message: "You don't have permissions to do this",
    };
  }

  await updateInterviewDb(id, data);

  return { error: false };
}

async function getJobInfo(id: string, userId: string) {
  "use cache";
  cacheTag(getJobInfoIdTag(id));

  return db.query.JobInfoTable.findFirst({
    where: and(eq(JobInfoTable.id, id), eq(JobInfoTable.userId, userId)),
  });
}

async function getInterview(id: string, userId: string) {
  "use cache";
  cacheTag(getInterviewIdTag(id));

  const interview = await db.query.InterviewTable.findFirst({
    where: eq(InterviewTable.id, id),
    with: {
      jobInfo: {
        columns: {
          id: true,
          userId: true,
        },
      },
    },
  });

  if (!interview) return null;

  cacheTag(getJobInfoIdTag(interview.jobInfo.id));
  if (interview.jobInfo.userId !== userId) return null;

  return interview;
}
