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
      const msg = error as any;
      throw new ResponseError(msg.status, msg.data.status.error.message);
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
      const msg = error as any;
      throw new ResponseError(msg.status, msg.data.status.error.message);
    }
  },
  secretArea: async function () {
    try {
      return httpRequest.get('/member_resource/member/');
    } catch (error) {
      const msg = error as any;
      throw new ResponseError(msg.status, msg.data.status.error.message);
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
      const msg = error as any;
      throw msg;
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
      const msg = error as any;
      throw msg;
    }
  },
  getLocation: async function (parameter?: any) {
    try {
      return await httpRequest.get<MasterLocationResponse>(
        config.steelytoeUrl.href +
          config.steelytoeUrl.apis.masterLocation.path +
          (parameter ? '?' + qs(parameter, false) : ''),
      );
    } catch (error) {
      const msg = error as any;
      throw msg;
    }
  },
};

export {ProfileService, ResponseError};
