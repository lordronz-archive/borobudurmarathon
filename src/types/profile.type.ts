type IField = {
  label: string;
  name: string;
  size: number;
  type: 'integer' | 'string' | 'datetime';
};
type IStatus = {page: number; totalRecords: number};

type ILink = {
  zmemLoyalty: number;
  zmemLevel: number;
  zmemAuusId: number;
  mregZmemId: number[];
  mrvrZmemId: number[];
  lptrZmemId: number[];
  mappZmemId: number[];
  minvZmemId: number[];
  mmedZmemId: number[];
  mbsdZmemId: number[];
  mbspZmemId: number[];
};

type ILinked = {
  zmemLoyalty: {id: number; loyaId: number; loyaName: 'Bronze' | string}[];
  zmemLevel: {id: number; leveId: number; leveName: 'Intermediate' | string}[];
  zmemAuusId: {
    id: number;
    auusId: number;
    auusCreatedTime: string; // '2022-12-12 11:57:51',
    auusLastLogin: string; // '2023-01-13 16:57:56',
    auusEmail: string; // 'example@gmail.com',
    auusPhone: string; // '6285xxxxxxxx',
    auusKompasId: null;
    auusUniqueKey: string; //'c8fd60e4d183....2b2b5',
  }[];
  mregZmemId: number[];
  mrvrZmemId: number[];
  lptrZmemId: number[];
  mappZmemId: number[];
  minvZmemId: number[];
  mmedZmemId: {
    id: number;
    mmedId: number;
    mmedEducation: string;
    mmedOccupation: string;
    mmedIncome: string;
  }[];
  mbsdZmemId: {
    id: number;
    mbsdId: number;
    mbsdPhone: string | null;
    mbsdZmemId: number;
    mbsdFullName: string;
    mbsdEmail: string;
    mbsdGender: number; // 1: Male
    mbsdBloodType: string; // '3';
    mbsdIDNumberType: number;
    mbsdIDNumber: string; // '331811xxxxxx';
    mbsdBirthDate: string; // 'yyyy-mm-dd';
    mbsdBirthPlace: string;
    mbsdNationality: string; // 'Indo';
    mbsdCountry: string; // 'Indo';
    mbsdProvinces: string; // 'Jawa Tengah';
    mbsdCity: string; // 'Pati';
    mbsdAddress: string; // 'Desa xxxxx RT xxx RW xxx, Kec, Kab';
    mbsdFile: string; // '0';
    mbsdStatus: number; // 0
  }[];
  mbspZmemId: {
    id: number;
    mbspId: number;
    mbspCountryCode: string; // '62';
    mbspNumber: string; // '85xxxxxxx';
    mbspStatus: number; // 1
  }[];
};

export type IProfile = {
  id: number;
  links: ILink[];
  zmemCreatedTime: string; // '2022-12-12 11:57:51';
  zmemFullName: string;
  zmemGender: number; // 1: Male, 2: Female ??
  zmemId: number; // == id
  zmemLanguage: number; // 2;
  zmemNewsletter: number; // 1;
  zmemOwner: number; // 1;
  zmemStatus: number; // 1;
};

export type IMemberDetailResponse = {
  data: IProfile[];
  fields: IField[];
  linked: ILinked;
  status: IStatus;
};

export type MasterLocationResponse = {
  data: Datum[];
  linked: any[];
  fields: Field[];
  status: Status;
};

export type Datum = {
  id: number;
  mlocId: number;
  mlocName: string;
  mlocProvince: string;
  mlocRegency: string;
  mlocSubdistrict: string;
  mlocVillage: string;
  links: Links;
};

export type Links = {};

export type Field = {
  name: string;
  label: string;
  size: number;
  type: string;
};

export type Status = {
  page: number;
  totalRecords: number;
};
