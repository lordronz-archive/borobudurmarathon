export type IBindMemberToKompas = {
  url: string;
};

export type IAuthResponseData = {
  authEmail: string; // '1';
  authProfile: number; // 1;
  authTelephone: number; // 1;
  consent: string; // '1';
  email: string; // 'aditia.prasetio12@gmail.com';
  id: string; // '170163';
  key: string; // 'c8fd60e4d1835f9b296adf50dfdddde10c0def74d9bb37cf8a36b6f53e2766e299762aab0ef689de2f1228f7db72b2b5';
  login: 'Email';
  member: string; // '39050';
};

export type IAuthResponse = {
  data: IAuthResponseData;
};
