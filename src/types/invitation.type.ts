export interface InvitationResponse {
  data: InvitationProperties[];
  linked: Linked;
  fields: Field[];
  status: Status;
}

export interface InvitationProperties {
  id: number;
  iregId: number;
  iregEvncId: null | number | string;
  iregName: null;
  iregEmail: string;
  iregIsFree: number;
  iregIsUsed: number;
  iregExpired: string | null;
  iregCreatedTime: Date;
  links: Links;

  linked?: {
    iregEvnhId: IregEvnhID;
  }; // manual handle by frontend
}

export interface Links {
  iregEvnhId: number;
  iregEvncId: number | string | null;
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
  iregEvnhId: IregEvnhID[];
}

export interface IregEvnhID {
  id: number;
  evnhId: number;
  evnhType: number;
  evnhName: string;
  evnhQuotaRegistration: number;
  evnhFeatured: number;
  evnhSizeChart: string;
  evnhDescription: string;
  evnhPlace: string;
  evnhNote: null;
  evnhThumbnail: string;
  evnhBallot: number;
  evnhQuotaConfirmation: number;
  evnhTimeLimitRegistration: Date;
  evnhCategory: string;
  evnhLinkWeb: null;
  evnhTimeLimitConfirmation: Date;
  evnhStartDate: Date;
  evnhEndDate: Date;
  evnhRegistrationStart: Date;
  evnhRegistrationEnd: Date;
  evnhStatusPublish: number;
  evnhRegistrationStatus: number;
  evnhTransactionExpired: number;
  evnhStatus: number;
}

export interface Status {
  page: number;
  totalRecords: number;
}
