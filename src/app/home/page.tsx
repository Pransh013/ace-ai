import Link from "next/link";
import { Suspense } from "react";
import { desc, eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { Loader2Icon, PlusIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/drizzle/db";
import { JobInfoTable } from "@/drizzle/schema";
import { JobInfoForm } from "@/features/job-infos/components/job-info-form";
import { getJobInfoUserTag } from "@/features/job-infos/db-cache";
import { getCurrentUser } from "@/services/clerk/lib/get-current-user";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatExperienceLevel } from "@/features/job-infos/lib/formatters";

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen-header flex items-center justify-center">
          <Loader2Icon className="animate-spin size-16" />
        </div>
      }
    >
      <JobInfos />
    </Suspense>
  );
}

async function JobInfos() {
  const { userId, redirectToSignIn } = await getCurrentUser();
  if (!userId) return redirectToSignIn();

  const jobInfos = await getJobInfos(userId);
  if (jobInfos.length === 0) return <NoJobInfos />;

  return (
    <div className="container my-4 lg:my-6">
      <div className="flex justify-between items-center gap-2 mb-6">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium">
          Select a Job Info
        </h1>
        <Button asChild>
          <Link href="/home/job-infos/new">
            <PlusIcon />
            Create Job Info
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 has-hover:*:not-hover:opacity-50">
        {jobInfos.map((job) => (
          <Link
            key={job.id}
            href={`/home/job-infos/${job.id}`}
            className="hover:scale-[1.02] transition-[transform_opacity]"
          >
            <Card className="h-full gap-4">
              <CardHeader>
                <CardTitle className="text-xl">{job.name}</CardTitle>
              </CardHeader>
              <CardContent className="line-clamp-3 text-muted-foreground">
                {job.description}
              </CardContent>
              <CardFooter className="space-x-3">
                <Badge variant="outline">
                  {formatExperienceLevel(job.experienceLevel)}
                </Badge>
                {job.title && <Badge variant="outline">{job.title}</Badge>}
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

function NoJobInfos() {
  return (
    <div className="container my-4 max-w-5xl">
      <h1 className="text-3xl md:text-4xl lg:text-5xl mb-4 font-semibold">
        Welcome to Ace AI
      </h1>
      <p className="text-muted-foreground mb-8">
        To get started, enter information about the type of job you are wanting
        to apply for. This can be specific information copied directly from a
        job listing or general information such as the tech stack you want to
        work in. The more specific you are in the description the closer the
        test interviews will be to the real thing.
      </p>
      <Card>
        <CardContent>
          <JobInfoForm />
        </CardContent>
      </Card>
    </div>
  );
}

async function getJobInfos(userId: string) {
  "use cache";
  cacheTag(getJobInfoUserTag(userId));

  return db.query.JobInfoTable.findMany({
    where: eq(JobInfoTable.userId, userId),
    orderBy: desc(JobInfoTable.updatedAt),
  });
}
