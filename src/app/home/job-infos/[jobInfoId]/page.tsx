import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

import { BackLink } from "@/components/back-link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/drizzle/db";
import { JobInfoTable } from "@/drizzle/schema";
import { getJobInfoIdTag } from "@/features/job-infos/db-cache";
import { formatExperienceLevel } from "@/features/job-infos/lib/formatters";
import { getCurrentUser } from "@/services/clerk/lib/get-current-user";
import { Await } from "@/components/await";
import { Skeleton } from "@/components/ui/skeleton";

const options = [
  {
    label: "Answer Technical Questions",
    description:
      "Challenge yourself with technical questions related to the job info.",
    href: "questions",
  },
  {
    label: "Practice Interview",
    description:
      "Practice your interview skills with an AI-powered mock interview.",
    href: "interviews",
  },
  {
    label: "Refine Your Resume",
    description:
      "Get expert feedback on your resume and improve your chances of getting hired.",
    href: "resume",
  },
  {
    label: "Update Job Description",
    description:
      "This should only be used for minor changes to the job description.",
    href: "edit",
  },
];

export default async function JobInfoPage({
  params,
}: {
  params: Promise<{ jobInfoId: string }>;
}) {
  const { jobInfoId } = await params;

  const jobInfo = getCurrentUser().then(
    async ({ userId, redirectToSignIn }) => {
      if (!userId) return redirectToSignIn();

      const jobInfo = await getJobInfo(jobInfoId, userId);
      if (!jobInfo) return notFound();

      return jobInfo;
    }
  );

  return (
    <div className="container my-4 lg:my-6 space-y-4">
      <BackLink href="/home">Dashboard</BackLink>
      <div className="space-y-6">
        <header className="space-y-4">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium">
            <Await promise={jobInfo} fallback={<Skeleton className="w-60" />}>
              {(job) => job.name}
            </Await>
          </h1>
          <div className="flex items-center gap-2">
            <Await
              promise={jobInfo}
              fallback={<Skeleton className="w-20 h-7" />}
            >
              {(job) => (
                <Badge variant="outline">
                  {formatExperienceLevel(job.experienceLevel)}
                </Badge>
              )}
            </Await>
            <Await
              promise={jobInfo}
              fallback={<Skeleton className="w-20 h-7" />}
            >
              {(job) =>
                job.title && <Badge variant="outline">{job.title}</Badge>
              }
            </Await>
          </div>
          <p className="text-sm text-muted-foreground">
            <Await promise={jobInfo} fallback={<Skeleton className="w-full" />}>
              {(job) => job.description}
            </Await>
          </p>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 has-hover:*:not-hover:opacity-50">
          {options.map((option) => (
            <Link
              key={option.href}
              href={`/home/job-infos/${jobInfoId}/${option.href}`}
              className="hover:scale-[1.01] transition-[transform_opacity]"
            >
              <Card className="h-full gap-4">
                <CardHeader>
                  <CardTitle className="text-xl">{option.label}</CardTitle>
                  <CardDescription>{option.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

async function getJobInfo(id: string, userId: string) {
  "use cache";
  cacheTag(getJobInfoIdTag(id));

  return db.query.JobInfoTable.findFirst({
    where: and(eq(JobInfoTable.id, id), eq(JobInfoTable.userId, userId)),
  });
}
