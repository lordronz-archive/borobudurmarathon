import CookieManager from '@react-native-community/cookies';
import {AxiosRequestConfig} from 'axios';
import config from '../config';
import httpRequest from '../helpers/httpRequest';
import {TokenService} from './token.service';

const ApiService = {
  _requestInterceptor: 0,
  _401interceptor: 0,

  setHeader() {
    httpRequest.defaults.headers.common.Authorization = `Bearer ${TokenService.getToken()}`;
  },

  removeHeader() {
    httpRequest.defaults.headers.common = {};
  },

  async get(resource: string) {
    return new Promise((resolve, reject) => {
      httpRequest
        .get(resource)
        .then(res => {
          // console.log(config.debug);
          if (config.debug) {
            console.log('GET RESPONSE : ', res);
          }
          // context.commit("signInSuccess", res);
          if (res.status >= 200 && res.status <= 299) {
            resolve(res);
          } else {
            reject(res);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  async fetch(resource: string) {
    return new Promise((resolve, reject) => {
      httpRequest
        .get(resource)
        .then(res => {
          // console.log(config.debug);
          if (config.debug) {
            console.log('GET RESPONSE : ', res);
          }
          // context.commit("signInSuccess", res);
          if (res.status >= 200 && res.status <= 299) {
            resolve(res);
          } else {
            reject(res);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
    // console.log('GOT RESPONSE : ', resp);
    // return resp;
  },

  async getExternal(resource: string) {
    // const loading = await loadingController.create({
    //   message: 'Loading, Please Wait...',
    // });
    // await loading.present();
    return new Promise((resolve, reject) => {
      httpRequest
        .get(resource)
        .then(res => {
          // console.log(config.debug);
          if (config.debug) {
            console.log('GET RESPONSE : ', res);
          }
          // context.commit("signInSuccess", res);
          if (res.status >= 200 && res.status <= 299) {
            resolve(res);
          } else {
            reject(res);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
    // console.log('GOT RESPONSE : ', resp);
    // return resp;
  },

  async getPDF(resource: string) {
    // const loading = await loadingController.create({
    //   message: 'Loading, Please Wait...',
    // });
    // await loading.present();
    const requestParam = {
      method: 'GET',
      url: resource,
      headers: {'Content-Type': 'application/pdf'},
      // data: JSON.parse(request.data)
    };
    return new Promise((resolve, reject) => {
      httpRequest(requestParam)
        .then(res => {
          // console.log(config.debug);
          if (config.debug) {
            console.log('GET RESPONSE : ', res);
          }
          // context.commit("signInSuccess", res);
          if (res.status >= 200 && res.status <= 299) {
            resolve(res);
          } else {
            reject(res);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
    // console.log('GOT RESPONSE : ', resp);
    // return resp;
  },

  async post(resource: string, data: any) {
    // return httpRequest.post(resource, data);
    // console.log('POST : ', request);
    const requestParam = {
      method: 'POST',
      url: resource,
      headers: {'Content-Type': 'application/json'},
      data: JSON.parse(JSON.stringify(data)),
    };
    if (config.debug) {
      console.log('POST PARAM : ', requestParam);
    }
    return new Promise((resolve, reject) => {
      httpRequest(requestParam)
        .then(res => {
          console.log('POST RESPONSE : ', res);
          // context.commit("signInSuccess", res);
          if (res.status >= 200 && res.status <= 299) {
            resolve(res);
          } else {
            reject(res);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
    // return httpRequest.get(requestParam);
  },

  async postExternal(resource: string, data: any) {
    // return httpRequest.post(resource, data);
    // console.log('POST : ', request);
    const requestParam = {
      method: 'POST',
      url: resource,
      headers: {'Content-Type': 'application/json'},
      data: data,
    };
    if (config.debug) {
      console.log('POST PARAM : ', requestParam);
    }
    return new Promise((resolve, reject) => {
      httpRequest(requestParam)
        .then(res => {
          console.log('POST RESPONSE : ', res);
          // context.commit("signInSuccess", res);
          if (res.status >= 200 && res.status <= 299) {
            resolve(res);
          } else {
            reject(res);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
    // return httpRequest.get(requestParam);
  },

  // async getCookies() {
  //   return await Http.getCookies({
  //     url: process.env.VUE_APP_ROOT_API,
  //   });
  // },

  // async setCookie(key, value) {
  //   return await Http.setCookie({
  //     url: process.env.VUE_APP_ROOT_API,
  //     key: key,
  //     value: value,
  //   });
  // },

  put(resource: string, data: any) {
    return httpRequest.put(resource, data);
  },

  delete(resource: string) {
    return httpRequest.delete(resource);
  },

  customRequest(request: AxiosRequestConfig) {
    if (config.debug) {
      console.log('REQUEST : ', request);
    }
    let method = 'GET';
    if (request.method) {
      method = request.method.toUpperCase();
    }
    const requestParam = {
      method: method,
      url: request.url,
      headers: {'Content-Type': 'application/json'},
      data: new Object(),
    };
    if (request.data !== undefined) {
      requestParam.data = JSON.parse(request.data);
    }
    if (config.debug) {
      console.log('REQUEST PARAM : ', requestParam);
    }
    return httpRequest(requestParam);
    // console.log('CUSTOM RESPONSE : ', resp);
    // return resp;
    // return httpRequest(data);
  },

  // async customRequest(request: AxiosRequestConfig) {
  //     console.log('REQUEST : ', request);
  //     const resp = await httpRequest.get({
  //         method: request.method,
  //         url: request.url,
  //         headers: { "Content-Type": "application/json" },
  //         data: JSON.parse(request.data)
  //     });
  //     console.log('CUSTOM RESPONSE : ', resp);
  //     return resp;
  //     // return httpRequest(data);
  // },

  // mountRequestInterceptor() {
  // this._requestInterceptor = httpRequest.interceptors.request.use(async config => {
  //   // console.log('show loading');
  //   // const loading = await loadingController.create({
  //   //   message: 'Please wait...',
  //   // });
  //   // await loading.present();

  //   return config;
  // });
  // },

  // mount401Interceptor() {
  //   this._401interceptor = httpRequest.interceptors.response.use(
  //     response => {
  //       loadingController.dismiss().then(r => console.log(r));
  //       return response;
  //     },
  //     async error => {
  //       loadingController.dismiss().then(r => console.log(r));
  //       if (error.request.status === 401) {
  //         if (error.config.url.includes('oauth/token')) {
  //           await store.dispatch('auth/signOut');
  //           throw error;
  //         } else {
  //           try {
  //             await store.dispatch('auth/refreshToken');
  //             return this.customRequest({
  //               method: error.config.method,
  //               url: error.config.url,
  //               data: error.config.data,
  //             });
  //           } catch (e) {
  //             throw error;
  //           }
  //         }
  //       }
  //       throw error;
  //     },
  //   );
  // },

  // unmount401Interceptor() {
  //   httpRequest.interceptors.response.eject(this._401interceptor);
  // },
};

export default ApiService;
