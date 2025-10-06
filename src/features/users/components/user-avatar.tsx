import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserAvatar({
  user,
}: {
  user: { name: string; imageUrl: string };
}) {
  return (
    <Avatar>
      <AvatarImage src={user.imageUrl} alt={user.name} />
      <AvatarFallback className="uppercase">
        {user.name
          .split(" ")
          .slice(0, 2)
          .map((n) => n[0])
          .join("")}
      </AvatarFallback>
    </Avatar>
  );
}
