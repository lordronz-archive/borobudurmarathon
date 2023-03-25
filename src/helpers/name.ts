export function getShortCodeName(
  name: string,
  excludes?: (number | 'prefix' | 'title' | string)[],
) {
  let shortCode = '';

  if (excludes && excludes.length > 0) {
    excludes = excludes.map(item => {
      if (item === 'prefix') {
        item = 0;
      }
      return item;
    });
  }

  if ((excludes || []).includes('title')) {
    const findCommaIndex = name.indexOf(',');
    if (findCommaIndex > -1) {
      name = name.substring(0, findCommaIndex);
    }
  }
  let words: string[] = name.split(' ');
  words = words.filter(
    (word, index) =>
      !(excludes || []).includes(index) && !(excludes || []).includes(word),
  );
  for (const word of words) {
    if (shortCode.length < 2) {
      shortCode += word.charAt(0);
    }
  }

  if (shortCode.length === 1) {
    shortCode = words[0].substring(0, 2);
  }

  return shortCode.toUpperCase();
}

export function getFullNameFromData(user: any) {
  return user?.linked?.mbsdZmemId && user?.linked?.mbsdZmemId.length > 0
    ? user?.linked?.mbsdZmemId[0].mbsdFullName
    : user?.data && user?.data.length > 0
    ? user?.data[0]?.zmemFullName
    : '';
}
