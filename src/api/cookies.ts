import CookieManager from '@react-native-cookies/cookies';
import {Platform} from 'react-native';

const maxIteration = 10;

export async function getCookiesString(
  iteration: number = 0,
): Promise<string | undefined> {
  const cookies: {key: string; value: string}[] = [];

  if (Platform.OS === 'ios') {
    // PHPSESSID=rk1kg7l9vt83an3hu7skrl89su; _ga=GA1.2.637971587.1673856684; _gid=GA1.2.393060825.1673856684
    const resCookie = await CookieManager.getAll(true);
    console.info('IOS resCookie cookies', resCookie);

    Object.keys(resCookie).forEach(key => {
      if (resCookie[key].domain === 'my.borobudurmarathon.com') {
        cookies.push({
          key,
          value: resCookie[key].value,
        });
      }
    });
  } else {
    const resCookie = await CookieManager.get(
      'https://my.borobudurmarathon.com',
    );
    console.info('ANDROID resCookie cookies', resCookie);

    Object.keys(resCookie).forEach(key => {
      cookies.push({
        key,
        value: resCookie[key].value,
      });
    });
  }

  // const myBorMarCookie = Object.values(resCookie).find(
  //   item => item.domain === 'my.borobudurmarathon.com',
  // );
  // console.info('myBorMarCookie', myBorMarCookie);

  if (cookies && cookies.length > 0) {
    // return 'PHPSESSID=' + myBorMarCookie?.value;
    const cookiesString = cookies
      .map(item => item.key + '=' + item.value)
      .join(';');
    console.info('cookiesString', cookiesString);
    return cookiesString;
  } else {
    if (iteration < maxIteration) {
      await setTimeout(() => {}, 1000);
      return getCookiesString(iteration + 1);
    }
    return undefined;
  }
  // return 'PHPSESSID=rk1kg7l9vt83an3hu7skrl89su; _ga=GA1.2.637971587.1673856684; _gid=GA1.2.393060825.1673856684';
}
