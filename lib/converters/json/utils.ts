export function formatDatetime(datetime: Date): string {
  return datetime.toISOString().split(".")[0] + "Z";
}
