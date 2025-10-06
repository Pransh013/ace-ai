import { Suspense } from "react";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

import { db } from "@/drizzle/db";
import { JobInfoTable } from "@/drizzle/schema";
import { Card, CardContent } from "@/components/ui/card";
import { getJobInfoIdTag } from "@/features/job-infos/db-cache";
import { getCurrentUser } from "@/services/clerk/lib/get-current-user";
import { JobInfoForm } from "@/features/job-infos/components/job-info-form";
import { JobInfoBackLink } from "@/features/job-infos/components/job-info-back-link";

export default async function EditJobInfoPage({
  params,
}: {
  params: Promise<{ jobInfoId: string }>;
}) {
  const { jobInfoId } = await params;

  const { userId, redirectToSignIn } = await getCurrentUser();
  if (!userId) return redirectToSignIn();

  const jobInfo = await getJobInfo(jobInfoId, userId);
  if (!jobInfo) return notFound();

  return (
    <div className="container my-4 lg:my-6 space-y-4">
      <JobInfoBackLink jobInfoId={jobInfoId} />
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium">
        Edit Job Info
      </h1>
      <Card>
        <CardContent>
          <Suspense
            fallback={<Loader2Icon className="size-24 animate-spin mx-auto" />}
          >
            <SuspendedForm jobInfoId={jobInfoId} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

async function SuspendedForm({ jobInfoId }: { jobInfoId: string }) {
  const { userId, redirectToSignIn } = await getCurrentUser();
  if (!userId) return redirectToSignIn();

  const jobInfo = await getJobInfo(jobInfoId, userId);
  if (!jobInfo) return notFound();

  return <JobInfoForm jobInfo={jobInfo} />;
}

async function getJobInfo(id: string, userId: string) {
  "use cache";
  cacheTag(getJobInfoIdTag(id));

  return db.query.JobInfoTable.findFirst({
    where: and(eq(JobInfoTable.id, id), eq(JobInfoTable.userId, userId)),
  });
}
