import {TokenService} from './token.service';
import {AxiosRequestConfig} from 'axios';
import qs from 'qs';
import httpRequest from '../helpers/httpRequest';
import config from '../config';
import base64 from 'react-native-base64';
import Config from 'react-native-config';

type AuthorizeKompasResponse = {
  code: 200;
  data: {
    email: 'aditia.prasetio12@gmail.com';
    id: '170163';
    key: 'c8fd60e4d1835f9b296adf50dfdddde10c0def74d9bb37cf8a36b6f53e2766e299762aab0ef689de2f1228f7db72b2b5';
    member: '39050';
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

  // resetPassword: async function (resetData: any) {
  //   try {
  //     return await httpRequest.post(
  //       apiConfig.apiUrl.apis.member.resetPassword.path,
  //       {data: {email: resetData.username}},
  //     );
  //   } catch (error) {
  //     console.log('Error kah ? sepertinya tidak thrwing kemari', error);
  //     const msg = error as any;
  //     throw new AuthenticationError(msg.status, msg.data.status.error.message);
  //   }
  // },
  // sendOTP: async function (phoneData: any) {
  //   if (!phoneData.countryCode) {
  //     phoneData.countryCode = 62;
  //   }
  //   try {
  //     return await httpRequest.post(
  //       config.apiUrl.apis.member.addPhone.path,
  //       {
  //         data: {
  //           mbspCountryCode: phoneData.countryCode,
  //           mbspNumber: parseInt(phoneData.phoneNumber.replace(/\D/g, '')),
  //         },
  //       },
  //     );
  //   } catch (error) {
  //     console.log('Error kah ? sepertinya tidak thrwing kemari', error);
  //     const msg = error as any;
  //     throw new AuthenticationError(msg.status, msg.data.status.error.message);
  //   }
  // },
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
  checkEmail: async function (emailForm: any) {
    try {
      return await httpRequest.post(config.apiUrl.apis.member.checkEmail.path, {
        data: {
          email: emailForm.email,
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
      const msg = error as any;
      throw new AuthenticationError(msg.status, msg.data.status.error.message);
    }
  },
  setprofile: async function (personalData: any) {
    try {
      return await httpRequest.post(config.apiUrl.apis.member.setProfile.path, {
        data: personalData,
      });
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
  signIn: async function (signInData: any) {
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
      return await httpRequest.post(config.apiUrl.apis.member.login.path, {
        data: credential,
      });
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

      TokenService.saveToken(response.data.access_token);
      TokenService.saveRefreshToken(response.data.refresh_token);
      // httpRequest.setHeader(undefined);

      return response.data.access_token;
    } catch (error) {
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

  checkSession: async function () {
    try {
      return await httpRequest.get(config.apiUrl.apis.member.checkSession.path);
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

  // bindMemberToKompas: async function (): Promise<IBindMemberToKompas> {
  //   try {
  //     const res = await httpRequest.get(
  //       config.ssoKompasUrl.apis.existingBorobudurMember.path,
  //     );

  //     return res.data;
  //   } catch (error) {
  //     console.log('Error kah ? sepertinya tidak thrwing kemari', error);
  //     const msg = error as any;
  //     throw new AuthenticationError(msg.status, msg.data.status.error.message);
  //   }
  // },

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
