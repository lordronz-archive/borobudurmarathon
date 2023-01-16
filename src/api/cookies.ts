import CookieManager from '@react-native-community/cookies';

export async function getCookiesString() {
  // PHPSESSID=rk1kg7l9vt83an3hu7skrl89su; _ga=GA1.2.637971587.1673856684; _gid=GA1.2.393060825.1673856684
  const resCookie = await CookieManager.getAll(true);
  console.info('resCookie cookies', resCookie);

  const cookies: {key: string; value: string}[] = [];
  Object.keys(resCookie).forEach(key => {
    if (resCookie[key].domain === 'my.borobudurmarathon.com') {
      cookies.push({
        key,
        value: resCookie[key].value,
      });
    }
  });
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
    return undefined;
  }
  // return 'PHPSESSID=rk1kg7l9vt83an3hu7skrl89su; _ga=GA1.2.637971587.1673856684; _gid=GA1.2.393060825.1673856684';
}
