import {IField, IStatus} from './baseResponse.type';

export type ISponsorData = {
  id: number;
  ehspId: number;
  ehspTitle: string;
  ehspGroup: string;
  ehspBanner: string;
  ehspDescription: string;
  ehspUrl: string;
  ehspOrder: '1' | '2' | '3';
  ehspCreatedTime: string;
  links: {};
};

export type ISponsorResponse = {
  data: ISponsorData[];
  linked: [];
  fields: IField[];
  status: IStatus;
};
