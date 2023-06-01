import {EEventStatus, GetEventResponse} from '../types/event.type';

export function generateEventDetailData(
  status: EEventStatus,
): GetEventResponse {
  return {
    access: true,
    notif: '',
    categories: [],
    data: {},
    fields: [],
    items: [],
    jersey: [],
    payments: [],
    prices: [],
    product: [],
    linked: {},
    payments_special: [],

    banner: [
      {
        eimgId: '',
        eimgName: '',
        eimgDescription: '',
        eimgUrlImage: '', // 'https://steelytoe-files.s3.ap-southeast-1.amazonaws.com/2023/borobudur-2023/MAIN+EVENT+THUMBNAIL.jpg',
      },
    ],
  };
}
