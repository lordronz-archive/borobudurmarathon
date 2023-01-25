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
  categories?: CategoriesEntity[] | null;
  data: EventPropertiesDetail;
  fields?: EventFieldsEntity[] | null;
  items?: null[] | null;
  jersey?: null[] | null;
  payments?: PaymentsEntity[] | null;
  prices?: any[] | null;
  product?: any[] | null;
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
}
export interface EventPropertiesDetail {
  evnhDescription?: null;
  evnhEndDate: string;
  evnhId: string;
  evnhName: string;
  evnhNote?: null;
  evnhPlace?: null;
  evnhQuotaConfirmation: string;
  evnhQuotaRegistration: string;
  evnhRegistrationEnd: string;
  evnhRegistrationStart: string;
  evnhRegistrationStatus: string;
  evnhStartDate: string;
  evnhStatus: string;
  evnhStatusPublish: string;
  evnhThumbnail?: null;
  evnhTimeLimitConfirmation: string;
  evnhTimeLimitRegistration: string;
  evnhTransactionExpired: string;
  evnhType: string;
}
export interface EventFieldsEntity {
  evhfEvnhId: string;
  evhfExternalData?: string | null;
  evhfId: string;
  evhfIsAttribute: string;
  evhfIsRequired: string;
  evhfLabel: string;
  evhfMsflId: string;
  evhfName: string;
  evhfType:
    | 'Number'
    | 'Text'
    | 'Email'
    | 'Phone'
    | 'Option'
    | 'Date'
    | 'Hidden';
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
