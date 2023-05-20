import config from '../config';
import httpRequest from '../helpers/httpRequest';
import {GetEventResponse, GetEventsResponse} from '../types/event.type';
import ApiService from './api.service';
import QRCode from 'qrcode';
import {ISponsorResponse} from '../types/sponsor.type';
import {GetGalleryResponse} from '../types/gallery.type';
import {TransactionDetail} from '../types/transaction.type';
import {GetTransactionsResponse} from '../types/transactions.type';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {InvitationProperties} from '../types/invitation.type';

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
      return Promise.reject(error);
    }
  },
  getTransaction: async function (): Promise<{data: GetTransactionsResponse}> {
    try {
      return httpRequest.get(config.apiUrl.apis.member.getTransaction.path);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  getTransactionDetail: async function (transactionId: string): Promise<{
    data: TransactionDetail;
  }> {
    console.log('Transaction id to get : ', transactionId);
    try {
      return httpRequest.get(
        config.apiUrl.apis.member.getTransactionDetail.path + transactionId,
      ) as Promise<{
        data: TransactionDetail;
      }>;
    } catch (error) {
      console.log('E : ', error);
      return Promise.reject(error);
    }
  },
  getGarminAuthLink: async function () {
    console.log('Authenticate garmin now...');
    try {
      return ApiService.get(config.apiUrl.apis.vr.authGarmin.path);
    } catch (error) {
      console.log('E : ', error);
      return Promise.reject(error);
    }
  },
  getGallery: async function (): Promise<{data: GetGalleryResponse}> {
    try {
      return ApiService.get('member_resource/gallery') as Promise<{
        data: GetGalleryResponse;
      }>;
    } catch (error) {
      console.log('E : ', error);
      return Promise.reject(error);
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
    } catch (error) {
      console.log('Generate QR Error:', error);
      return Promise.reject(error);
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
      return Promise.reject(error);
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
      return Promise.reject(error);
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
      return Promise.reject(error);
    }
  },
  getEvent: async function (eventId: number): Promise<GetEventResponse> {
    console.log('Event id to get : ', eventId);
    try {
      const res = await httpRequest.get(
        config.apiUrl.apis.event.detail.path + eventId,
      );
      return res.data;
    } catch (error) {
      console.log('E : ', error);
      return Promise.reject(error);
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
      return Promise.reject(error);
    }
  },
  getEvents: async function (
    featured = false,
  ): Promise<GetEventsResponse | undefined> {
    const parameter = {
      filter: {
        evnhEmail: 'reg@borobudurmarathon.co.id',
        evnhType: {
          in: [2, 1, 7],
        },
        evnhStatusPublish: 1,
        ...(featured && {evnhFuture: 1}),
      },
      pageSize: 25,
      sort: '-evnhStartDate',
    };
    if (config.isDev) {
      console.log('Developing.....');
      parameter.filter.evnhEmail = 'dev@borobudurmarathon.com';
    }
    try {
      // const res = await httpRequest.get(
      //   '/resources/event_header?' + qs(parameter, false),
      // );
      const res = await httpRequest.get(
        '/member_resource/member_event?' + qs(parameter, false),
      );

      if (res) {
        return res.data;
      } else {
        return undefined;
      }
    } catch (error) {
      console.info('ERROR getEvents ', error);
      return Promise.reject(error);
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
      return Promise.reject(error);
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
      return Promise.reject(error);
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
      return Promise.reject(error);
    }
  },
  generateBillingID: async function (data: any) {
    console.log('Generate billing ID : ', data);
    try {
      // return ApiService.post(config.apiUrl.apis.member.addVRRecord.path + transactionId, {data: data});
    } catch (error) {
      console.log('Error kah ? sepertinya tidak thrwing kemari', error);
      return Promise.reject(error);
    }
  },
  logVRActivity: async function (id: string, data: any) {
    console.log('Do LOG VR data : ', data);
    try {
      return ApiService.post('lumbini/log_myborobudur/' + id, {data: data});
    } catch (error) {
      console.log('Error kah ? sepertinya tidak thrwing kemari', error);
      return Promise.reject(error);
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
      return Promise.reject(error);
    }
  },
  applyCoupon: async function (data: {cupnCode: string; trnsRefId: string}) {
    console.log('Data to checkout : ', data);
    try {
      return ApiService.postExternal(
        config.couponApiUrl.href + config.couponApiUrl.apis.apply.path,
        {data: data},
      );
    } catch (error) {
      console.log('Error kah ? sepertinya tidak thrwing kemari', error);
      return Promise.reject(error);
    }
  },
  getSponsors: async function (eventIds: number[]) {
    try {
      const res = (await ApiService.get(
        config.apiUrl.resources.sponsor.path +
          `?filter[ehspEvnhId][in]=${eventIds.join(',')}`,
      )) as {data: ISponsorResponse};

      return res;
    } catch (error) {
      console.log('Error kah ? sepertinya tidak thrwing kemari', error);
      return Promise.reject(error);
    }
  },
  getInvitations: async function () {
    try {
      const res = (await ApiService.get(
        config.apiUrl.apis.invitation.getList.path,
      )) as {data: any};

      return res;
    } catch (error) {
      console.log('Error kah ? sepertinya tidak thrwing kemari', error);
      return Promise.reject(error);
    }
  },
  setInvitations: async function (invitations: InvitationProperties[]) {
    return AsyncStorage.setItem('invitation-list', JSON.stringify(invitations));
  },
  shouldShowNotification: async function (invitations: InvitationProperties[]) {
    try {
      const res = await AsyncStorage.getItem('invitation-list');
      if (res == null && invitations.length > 0) {
        return true;
      }
      const inv = JSON.parse(res!) as InvitationProperties[];
      const filteredInv = invitations.filter(
        v => !inv.find(i => i.id === v.id),
      );
      return filteredInv.length > 0;
    } catch (error) {
      console.log('Error kah ? sepertinya tidak thrwing kemari', error);
      return Promise.reject(error);
    }
  },
  // export function checkout({transactionId, paymentType}){
  // var idToParse = transactionId + '/' + paymentType
  // return user('checkout', {id:idToParse})
};

export {EventService, ResponseError};
