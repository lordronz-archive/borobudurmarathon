import axios from 'axios';
import {clearAuth} from '../helpers/auth';
import config from '../config';
// import {getErrorMessage} from './errorHandler';
// import RNRestart from 'react-native-restart';
import CookieManager from '@react-native-community/cookies';
import {getCookiesString} from '../api/cookies';

// Immediately reload the React Native Bundle
const httpRequest = axios.create({
  baseURL: config.apiUrl.href.href,
  // baseURL: Config.API_BASE_URL,
  withCredentials: true,
});
// httpRequest.defaults.withCredentials = true;

// console.info('Config.API_BASE_URL', Config.API_BASE_URL);
console.info('config.apiUrl.href.href', config.apiUrl.href.href);

// httpRequest.interceptors.request.use(
//   async (axiosConfig: any) => {
//     axiosConfig.headers['Content-Type'] = 'application/json';
//     axiosConfig.headers.Authorization = 'Bearer ' + (await getToken());
//     return axiosConfig;
//   },
//   error => {
//     console.error('httpRequest: Error interceptor request:::', error.response);
//     return Promise.reject(error);
//   },
// );

// this will check if cookies are there for every request and send request
httpRequest.interceptors.request.use(async (axiosConfig: any) => {
  const resCookie = await CookieManager.getAll();
  const myBorMarCookie = Object.values(resCookie).find(
    item => item.domain === 'my.borobudurmarathon.com',
  );
  console.info('#AXIOS myBorMarCookie', myBorMarCookie);

  const cookieString = await getCookiesString();

  // const cookieString =
  //   'PHPSESSID=6afkdqsvd6rflqi7bsofp8grbc; _ga=GA1.2.637971587.1673856684; _gid=GA1.2.393060825.1673856684';

  if (cookieString) {
    axiosConfig.headers.Cookie = cookieString;
  }
  return axiosConfig;
});

httpRequest.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // return Promise.reject(error);
    if (error && error.response) {
      if (
        error.response.status === 403 ||
        error.response.data.code === 'err_unauthorized'
      ) {
        clearAuth();
        // RNRestart.Restart();
      }
      // console.info(
      //   'httpRequest: Error interceptor response:::',
      //   error.response,
      // );
      // console.info(
      //   'httpRequest: Error interceptor response:::',
      //   getErrorMessage(error),
      // );
      return Promise.reject(error.response);
    } else {
      console.error(error);
    }
  },
);

export default httpRequest;
