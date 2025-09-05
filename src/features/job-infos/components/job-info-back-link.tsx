import { Suspense } from "react";
import { eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

import { cn } from "@/lib/utils";
import { db } from "@/drizzle/db";
import { getJobInfoIdTag } from "../db-cache";
import { JobInfoTable } from "@/drizzle/schema";
import { BackLink } from "@/components/back-link";

export function JobInfoBackLink({
  id,
  className,
}: {
  id: string;
  className?: string;
}) {
  return (
    <BackLink href={`/home/job-infos/${id}`} className={cn("mb-4", className)}>
      <Suspense fallback="Job Info">
        <JobName id={id} />
      </Suspense>
    </BackLink>
  );
}

async function JobName({ id }: { id: string }) {
  const jobInfo = await getJobInfo(id);
  return jobInfo?.name ?? "Job Info";
}

async function getJobInfo(id: string) {
  "use cache";
  cacheTag(getJobInfoIdTag(id));

  return db.query.JobInfoTable.findFirst({
    where: eq(JobInfoTable.id, id),
  });
}
