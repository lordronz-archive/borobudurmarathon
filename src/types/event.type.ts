import {ReactNode} from 'react';
import {EvhfName} from './registerEvent.type';

// LIST EVENT
export interface GetEventsResponse {
  data?: EventProperties[] | null;
  linked: Linked;
  fields?: EventsFieldsEntity[] | null;
  status: Status;
}

export interface EventFieldsExternalDatum {
  id: number;
  label: string;
}

export type EventFieldsExternalData = EventFieldsExternalDatum[];

export interface EventProperties {
  id: number;
  evnhId: number;
  evnhType: number;
  evnhName: string;
  evnhQuotaRegistration: number;
  evnhDescription?: null;
  evnhPlace?: null;
  evnhNote?: null | string;
  evnhThumbnail?: null;
  evnhQuotaConfirmation: number;
  evnhTimeLimitRegistration: string;
  evnhTimeLimitConfirmation: string;
  evnhStartDate: string;
  evnhEndDate: string;
  evnhRegistrationStart: string;
  evnhRegistrationEnd: string;
  evnhStatusPublish: number;
  evnhRegistrationStatus: number;
  evnhTransactionExpired: number;
  evnhStatus: number;
  links: Links;
  evnhFeatured: number; // 0 | 1;

  // added by frontend
  eimgEvnhId?: EImgEvnhIdEntity[] | null;
}
interface Links {
  evncEvnhId?: number[] | null;
  evpaEvnhId?: (number | null)[] | null;
  evhfEvnhId?: number[] | null;
  evptEvnhId?: (number | null)[] | null;
  ehaiEvnhId?: null[] | null;
  ehhdEvnhId?: null[] | null;
  ehtdEvnhId?: null[] | null;
}
interface Linked {
  evncEvnhId?: EvncEvnhIdEntity[] | null;
  evpaEvnhId?: EvpaEvnhIdEntity[] | null;
  evhfEvnhId?: EvhfEvnhIdEntity[] | null;
  evptEvnhId?: EvptEvnhIdEntity[] | null;
  ehaiEvnhId?: null[] | null;
  ehhdEvnhId?: null[] | null;
  ehtdEvnhId?: null[] | null;
  eimgEvnhId?: EImgEvnhIdEntity[] | null;
}
interface EImgEvnhIdEntity {
  id: number; // 1
  eimgId: number; // 1
  eimgEvnhId: number; // 358;
  eimgName: string; // 'banner 1';
  eimgDescription: string; // 'test';
  eimgUrlImage: string; // 'https://borobudurmarathon.com/wp-content/uploads/2022/05/STRONGER-TO-VICTORYREV-1536x1024.jpg';
  eimgCreatedTime: string; // '0001-01-01 00:00:00';
}
interface EvncEvnhIdEntity {
  id: number;
  evncId: number;
  evncEvnhId: number;
  evncName: string;
  evncDesc?: string | null;
  evncBenefit?: null;
  evncQuotaRegistration: number;
  evncQuotaConfirmation: number;
  evncVrStartDate?: string | null;
  evncVrEndDate?: string | null;
  evncVrReps?: number | null;
  evncStartDate: string;
  evncPrice: string;
  evncMaxDistance?: number | null;
  evncMaxDistancePoint?: number | null;
  evncStatus: number;
}
interface EvpaEvnhIdEntity {
  id: number;
  evpaId: number;
  evpaEvnhId: number;
  evpaEvncId: number;
  evpaName: string;
  evpaGender: number;
  evpaBIBNo?: number | null;
  evpaCreatedTime: string;
}
interface EvhfEvnhIdEntity {
  id: number;
  evhfId: number;
  evhfEvnhId: number;
  evhfMsflId: number;
  evhfName: string;
  evhfType: string;
  evhfLabel: string;
  evhfIsAttribute: number;
  evhfIsRequired: number;
  evhfExternalData?: string | null;
}
interface EvptEvnhIdEntity {
  id: number;
  evptId: number;
  evptEvnhId: number;
  evptMsptId: number;
  evptMsptName: string;
  evptLabel: string;
  evptIsEnabled: number;
  evptAmountFee: string;
  evptPercentFee: string;
  evptUseFee: number;
  evptCreatedTime: string;
  evptIsPublic: number;
  evptBank?: null;
  evptAccountOwner?: null;
  evptAccountNumber?: null;
}
interface EventsFieldsEntity {
  name: string;
  label: string;
  size: number;
  type: string;
}
interface Status {
  page: number;
  totalRecords: number;
}

