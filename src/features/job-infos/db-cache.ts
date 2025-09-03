import { getGlobalTag, getIdTag, getUserTag } from "@/lib/data-cache";
import { revalidateTag } from "next/cache";

export function getJobInfoGlobalTag() {
  return getGlobalTag("job-infos");
}

export function getJobInfoUserTag(userId: string) {
  return getUserTag("job-infos", userId);
}

export function getJobInfoIdTag(id: string) {
  return getIdTag("job-infos", id);
}

export function revalidateJobInfoCache({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) {
  revalidateTag(getJobInfoGlobalTag());
  revalidateTag(getJobInfoIdTag(id));
  revalidateTag(getJobInfoUserTag(userId));
}
