/**
 * Safely parses a JSON string, returning null if it fails or is empty.
 * This quarantines the try/catch away from your business logic.
 */
export const safe_parse_json = <T>(raw: string | null): T | null => {
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}
