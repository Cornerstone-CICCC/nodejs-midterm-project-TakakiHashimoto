export const ALLOWED_PRIORITIES = ["low", "medium", "high"] as const;
export const ALLOWED_STATUSES = ["todo", "in-progress", "done"] as const;

export function isPriority(
  value: string,
): value is (typeof ALLOWED_PRIORITIES)[number] {
  return ALLOWED_PRIORITIES.includes(
    value as (typeof ALLOWED_PRIORITIES)[number],
  );
}

export function isStatus(
  value: string,
): value is (typeof ALLOWED_STATUSES)[number] {
  return ALLOWED_STATUSES.includes(value as (typeof ALLOWED_STATUSES)[number]);
}
