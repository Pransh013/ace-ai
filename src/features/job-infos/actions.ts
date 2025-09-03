"use server";

import { getCurrentUser } from "@/services/clerk/lib/get-current-user";
import { JobInfoFormData, jobInfoSchema } from "./schemas";
import { redirect } from "next/navigation";
import { insertJobInfo, updateJobInfo as updateJobInfoDb } from "./db";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getJobInfoIdTag } from "./db-cache";
import { db } from "@/drizzle/db";
import { and, eq } from "drizzle-orm";
import { JobInfoTable } from "@/drizzle/schema";

export async function createJobInfo(formData: JobInfoFormData) {
  const { userId } = await getCurrentUser();
  if (!userId)
    return {
      error: true,
      message: "You don't have permissions to do this",
    };

  const { success, data } = jobInfoSchema.safeParse(formData);
  if (!success)
    return {
      error: true,
      message: "Invalid job info data",
    };

  const jobInfo = await insertJobInfo({ ...data, userId });
  redirect(`/home/job-infos/${jobInfo.id}`);
}

export async function updateJobInfo(
  id: string,
  formData: Partial<JobInfoFormData>
) {
  const { userId } = await getCurrentUser();
  if (!userId)
    return {
      error: true,
      message: "You don't have permissions to do this",
    };

  const { success, data } = jobInfoSchema.safeParse(formData);
  if (!success)
    return {
      error: true,
      message: "Invalid job info data",
    };

  const existingJobInfo = await getJobInfo(id, userId);
  if (!existingJobInfo)
    return {
      error: true,
      message: "You don't have permissions to do this",
    };

  const jobInfo = await updateJobInfoDb(id, data);
  redirect(`/home/job-infos/${jobInfo.id}`);
}

async function getJobInfo(id: string, userId: string) {
  "use cache";
  cacheTag(getJobInfoIdTag(id));

  return db.query.JobInfoTable.findFirst({
    where: and(eq(JobInfoTable.id, id), eq(JobInfoTable.userId, userId)),
  });
}
