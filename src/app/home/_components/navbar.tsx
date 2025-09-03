import Link from "next/link";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import { UserDropdown } from "@/features/users/components/user-dropdown";
import { UserDropdownData } from "@/features/users/types";

export function Navbar({ user }: { user: UserDropdownData }) {
  return (
    <nav className="h-header border-b">
      <div className="container h-full flex justify-between items-center">
        <Link href="/home">Ace AI</Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <UserDropdown
            name={user.name}
            imageUrl={user.imageUrl}
            email={user.email}
          />
        </div>
      </div>
    </nav>
  );
}
