import i18next from 'i18next';

export function getTextBasedOnLanguage(
  val: string,
  language?: 'en' | 'id' | string,
) {
  console.info('------val', val);
  if (!language) {
    language = i18next.language;
  }
  // console.info('JSON.parse(val)', JSON.parse(val));
  try {
    const res: any = JSON.parse(val);
    return res[language];
  } catch {
    return val;
  }
}
