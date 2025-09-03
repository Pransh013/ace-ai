import { BackLink } from "@/components/back-link";
import { Card, CardContent } from "@/components/ui/card";
import { JobInfoForm } from "@/features/job-infos/components/job-info-form";

export default function NewJobInfoPage() {
  return (
    <div className="container my-4 lg:my-6 space-y-4">
      <BackLink href="/home">Dashboard</BackLink>
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium">
        Create new Job Info
      </h1>
      <Card>
        <CardContent>
          <JobInfoForm />
        </CardContent>
      </Card>
    </div>
  );
}
