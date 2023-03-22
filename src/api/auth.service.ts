import {TokenService} from './token.service';
import {AxiosRequestConfig} from 'axios';
import qs from 'qs';
import httpRequest from '../helpers/httpRequest';
import config from '../config';
import base64 from 'react-native-base64';
import Config from 'react-native-config';
import {IAuthResponse, IBindMemberToKompas} from '../types/auth.type';
import Base64 from '../helpers/base64';

type AuthorizeKompasResponse = {
  code: number;
  data: {
    email: string;
    id: string;
    key: string;
    member: string;
  };
};

class AuthenticationError extends Error {
  errorCode: any;
  constructor(errorCode: any, message: string | undefined) {
    super(message);
    this.name = this.constructor.name;
    if (message != null) {
      this.message = message;
    }
    this.errorCode = errorCode;
  }
}

/*
Cookie: _ga=GA1.2.497773815.1612160139; _ga_W4CBNWVN7F=GS1.1.1617966180.42.0.1617966180.0; PHPSESSID=jhgngu6q81jjfp8r6jfpuli2he; _gid=GA1.2.1016394594.1620640129
*/

const AuthService = {
  // getCookies: async function () {
  //   try {
  //     return await httpRequest.getCookies();
  //   } catch (error) {
  //     this.catchError(error);
  //   }
  // },

  // setCookie: async function (key, value) {
  //   try {
  //     return await httpRequest.setCookie(key, value);
  //   } catch (error) {
  //     this.catchError(error);
  //   }
  // },

  sendOTP: async function (phoneData: any) {
    if (!phoneData.countryCode) {
      phoneData.countryCode = 62;
    }
    try {
      return await httpRequest.post(config.apiUrl.apis.member.addPhone.path, {
        data: {
          mbspCountryCode: phoneData.countryCode,
          mbspNumber: parseInt(phoneData.phoneNumber.replace(/\D/g, ''), 10),
        },
      });
    } catch (error) {
      console.log('Error kah ? sepertinya tidak thrwing kemari', error);
      const msg = error as any;
      throw new AuthenticationError(msg.status, msg.data.status.error.message);
    }
  },
  authorizeKompas: async function (
    authorization_code: string,
  ): Promise<AuthorizeKompasResponse> {
    try {
      return await httpRequest.get(
        config.apiUrl.apis.kompas.authorize_code.path,
        {
          params: {
            authorization_code,
            // encodeURIComponent(authorization_code),
          },
        },
      );
    } catch (error) {
      console.log('Error kah ? sepertinya tidak thrwing kemari', error);
      const msg = error as any;
      throw new AuthenticationError(msg.status, msg.data.status.error.message);
    }
  },
  checkEmail: async function (email: any) {
    try {
      return await httpRequest.post(config.apiUrl.apis.member.checkEmail.path, {
        data: {
          email,
        },
      });
    } catch (error) {
      console.log('Error kah ? sepertinya tidak thrwing kemari', error);
      const msg = error as any;
      throw new AuthenticationError(msg.status, msg.data.status.error.message);
    }
  },
  resetPass: async function (emailForm: any) {
    try {
      return await httpRequest.post(
        config.apiUrl.apis.member.resetPassword.path,
        {
          data: {
            email: emailForm.email,
          },
        },
      );
    } catch (error) {
      console.log('Error kah ? sepertinya tidak thrwing kemari', error);
      const msg = error as any;
      throw new AuthenticationError(msg.status, msg.data.status.error.message);
    }
  },
  signup: async function (basicData: any) {
    try {
      return await httpRequest.post(config.apiUrl.apis.member.signup.path, {
        data: basicData,
      });
    } catch (error) {
      console.info('error signup', JSON.stringify(error));
      // const msg = error as any;
      // throw new AuthenticationError(msg.status, msg.data.status.error.message);
      return Promise.reject(error);
    }
  },
  setprofile: async function (personalData: any) {
    try {
      return await httpRequest.post(
        config.apiUrl.apis.member.setProfileAutoApprove.path,
        {
          data: personalData,
        },
      );
      // return await httpRequest.post(config.apiUrl.apis.member.setProfile.path, {
      //   data: personalData,
      // });
    } catch (error) {
      console.info('error setprofile', JSON.stringify(error));
      const msg = error as any;
      throw new AuthenticationError(msg.status, msg.data.status.error.message);
    }
  },
  deleteprofile: async function () {
    try {
      return await httpRequest.get(
        config.apiUrl.apis.member.deleteProfile.path,
      );
    } catch (error) {
      const msg = error as any;
      throw new AuthenticationError(msg.status, msg.data.status.error.message);
    }
  },
  newPassword: async function (passwordData: any) {
    console.log('P : ', passwordData);
    try {
      return await httpRequest.post(
        config.apiUrl.apis.member.newPassword.path +
          passwordData.query.code +
          '/' +
          passwordData.query.key,
        {data: passwordData.form},
      );
    } catch (error) {
      const msg = error as any;
      throw msg;
    }
  },
  authenticateKompas: async function (authenticationUrl: string) {
    try {
      return await httpRequest.get(authenticationUrl);
    } catch (error) {
      const msg = error as any;
      throw msg;
    }
  },
  confirmOTP: async function (otpCode: any) {
    try {
      return await httpRequest.get(
        config.apiUrl.apis.member.verifyPhone.path + otpCode.otpCode,
      );
    } catch (error) {
      // console.log('Error kah ? sepertinya tidak thrwing kemari', error);
      const msg = error as any;
      throw new AuthenticationError(msg.status, msg.data.status.error.message);
    }
  },
  emailVerification: async function (otpCode: any) {
    try {
      return await httpRequest.get(
        config.apiUrl.apis.member.verification.path + otpCode.otpCode,
      );
    } catch (error) {
      // console.log('Error kah ? sepertinya tidak thrwing kemari', error);
      const msg = error as any;
      throw new AuthenticationError(msg.status, msg.data.status.error.message);
    }
  },
  verificationEmail: async function () {
    try {
      return await httpRequest.get(
        config.apiUrl.apis.member.verificationEmail.path,
      );
    } catch (error) {
      // console.log('Error kah ? sepertinya tidak thrwing kemari', error);
      const msg = error as any;
      throw new AuthenticationError(msg.status, msg.data.status.error.message);
    }
  },
  inputVerificationEmail: async function (code: string) {
    try {
      return await httpRequest.get(
        config.apiUrl.apis.member.inputVerificationEmail.path + code,
      );
    } catch (error) {
      // console.log('Error kah ? sepertinya tidak thrwing kemari', error);
      const msg = error as any;
      throw new AuthenticationError(msg.status, msg.data.status.error.message);
    }
  },
  signIn: async function (signInData: any): Promise<IAuthResponse> {
    console.log('Auth service started...');
    // const requestData: AxiosRequestConfig = {
    //   method: "post",
    //   // withCredentials: true,
    //   headers: {
    //     "Content-Type": "application/json",
    //     // Authorization: 'Basic ' + btoa(process.env.VUE_APP_CLIENT_ID + ':' + process.env.VUE_APP_CLIENT_SECRET)
    //   },
    //   url: "/api/v1/member/login/",
    //   data: JSON.stringify({data: {
    //     // "grant_type": "password",
    //     email: signInData.username,
    //     password: signInData.password
    //   }})
    // };
    const credential = {
      email: signInData.username,
      password: signInData.password,
    };

    // try {
    // console.log('CRED: ', credential);
    try {
      const res = await httpRequest.post(
        config.apiUrl.apis.member.login.path,
        {
          data: credential,
        },
        // {
        //   withCredentials: true,
        // },
        // {
        //   headers: {
        //     Authorization:
        //       'Basic ' +
        //       Base64.btoa(Config.CLIENT_ID + ':' + Config.CLIENT_SECRET),
        //   },
        // },
      );

      console.info('login resultssss', res);
      console.info('login resultssss HEADERS', res.headers);
      console.info(
        'login resultssss HEADERS set-cookie',
        res.headers['set-cookie'],
      );

      if (res && res.data) {
        return res.data;
      } else {
        throw new AuthenticationError(500, 'No Response');
      }
    } catch (error) {
      console.log('Error kah ? sepertinya tidak thrwing kemari', error);
      const msg = error as any;
      throw new AuthenticationError(msg.status, msg.data.status.error.message);
      // throw new ResponseError(
      //   error.status,
      //   error.error.message
      // );
    }
    // const response = await httpRequest.post(requestData.url, requestData);
    // console.log('R : ', response);
    // TokenService.saveToken(response.data.access_token);
    // TokenService.saveRefreshToken(response.data.refresh_token);
    // httpRequest.setHeader();

    // httpRequest.mount401Interceptor();

    // return response;
    // } catch (error) {
    //   this.catchError(error);
    // }
  },

  // registerVREvent: async function(data) {
  //     console.log('Do register VR : ', data)
  //     try {
  //         return httpRequest.post('/api/v1/' + config.apiUrl.apis.member.registerVR.path + data.evpaEvnhId, {data: [data]});
  //     } catch (error) {
  //         console.log('Error kah ? sepertinya tidak thrwing kemari', error);
  //         throw new ResponseError(
  //             error.status,
  //             error.error.message
  //         );
  //     }
  // },

  refreshToken: async function () {
    console.info('AuthService.refreshToken');
    const refreshToken = TokenService.getRefreshToken();

    const requestData: AxiosRequestConfig = {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic ' +
          base64.encode(Config.CLIENT_ID + ':' + Config.CLIENT_SECRET),
      },
      url: '/oauth/token',
      data: qs.stringify({
        grant_type: 'refresh_token',
        refreshToken: refreshToken,
      }),
    };

    try {
      const response = await httpRequest(requestData);
      console.info('AuthService.refreshToken - response', response.data);

      TokenService.saveToken(response.data.access_token);
      TokenService.saveRefreshToken(response.data.refresh_token);
      // httpRequest.setHeader(undefined);

      return response.data.access_token;
    } catch (error) {
      console.info('AuthService.refreshToken - error', error);
      const msg = error as any;
      throw new AuthenticationError(msg.status, msg.data.status.error.message);
    }
  },

  signOut: async function () {
    try {
      return await httpRequest.get(config.apiUrl.apis.member.logout.path);
    } catch (error) {
      // console.log('Error kah ? sepertinya tidak thrwing kemari', error);
      const msg = error as any;
      throw new AuthenticationError(msg.status, msg.data.status.error.message);
    }

    // const requestData: AxiosRequestConfig = {
    //   method: "get",
    //   // withCredentials: true,
    //   headers: {
    //     "Content-Type": "application/json",
    //     // Authorization: 'Basic ' + btoa(process.env.VUE_APP_CLIENT_ID + ':' + process.env.VUE_APP_CLIENT_SECRET)
    //   },
    //   url: "/member/logout/"
    // };
    // try {
    //   const response = await httpRequest.customRequest(requestData);
    //   console.log('Signout : ', response);
    //   TokenService.removeToken();
    //   TokenService.removeRefreshToken();
    //   httpRequest.removeHeader();
    //   httpRequest.unmount401Interceptor();
    // } catch (error) {
    //   this.catchError(error);
    // }
  },

  checkSession: async function (): Promise<IAuthResponse> {
    try {
      const res = await httpRequest.get(
        config.apiUrl.apis.member.checkSession.path,
        {withCredentials: true},
      );

      if (res) {
        return res.data;
      } else {
        const msg = {message: 'Empty response'};
        throw msg;
      }
    } catch (error) {
      const msg = error as any;
      throw msg;
    }
  },

  doSsoKompas: async function () {
    try {
      return await httpRequest.get(config.ssoKompasUrl.apis.member.path);
    } catch (error) {
      console.log('Error kah ? sepertinya tidak thrwing kemari', error);
      const msg = error as any;
      throw new AuthenticationError(msg.status, msg.data.status.error.message);
    }
  },

  newMemberViaKompas: async function () {
    try {
      return await httpRequest.get(
        config.ssoKompasUrl.apis.newBorobudurMember.path,
      );
    } catch (error) {
      console.log('Error kah ? sepertinya tidak thrwing kemari', error);
      const msg = error as any;
      throw new AuthenticationError(msg.status, msg.data.status.error.message);
    }
  },

  bindMemberToKompas: async function (): Promise<IBindMemberToKompas> {
    try {
      const res = await httpRequest.get(
        config.ssoKompasUrl.apis.existingBorobudurMember.path,
      );

      return res.data;
    } catch (error) {
      console.log('Error kah ? sepertinya tidak thrwing kemari', error);
      const msg = error as any;
      throw new AuthenticationError(msg.status, msg.data.status.error.message);
    }
  },

  // signup: async function(email: any, password: any, name: any) {
  //   const signupData: AxiosRequestConfig = {
  //     method: "post",
  //     headers: { "Content-Type": "application/json" },
  //     url: "/oauth/signup",
  //     data: {
  //       email: email,
  //       password: password,
  //       name: name
  //     }
  //   };

  //   try {
  //     return await httpRequest.customRequest(signupData);
  //   } catch (error) {
  //     this.catchError(error);
  //   }
  // },

  // catchError: function (error: any) {
  //   let status;
  //   let description;
  //   console.log('Olah error di sini : ', error);

  //   if (error.response === undefined) {
  //     status = error.message;
  //     description = error.message;
  //   } else {
  //     status = error.response.data.status.error.message;
  //     description = error.response.data.status.error.errors.message;
  //   }

  //   throw new AuthenticationError(status, description);
  // },
};

export {AuthService, AuthenticationError};
