type CacheTag = "users" | "job-infos" | "questions" | "interviews";

export function getGlobalTag(tag: CacheTag) {
  return `global:${tag}` as const;
}

export function getIdTag(tag: CacheTag, id: string) {
  return `id:${id}:${tag}` as const;
}
export function getUserTag(tag: CacheTag, userId: string) {
  return `user:${userId}:${tag}` as const;
}

export function getJobInfoTag(tag: CacheTag, jobInfoId: string) {
  return `job-info:${jobInfoId}:${tag}` as const;
}
