import { ReactNode, Suspense } from "react";

export function Await<T>({
  promise,
  fallback,
  children,
}: {
  promise: Promise<T>;
  fallback: ReactNode;
  children: (data: T) => ReactNode;
}) {
  return (
    <Suspense fallback={fallback}>
      <AwaitInner promise={promise}>{children}</AwaitInner>
    </Suspense>
  );
}

async function AwaitInner<T>({
  promise,
  children,
}: {
  promise: Promise<T>;
  children: (data: T) => ReactNode;
}) {
  const data = await promise;
  return <>{children(data)}</>;
}
