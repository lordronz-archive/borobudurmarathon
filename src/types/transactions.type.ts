export interface GetTransactionsResponse {
  data: Datum[];
  linked: Linked;
  fields: Field[];
  status: Status;
}

export interface Datum {
  id: number;
  mregId: number;
  mregOrderId: string;
  mregRaceResult: null;
  mregNote: null;
  mregYear: null;
  mregType: string;
  mregStatus: number;
  mregCreatedTime: string;
  links: Links;
  mregZmemId?: number;
  mregEventId?: number;
  mregEvncId?: number;
}

export interface Links {
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

export interface Linked {
  mregTrnsId: MregTrnsID[];
  mregZmemId: MregZmemID[];
  mregEvncId: MregEvncID[];
  mregEventId: MregEventID[];
}

export interface MregEventID {
  id: number;
  evnhId: number;
  evnhType: number;
  evnhName: string;
  evnhQuotaRegistration: number;
  evnhFeatured: number;
  evnhSizeChart: null | string;
  evnhDescription: string;
  evnhPlace: string;
  evnhNote: null;
  evnhThumbnail: string;
  evnhBallot: number;
  evnhQuotaConfirmation: number;
  evnhTimeLimitRegistration: string;
  evnhCategory: string;
  evnhLinkWeb: null | string;
  evnhTimeLimitConfirmation: string;
  evnhStartDate: string;
  evnhEndDate: string;
  evnhRegistrationStart: string;
  evnhRegistrationEnd: string;
  evnhStatusPublish: number;
  evnhRegistrationStatus: number;
  evnhTransactionExpired: number;
  evnhStatus: number;
}

export interface MregEvncID {
  id: number;
  evncId: number;
  evncEvnhId: number;
  evncName: string;
  evncDesc: null | string;
  evncBenefit: null | string;
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
  trnsConfirmTime: null;
  trnsExpiredTime: string;
  trnsCreatedTime: string;
}

export interface MregZmemID {
  id: number;
  zmemId: number;
  zmemPhoto: string;
  zmemLoyalty: number;
  zmemLevel: number;
  zmemStatus: number;
  zmemCreatedTime: string;
  zmemAuusId: number;
  zmemOwner: number;
  zmemNewsletter: number;
  zmemFullName: string;
  zmemGender: null;
  zmemLanguage: number;
}

export interface Status {
  page: number;
  totalRecords: number;
}
