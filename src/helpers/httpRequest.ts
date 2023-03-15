import axios from 'axios';
import {clearAuth} from '../helpers/auth';
import config from '../config';
// import {getErrorMessage} from './errorHandler';
// import RNRestart from 'react-native-restart';
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
  // if (!axiosConfig.headers.Cookie) {
  //   const cookieString = await getCookiesString();

  //   if (cookieString) {
  //     axiosConfig.headers.Cookie = cookieString;
  //   }
  // }
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
