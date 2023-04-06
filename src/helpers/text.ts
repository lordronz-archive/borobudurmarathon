import i18next from 'i18next';

export function getTextBasedOnLanguage(
  val: string | any,
  language?: 'en' | 'id' | string,
) {
  console.info('------val', val);
  console.info('------typeof val', typeof val);
  if (!language) {
    language = i18next.language;
  }

  if (typeof val === 'object') {
    return val[language];
  } else {
    // console.info('JSON.parse(val)', JSON.parse(val));
    try {
      const res: any = JSON.parse(val);
      return res[language];
    } catch {
      return val;
    }
  }
}
