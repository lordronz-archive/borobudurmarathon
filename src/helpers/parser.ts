export function parseStringToArray<T>(data?: string): T[] {
  if (!data) {
    return [];
  }
  try {
    data = JSON.parse(data);
  } catch (err) {
    return [];
  }
  if (Array.isArray(data)) {
    return data;
  }
  return [];
}
