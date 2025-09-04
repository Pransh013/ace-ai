import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { UserDropdown } from "@/features/users/components/user-dropdown";
import { UserDropdownData } from "@/features/users/types";

export function Navbar({ user }: { user: UserDropdownData }) {
  return (
    <nav className="h-header border-b">
      <div className="container h-full flex justify-between items-center">
        <NavbarLogo />
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

export const NavbarLogo = ({ className }: { className?: string }) => {
  return (
    <Link
      href="/"
      className={cn(
        "relative z-20 mr-4 flex items-center space-x-3 py-1 text-2xl font-bold text-foreground",
        className
      )}
    >
      <Image
        src="https://assets.aceternity.com/logo-dark.png"
        alt="logo"
        width={34}
        height={34}
        className="invert dark:invert-0"
      />
      <span>Ace AI</span>
    </Link>
  );
};
