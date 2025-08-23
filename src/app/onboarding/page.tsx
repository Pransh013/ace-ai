import { redirect } from "next/navigation";

import { getCurrentUser } from "@/services/clerk/lib/get-current-user";
import { OnboardingClient } from "./_components/onboarding-client";

export default async function OnboardingPage() {
  const { userId } = await getCurrentUser();

  if (!userId) return redirect("/");

  return (
    <div className="h-screen container flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl">Creating your account...</h1>
      <OnboardingClient userId={userId} />
    </div>
  );
}
