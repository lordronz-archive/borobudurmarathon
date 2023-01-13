import config from '../config';
import ApiService from './api.service';
function qs(obj: any, prefix: boolean | string) {
  const str: string[] = [];
  for (const p in obj) {
    const k = prefix ? prefix + '[' + p + ']' : p,
      v = obj[p];
    // str.push(typeof(v) == 'object' ? qs(v, k) : (k) + "=" + encodeURIComponent(v));
    str.push(typeof v === 'object' ? qs(v, k) : k + '=' + v);
  }
  return str.join('&');
}

class ResponseError extends Error {
  errorCode: any;
  errorMessage: any;
  constructor(errorCode: any, message: string | undefined) {
    super(message);
    this.name = this.constructor.name;
    if (message != null) {
      this.message = message;
    }
    this.errorCode = errorCode;
  }
}

const ProfileService = {
  getMemberDetail: async function () {
    try {
      const memberDetail = await ApiService.get('/member_resource/member/');
      //   await ApiService.getCookies();
      // console.log('Member detail plus cookies : ', memberDetail, cookies);
      return memberDetail;
    } catch (error) {
      console.log('Error getting member detail : ', error);
      const msg = error as any;
      throw new ResponseError(msg.status, msg.data.status.error.message);
    }
  },
  secretArea: async function () {
    try {
      return ApiService.get('/member_resource/member/');
    } catch (error) {
      const msg = error as any;
      throw new ResponseError(msg.status, msg.data.status.error.message);
    }
  },
  getKabupaten: async function (parameter: any) {
    try {
      return await ApiService.fetch(
        config.apiUrl.resources.masterKabupaten.path +
          '?' +
          qs(parameter, false),
      );
    } catch (error) {
      const msg = error as any;
      throw msg;
    }
  },
};

export {ProfileService, ResponseError};
