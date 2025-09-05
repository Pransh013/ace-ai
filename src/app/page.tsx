import { SignInButton, UserButton } from "@clerk/nextjs";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import { PricingTable } from "@/services/clerk/components/pricing-table";

export default function RootPage() {
  return (
    <div className="bg-gradient-to-b from-background to-muted/80 h-screen">
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <SignInButton />
        <UserButton />
      </div>
      <PricingTable />
    </div>
  );
}
