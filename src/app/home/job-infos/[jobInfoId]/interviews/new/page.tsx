import { Suspense } from "react";
import { and, eq } from "drizzle-orm";
import { fetchAccessToken } from "hume";
import { Loader2Icon } from "lucide-react";
import { VoiceProvider } from "@humeai/voice-react";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

import { db } from "@/drizzle/db";
import { env } from "@/env/server";
import { JobInfoTable } from "@/drizzle/schema";
import { StartCall } from "./_components/start-call";
import { getJobInfoIdTag } from "@/features/job-infos/db-cache";
import { getCurrentUser } from "@/services/clerk/lib/get-current-user";

export default async function NewInterviewPage({
  params,
}: {
  params: Promise<{ jobInfoId: string }>;
}) {
  const { jobInfoId } = await params;
  return (
    <Suspense
      fallback={
        <div className="h-screen-header flex items-center justify-center">
          <Loader2Icon className="animate-spin size-24" />
        </div>
      }
    >
      <SuspendedPage jobInfoId={jobInfoId} />
    </Suspense>
  );
}

async function SuspendedPage({ jobInfoId }: { jobInfoId: string }) {
  const { userId, user, redirectToSignIn } = await getCurrentUser({
    allData: true,
  });

  if (!userId || !user) return redirectToSignIn();

  const jobInfo = await getJobInfo(jobInfoId, userId);
  if (!jobInfo) return null;

  const accessToken = await fetchAccessToken({
    apiKey: env.HUME_API_KEY,
    secretKey: env.HUME_SECRET_KEY,
  });

  return (
    <VoiceProvider>
      <StartCall accessToken={accessToken} jobInfo={jobInfo} user={user} />
    </VoiceProvider>
  );
}

async function getJobInfo(id: string, userId: string) {
  "use cache";
  cacheTag(getJobInfoIdTag(id));

  return db.query.JobInfoTable.findFirst({
    where: and(eq(JobInfoTable.id, id), eq(JobInfoTable.userId, userId)),
  });
}
