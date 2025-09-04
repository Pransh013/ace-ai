import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "animate-pulse bg-muted rounded h-[1.2em] w-full max-w-full inline-block align-bottom",
        className
      )}
    />
  );
}
