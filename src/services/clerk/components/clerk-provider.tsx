import { ClerkProvider as MainClerkProvider } from "@clerk/nextjs";

export function ClerkProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <MainClerkProvider>{children}</MainClerkProvider>;
}