// EVENT
export interface GetEventResponse {
  access?: boolean;
  notif?: string;
  categories?: CategoriesEntity[] | null;
  data: EventPropertiesDetail;
  fields?: EventFieldsEntity[] | null;
  items?: null[] | null;
  jersey?: null[] | null;
  payments?: PaymentsEntity[] | null;
  prices?: any[] | null;
  product?: any[] | null;
  linked?: Linked | null;

  banner?:
    | {
        eimgId: string;
        eimgName: string;
        eimgDescription: string;
        eimgUrlImage: string; // 'https://steelytoe-files.s3.ap-southeast-1.amazonaws.com/2023/borobudur-2023/MAIN+EVENT+THUMBNAIL.jpg';
      }[]
    | null;
}
export interface CategoriesEntity {
  evncHold: string;
  evncId: string;
  evncMaxDistance?: null;
  evncMaxDistancePoint?: null;
  evncName: string;
  evncPrice: string;
  evncQuotaConfirmation: string;
  evncQuotaRegistration: string;
  evncStartDate: string;
  evncUseQuota: string;
  evncVrEndDate?: null;
  evncVrReps?: null;
  evncVrStartDate?: null;

  // baru ada
  evncBenefit?: string;
  evncDesc?: string;
}
export interface EventPropertiesDetail {
  evnhDescription?: string;
  evnhEndDate: string;
  evnhId: string;
  evnhName: string;
  evnhNote?: string;
  evnhPlace?: string;
  evnhQuotaConfirmation: string;
  evnhQuotaRegistration: string;
  evnhRegistrationEnd: string;
  evnhRegistrationStart: string;
  evnhRegistrationStatus: string;
  evnhStartDate: string;
  evnhStatus: string;
  evnhStatusPublish: string;
  evnhThumbnail?: string;
  evnhTimeLimitConfirmation: string;
  evnhTimeLimitRegistration: string;
  evnhTransactionExpired: string;
  evnhType: string;

  evnhBallot?: string; // '0'
  evnhCategory?: string;
  evnhSizeChart?: string;
  evnhFuture?: string;
}
export interface EventFieldsEntity {
  evhfEvnhId: string;
  evhfExternalData?: string | null;
  evhfId: string;
  evhfIsAttribute: string;
  evhfIsRequired: string;
  evhfLabel: string;
  evhfMsflId: string;
  evhfName: EvhfName;
  evhfType:
    | 'Number'
    | 'Text'
    | 'Email'
    | 'Phone'
    | 'Option'
    | 'Date'
    | 'Hidden'
    | 'File'
    | 'Time';
  static?: boolean;
  helperText?: ReactNode;
}
export interface PaymentsEntity {
  evptAccountNumber?: null;
  evptAccountOwner?: null;
  evptAmountFee: string;
  evptBank?: null;
  evptCreatedTime: string;
  evptEvnhId: string;
  evptId: string;
  evptIsEnabled: string;
  evptIsPublic: string;
  evptLabel: string;
  evptMsptId: string;
  evptMsptName: string;
  evptPercentFee: string;
  evptUseFee: string;
}

type IEventType = {
  id: number | null;
  value: string;
};

export const EVENT_TYPES: {[key: number]: IEventType} = {
  1: {
    id: 1,
    value: 'Reguler',
  },
  2: {
    id: 2,
    value: 'Virtual',
  },
  7: {
    id: 7,
    value: 'Ballot',
  },
  // {
  //   id: 0,
  //   value: 'Other',
  // },
};

export interface Transaction {
  data: Datum[];
  linked: TransactionLinked;
  fields: Field[];
  status: TransactionSummary;
}

