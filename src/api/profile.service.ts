import config from '../config';
import httpRequest from '../helpers/httpRequest';
import type {
  IMemberDetailResponse,
  MasterLocationResponse,
} from '../types/profile.type';

function qs(obj: any, prefix: boolean | string) {
  const str: string[] = [];
  for (const p in obj) {
    const k = prefix ? prefix + '[' + p + ']' : p,
      v = obj[p];
    // str.push(typeof(v) == 'object' ? qs(v, k) : (k) + "=" + encodeURIComponent(v));
    str.push(
      typeof v === 'object'
        ? qs(v, k)
        : k + '[like]' + '=' + '%25' + encodeURIComponent(v) + '%25',
    );
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
  getMemberDetail: async function (): Promise<IMemberDetailResponse> {
    try {
      const res = await httpRequest.get('/member_resource/member/', {
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      console.log('Error getting member detail : ', error);
      return Promise.reject(error);
    }
  },
  markAsAgreeTheConsent: async function (): Promise<IMemberDetailResponse> {
    try {
      const res = await httpRequest.get('/member_zone/consent', {
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      console.log('Error getting member detail : ', error);
      return Promise.reject(error);
    }
  },
  secretArea: async function () {
    try {
      return httpRequest.get('/member_resource/member/');
    } catch (error) {
      return Promise.reject(error);
    }
  },
  getKabupaten: async function (parameter: any) {
    try {
      return await httpRequest.get(
        config.apiUrl.resources.masterKabupaten.path +
          '?' +
          qs(parameter, false),
      );
    } catch (error) {
      return Promise.reject(error);
    }
  },
  updatePhoto: async function (id: string) {
    try {
      return await httpRequest.post(
        config.apiUrl.apis.member.updatePhoto.path,
        {
          data: {
            zmemPhoto: id,
          },
        },
      );
    } catch (error) {
      return Promise.reject(error);
    }
  },
  getLocation: async function (parameter?: any) {
    try {
      const url =
        config.steelytoeUrl.href +
        config.steelytoeUrl.apis.masterLocation.path +
        (parameter ? '?' + qs(parameter, false) : '') +
        '&pageSize=25';
      console.info('url getLocation', url);
      return await httpRequest.get<MasterLocationResponse>(url);
    } catch (error) {
      console.info('getLocation error', error);
      return Promise.reject(error);
    }
  },
};

export {ProfileService, ResponseError};
