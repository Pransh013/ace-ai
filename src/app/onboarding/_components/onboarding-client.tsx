"use client";

import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { getUser } from "@/features/users/actions";

export function OnboardingClient({ userId }: { userId: string }) {
  const router = useRouter();

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const user = await getUser(userId);
      if (!user) return;
      router.replace("/home");
      clearInterval(intervalId);
    }, 500);

    return () => {
      clearInterval(intervalId);
    };
  }, [userId, router]);

  return <Loader2Icon className="animate-spin size-16" />;
}
