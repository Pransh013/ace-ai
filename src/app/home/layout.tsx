import { redirect } from "next/navigation";

import { getCurrentUser } from "@/services/clerk/lib/get-current-user";
import { Navbar } from "./_components/navbar";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, user } = await getCurrentUser({
    allData: true,
  });

  if (!userId) return redirect("/");
  if (!user) return redirect("/onboarding");

  return (
    <>
      <Navbar user={user} />
      {children}
    </>
  );
}
