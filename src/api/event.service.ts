import config from '../config';
import httpRequest from '../helpers/httpRequest';
import {GetEventResponse, GetEventsResponse} from '../types/event.type';
import ApiService from './api.service';
import QRCode from 'qrcode';
import {ISponsorResponse} from '../types/sponsor.type';

function qs(obj: any, prefix: any) {
  const str: string[] = [];
  for (const p in obj) {
    const k = prefix ? prefix + '[' + p + ']' : p,
      v = obj[p];
    // str.push(typeof(v) == 'object' ? qs(v, k) : (k) + "=" + encodeURIComponent(v));
    str.push(typeof v === 'object' ? qs(v, k) : k + '=' + v);
  }
  return str.join('&');
}

console.log('CONFIG: ', config);

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
  getVRRecords: async function (data: any) {
    // console.log('VR Data : ', data);
    let transactionId;
    if (data.mrvrTrnsId) {
      transactionId = data.mrvrTrnsId;
    }
    if (data.mregTrnsId) {
      transactionId = data.mregTrnsId;
    }
    try {
      return ApiService.get(
        config.apiUrl.apis.member.getVRRecords.path +
          '?' +
          qs({pageSize: 100, filter: {vrdhTrnsId: transactionId}}, false),
      );
    } catch (error) {
      console.log('E : ', error);
      const msg = error as any;
      throw new ResponseError(msg.status, msg.error.message);
    }
  },
  getTransaction: async function () {
    try {
      return ApiService.get(config.apiUrl.apis.member.getTransaction.path);
    } catch (error) {
      console.log('E : ', error);
      const msg = error as any;
      throw new ResponseError(msg.status, msg.error.message);
    }
  },
  getTransactionDetail: async function (transactionId: string): Promise<any> {
    console.log('Transaction id to get : ', transactionId);
    try {
      return ApiService.get(
        config.apiUrl.apis.member.getTransactionDetail.path +
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
      return ApiService.get(config.apiUrl.apis.vr.authGarmin.path);
    } catch (error) {
      console.log('E : ', error);
      const msg = error as any;
      throw new ResponseError(msg.status, msg.error.message);
    }
  },
  async generateQR(data: any) {
    try {
      const resp = await QRCode.toString(data, {
        errorCorrectionLevel: 'H',
        width: 200,
        margin: 2,
      });
      // console.log('QR Response : ', resp);
      return resp;
    } catch (e) {
      console.log('Generate QR Error:', e);
      return e;
    }
  },
  getGarminActivities: async function (memberId: string) {
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
        config.apiUrl.apis.vr.garminActivities.path +
          '?' +
          qs(parameter, false),
      );
    } catch (error) {
      console.log('E : ', error);
      const msg = error as any;
      throw new ResponseError(msg.status, msg.error.message);
    }
  },
  getVRBIB: async function (participantId: string) {
    console.log('Get BIB of ... ', participantId);
    try {
      const fileResponse = await fetch(
        config.files.href + config.files.apis.bib.path + '/' + participantId,
      );
      const fileBlob = await fileResponse.blob();
      return fileBlob;
    } catch (error) {
      console.log('E : ', error);
      const msg = error as any;
      throw new ResponseError(msg.status, msg.error.message);
    }
  },
  getVRCertificate: async function (certificateURL: string) {
    console.log('Get Certificate ... ', certificateURL);
    try {
      const fileResponse = await fetch(
        config.files.href +
          config.files.apis.certificate.path +
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
  getEvent: async function (eventId: number): Promise<GetEventResponse> {
    console.log('Event id to get : ', eventId);
    try {
      const res = await httpRequest.get(
        config.apiUrl.apis.event.detail.path + '/' + eventId,
      );
      return res.data;
    } catch (error) {
      console.log('E : ', error);
      const msg = error as any;
      throw new ResponseError(msg.status, msg.error.message);
    }
  },
  confirmVRRecord: async function (transactionId: string, data: any) {
    console.log('D : ', data, transactionId);
    try {
      return ApiService.get(
        config.apiUrl.apis.member.confirmVRRecord.path +
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
  getEvents: async function (featured = false): Promise<GetEventsResponse> {
    const parameter = {
      filter: {
        evnhEmail: 'reg@borobudurmarathon.co.id',
        evnhType: {
          in: [2, 1, 7],
        },
        evnhStatusPublish: 1,
        ...(featured && {evnhFuture: 1}),
      },
      sort: '-evnhStartDate',
    };
    if (config.isDev) {
      console.log('Developing.....');
      parameter.filter.evnhEmail = 'dev@borobudurmarathon.com';
    }
    try {
      const res = await httpRequest.get(
        '/resources/event_header?' + qs(parameter, false),
      );

      return res.data;
    } catch (error) {
      const msg = error as any;
      throw new ResponseError(msg.status, msg.error.message);
    }
  },
  registerVREvent: async function (data: any) {
    console.log('Do register VR : ', data);
    try {
      return ApiService.post(
        config.apiUrl.apis.member.registerVR.path + data.evpaEvnhId,
        {data: [data]},
      );
    } catch (error) {
      console.log('Error kah ? sepertinya tidak thrwing kemari', error);
      const msg = error as any;
      throw new ResponseError(msg.status, msg.error.message);
    }
  },
  registerEvent: async function (data: any) {
    console.log('Do register Event : ', data);
    try {
      return ApiService.post(
        config.apiUrl.apis.member.registerBallot.path + data.evpaEvnhId,
        {data: [data]},
      );
    } catch (error) {
      console.log('Error kah ? sepertinya tidak thrwing kemari', error);
      const msg = error as any;
      throw new ResponseError(msg.status, msg.error.message);
    }
  },
  submitVRActivity: async function (transactionId: string, data: any) {
    console.log('Do submit VR data : ', data);
    try {
      return ApiService.post(
        config.apiUrl.apis.member.addVRRecord.path + transactionId,
        {data: data},
      );
    } catch (error) {
      console.log('Error kah ? sepertinya tidak thrwing kemari', error);
      const msg = error as any;
      throw new ResponseError(msg.status, msg.error.message);
    }
  },
  generateBillingID: async function (data: any) {
    console.log('Generate billing ID : ', data);
    try {
      // return ApiService.post(config.apiUrl.apis.member.addVRRecord.path + transactionId, {data: data});
    } catch (error) {
      console.log('Error kah ? sepertinya tidak thrwing kemari', error);
      const msg = error as any;
      throw new ResponseError(msg.status, msg.error.message);
    }
  },
  logVRActivity: async function (id: string, data: any) {
    console.log('Do LOG VR data : ', data);
    try {
      return ApiService.post('lumbini/log_myborobudur/' + id, {data: data});
    } catch (error) {
      console.log('Error kah ? sepertinya tidak thrwing kemari', error);
      const msg = error as any;
      throw new ResponseError(msg.status, msg.error.message);
    }
  },
  checkoutTransaction: async function (data: any): Promise<any> {
    console.log('Data to checkout : ', data);
    try {
      return ApiService.get(
        config.apiUrl.apis.member.checkout.path +
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
  applyCoupon: async function (data: any) {
    console.log('Data to checkout : ', data);
    try {
      return ApiService.postExternal(
        config.couponApiUrl.href + config.couponApiUrl.apis.apply.path,
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
  getSponsors: async function () {
    try {
      const res = (await ApiService.get(
        config.apiUrl.resources.sponsor.path,
      )) as {data: ISponsorResponse};

      return res;
    } catch (error) {
      console.log('Error kah ? sepertinya tidak thrwing kemari', error);
      throw error;
    }
  },
  // export function checkout({transactionId, paymentType}){
  // var idToParse = transactionId + '/' + paymentType
  // return user('checkout', {id:idToParse})
};

export {EventService, ResponseError};
