import ApiService from './api.service';
// import qs from "qs";

function qs(obj, prefix) {
  const str: string[] = [];
  for (const p in obj) {
    const k = prefix ? prefix + '[' + p + ']' : p,
      v = obj[p];
    // str.push(typeof(v) == 'object' ? qs(v, k) : (k) + "=" + encodeURIComponent(v));
    str.push(typeof v == 'object' ? qs(v, k) : k + '=' + v);
  }
  return str.join('&');
}

console.log('CONFIG: ', ApiService.config);

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

const EventService = {
  getVRRecords: async function (data) {
    // console.log('VR Data : ', data);
    let transactionId;
    if (data.mrvrTrnsId) transactionId = data.mrvrTrnsId;
    if (data.mregTrnsId) transactionId = data.mregTrnsId;
    try {
      return ApiService.get(
        ApiService.config.apiUrl.apis.member.getVRRecords.path +
          '?' +
          qs({pageSize: 100, filter: {vrdhTrnsId: transactionId}}, false),
      );
    } catch (error) {
      console.log('E : ', error);
      const msg = error as any;
      throw new ResponseError(msg.status, msg.error.message);
    }
  },
  getTransaction: async function (transactionId) {
    console.log('Transaction id to get : ', transactionId);
    try {
      return ApiService.get(
        ApiService.config.apiUrl.apis.member.getTransaction.path +
          '/' +
          transactionId,
      );
    } catch (error) {
      console.log('E : ', error);
      const msg = error as any;
      throw new ResponseError(msg.status, msg.error.message);
    }
  },
  getGarminAuthLink: async function () {
    console.log('Authenticate garmin now...');
    try {
      return ApiService.get(ApiService.config.apiUrl.apis.vr.authGarmin.path);
    } catch (error) {
      console.log('E : ', error);
      const msg = error as any;
      throw new ResponseError(msg.status, msg.error.message);
    }
  },
  getGarminActivities: async function (memberId) {
    console.log('Get garmin activities now...', memberId);
    const parameter = {
      filter: {
        // mmacZmemId: 5005,
        mmacZmemId: memberId,
      },
      sort: '-mmacStartTime',
      pageSize: 100,
    };
    try {
      return ApiService.get(
        ApiService.config.apiUrl.apis.vr.garminActivities.path +
          '?' +
          qs(parameter, false),
      );
    } catch (error) {
      console.log('E : ', error);
      const msg = error as any;
      throw new ResponseError(msg.status, msg.error.message);
    }
  },
  getVRBIB: async function (participantId) {
    console.log('Get BIB of ... ', participantId);
    try {
      const fileResponse = await fetch(
        ApiService.config.files.href +
          ApiService.config.files.apis.bib.path +
          '/' +
          participantId,
      );
      const fileBlob = await fileResponse.blob();
      return fileBlob;
    } catch (error) {
      console.log('E : ', error);
      const msg = error as any;
      throw new ResponseError(msg.status, msg.error.message);
    }
  },
  getVRCertificate: async function (certificateURL) {
    console.log('Get Certificate ... ', certificateURL);
    try {
      const fileResponse = await fetch(
        ApiService.config.files.href +
          ApiService.config.files.apis.certificate.path +
          '/' +
          certificateURL,
      );
      const fileBlob = await fileResponse.blob();
      return fileBlob;
    } catch (error) {
      console.log('E : ', error);
      const msg = error as any;
      throw new ResponseError(msg.status, msg.error.message);
    }
  },
  getEvent: async function (eventId) {
    console.log('Event id to get : ', eventId);
    try {
      return ApiService.get(
        ApiService.config.apiUrl.apis.event.detail.path + '/' + eventId,
      );
    } catch (error) {
      console.log('E : ', error);
      const msg = error as any;
      throw new ResponseError(msg.status, msg.error.message);
    }
  },
  confirmVRRecord: async function (transactionId, data) {
    console.log('D : ', data, transactionId);
    try {
      return ApiService.get(
        ApiService.config.apiUrl.apis.member.confirmVRRecord.path +
          data.id +
          '/' +
          transactionId,
      );
    } catch (error) {
      console.log('E : ', error);
      const msg = error as any;
      throw new ResponseError(msg.status, msg.error.message);
    }
  },
  getEvents: async function () {
    const parameter = {
      filter: {
        evnhEmail: 'reg@borobudurmarathon.co.id',
        evnhType: {
          in: [2, 1, 7],
        },
        evnhStatusPublish: 1,
      },
      sort: '-evnhStartDate',
    };
    if (process.env.VUE_APP_ISDEV === 'true') {
      console.log('Developing.....', process.env);
      parameter.filter.evnhEmail = 'dev@borobudurmarathon.com';
    }
    try {
      return ApiService.get('/resources/event_header?' + qs(parameter, false));
    } catch (error) {
      const msg = error as any;
      throw new ResponseError(msg.status, msg.error.message);
    }
  },
  registerVREvent: async function (data) {
    console.log('Do register VR : ', data);
    try {
      return ApiService.post(
        ApiService.config.apiUrl.apis.member.registerVR.path + data.evpaEvnhId,
        {data: [data]},
      );
    } catch (error) {
      console.log('Error kah ? sepertinya tidak thrwing kemari', error);
      const msg = error as any;
      throw new ResponseError(msg.status, msg.error.message);
    }
  },
  registerEvent: async function (data) {
    console.log('Do register Event : ', data);
    try {
      return ApiService.post(
        ApiService.config.apiUrl.apis.member.registerEvent.path +
          data.evpaEvnhId,
        {data: [data]},
      );
    } catch (error) {
      console.log('Error kah ? sepertinya tidak thrwing kemari', error);
      const msg = error as any;
      throw new ResponseError(msg.status, msg.error.message);
    }
  },
  submitVRActivity: async function (transactionId, data) {
    console.log('Do submit VR data : ', data);
    try {
      return ApiService.post(
        ApiService.config.apiUrl.apis.member.addVRRecord.path + transactionId,
        {data: data},
      );
    } catch (error) {
      console.log('Error kah ? sepertinya tidak thrwing kemari', error);
      const msg = error as any;
      throw new ResponseError(msg.status, msg.error.message);
    }
  },
  generateBillingID: async function (data) {
    console.log('Generate billing ID : ', data);
    try {
      // return ApiService.post(ApiService.config.apiUrl.apis.member.addVRRecord.path + transactionId, {data: data});
    } catch (error) {
      console.log('Error kah ? sepertinya tidak thrwing kemari', error);
      const msg = error as any;
      throw new ResponseError(msg.status, msg.error.message);
    }
  },
  logVRActivity: async function (id, data) {
    console.log('Do LOG VR data : ', data);
    try {
      return ApiService.post('lumbini/log_myborobudur/' + id, {data: data});
    } catch (error) {
      console.log('Error kah ? sepertinya tidak thrwing kemari', error);
      const msg = error as any;
      throw new ResponseError(msg.status, msg.error.message);
    }
  },
  checkoutTransaction: async function (data) {
    console.log('Data to checkout : ', data);
    try {
      return ApiService.get(
        ApiService.config.apiUrl.apis.member.checkout.path +
          data.transactionId +
          '/' +
          data.paymentType,
      );
    } catch (error) {
      console.log('Error kah ? sepertinya tidak thrwing kemari', error);
      throw error;
      // const msg = (error as any);
      // throw new ResponseError(
      // msg
      // );
    }
  },
  applyCoupon: async function (data) {
    console.log('Data to checkout : ', data);
    try {
      return ApiService.postExternal(
        ApiService.config.couponApiUrl.href +
          ApiService.config.couponApiUrl.apis.apply.path,
        {data: data},
      );
    } catch (error) {
      console.log('Error kah ? sepertinya tidak thrwing kemari', error);
      throw error;
      // const msg = (error as any);
      // throw new ResponseError(
      // msg
      // );
    }
  },
  // export function checkout({transactionId, paymentType}){
  // var idToParse = transactionId + '/' + paymentType
  // return user('checkout', {id:idToParse})
};

export {EventService, ResponseError};
