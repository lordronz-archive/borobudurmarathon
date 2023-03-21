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

export function parseUnknownDataToArray(
  data?: string | null,
): {id: number | string; label: string}[] {
  console.info('parseUnknownDataToArray data', data);
  if (!data) {
    return [];
  }
  try {
    data = JSON.parse(data);
  } catch (err) {
    if (data) {
      const exp = data.split(',');
      if (exp.length > 0) {
        return exp.map((item, index) => ({id: index, label: item}));
      } else {
        return [{id: 0, label: data}];
      }
    } else {
      return [];
    }
  }
  if (Array.isArray(data)) {
    return data;
  } else if (data) {
    const exp = data.split(',');
    if (exp.length > 0) {
      return exp.map((item, index) => ({id: index, label: item}));
    } else {
      return [{id: 0, label: data}];
    }
  }
  return [];
}