export interface Datum {
  id: number;
  mregId: number;
  mregOrderId: string;
  mregType: string;
  mregStatus: number;
  mregCreatedTime: string;
  links: TransactionLinks;
}

export interface TransactionLinks {
  mregTrnsId: number;
  mregZmemId: number;
  mregEvncId: number;
  mregEventId: number;
}

export interface Field {
  name: string;
  label: string;
  size: number;
  type: Type;
}

export enum Type {
  Datetime = 'datetime',
  Integer = 'integer',
  String = 'string',
}

export interface TransactionLinked {
  mregTrnsId: MregTrnsID[];
  mregZmemId: MregZmemID[];
  mregEvncId: MregEvncID[];
  mregEventId: MregEventID[];
}

export interface MregEvncID {
  id: number;
  evncId: number;
  evncEvnhId: number;
  evncName: string;
  evncDesc: null;
  evncBenefit: null;
  evncQuotaRegistration: number;
  evncQuotaConfirmation: number;
  evncVrStartDate: null;
  evncVrEndDate: null;
  evncVrReps: null;
  evncStartDate: string;
  evncPrice: string;
  evncMaxDistance: null;
  evncMaxDistancePoint: null;
  evncStatus: number;
}

export interface MregEventID {
  id: number;
  evnhId: number;
  evnhType: number;
  evnhName: string;
  evnhQuotaRegistration: number;
  evnhFuture: null | number;
  evnhDescription: null;
  evnhPlace: null;
  evnhNote: null;
  evnhThumbnail: null;
  evnhQuotaConfirmation: number;
  evnhTimeLimitRegistration: string;
  evnhTimeLimitConfirmation: string;
  evnhStartDate: string;
  evnhEndDate: string;
  evnhRegistrationStart: string;
  evnhRegistrationEnd: string;
  evnhStatusPublish: number;
  evnhRegistrationStatus: number;
  evnhTransactionExpired: number;
  evnhStatus: number;

  evnhBallot: number;
}

export interface MregTrnsID {
  id: number;
  trnsId: number;
  trnsUserId: number;
  trnsUserName: string;
  trnsEventId: number;
  trnsUserEmail: string;
  trnsInvoiceId: number;
  trnsInvoiceNumber: number;
  trnsRefId: string;
  trnsStatus: number;
  trnsPaymentType: number;
  trnsPaymentStatus: number;
  trnsType: number;
  trnsAmount: string;
  trnsConfirmed: number;
  trnsConfirmTime: null | string;
  trnsExpiredTime: string;
  trnsCreatedTime: string;
}

export interface MregZmemID {
  id: number;
  zmemId: number;
  zmemLoyalty: number;
  zmemLevel: number;
  zmemStatus: number;
  zmemCreatedTime: string;
  zmemAuusId: number;
  zmemOwner: number;
  zmemNewsletter: number;
  zmemFullName: string;
  zmemGender: number;
  zmemLanguage: number;
}

export interface TransactionSummary {
  page: number;
  totalRecords: number;
}

export type TransactionStatus =
  | 'Registered'
  | 'Unqualified'
  | 'Waiting Payment'
  | 'Paid'
  | 'Payment Expired';

export const PAYMENT_METHODS = {
  save_duit: {
    name: 'Save Duit Bank Jateng',
    // icon: require('../assets/images/logo-bank-jateng.png'),
  },
  virtual_account_jateng: {
    name: 'VA Bank Jateng',
    icon: require('../assets/images/logo-bank-jateng.png'),
  },
  virtual_account_bni: {
    name: 'VA Bank BNI',
    // icon: require('../assets/images/logo-bank-jateng.png'),
  },
  snap_cc_bri: {
    name: 'Credit Card',
  },
};

// activePayment?.trihPaymentType === 'save_duit' ? (
//           'Save Duit'
//         ) : activePayment?.trihPaymentType === 'virtual_account_jateng' ? (
//           <Image
//             source={require('../../assets/images/logo-bank-jateng.png')}
//             width={'80px'}
//             height={'40px'}
//             alt="Bank Sulteng Logo"
//             resizeMode="contain"
//           />
//         ) : (
//           'Bank BNI Virtual Account'
//         ),
