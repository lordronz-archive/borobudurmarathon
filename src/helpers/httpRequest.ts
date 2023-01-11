import axios from 'axios';
import {clearAuth, getToken} from '../helpers/auth';
import Config from 'react-native-config';
import config from '../config';
// import {getErrorMessage} from './errorHandler';
// import RNRestart from 'react-native-restart';

// Immediately reload the React Native Bundle
const httpRequest = axios.create({
  baseURL: config.apiUrl.href.href,
  // baseURL: Config.API_BASE_URL,
});
console.info('Config.API_BASE_URL', Config.API_BASE_URL);
console.info('config.apiUrl.href.href', config.apiUrl.href.href);

httpRequest.interceptors.request.use(
  async (config: any) => {
    config.headers['Content-Type'] = 'application/json';
    config.headers.Authorization = 'Bearer ' + (await getToken());
    return config;
  },
  error => {
    console.error('httpRequest: Error interceptor request:::', error.response);
    return Promise.reject(error);
  },
);

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
