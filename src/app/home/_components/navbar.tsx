import { ThemeToggle } from "@/components/ui/theme-toggle";
import { UserDropdown } from "./user-dropdown";
import Link from "next/link";

export function Navbar({
  user,
}: {
  user: { name: string; imageUrl: string; email: string };
}) {
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
