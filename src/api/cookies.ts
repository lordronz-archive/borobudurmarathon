import CookieManager from '@react-native-community/cookies';

export async function getCookiesString() {
  // PHPSESSID=rk1kg7l9vt83an3hu7skrl89su; _ga=GA1.2.637971587.1673856684; _gid=GA1.2.393060825.1673856684
  const resCookie = await CookieManager.getAll(true);
  console.info('resCookie cookies', resCookie);
  const myBorMarCookie = Object.values(resCookie).find(
    item => item.domain === 'my.borobudurmarathon.com',
  );
  console.info('myBorMarCookie', myBorMarCookie);

  return 'PHPSESSID=' + myBorMarCookie?.value;
  // return 'PHPSESSID=rk1kg7l9vt83an3hu7skrl89su; _ga=GA1.2.637971587.1673856684; _gid=GA1.2.393060825.1673856684';
}
