import ApiService from './api.service';

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

const HomeService = {
  profileArea: async function () {
    try {
      return ApiService.get('/api/v1/member_resource/member/');
    } catch (error) {
      const msg = error as any;
      throw new ResponseError(msg.status, msg.error.message);
    }
  },
  secretArea: async function () {
    try {
      return ApiService.get('/api/v1/member_resource/member/');
    } catch (error) {
      const msg = error as any;
      throw new ResponseError(msg.status, msg.error.message);
    }
  },
};

export {HomeService, ResponseError};
