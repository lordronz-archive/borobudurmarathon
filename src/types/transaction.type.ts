export interface TransactionDetail {
  data: Data1;
  linked: Linked;
  fields?: FieldsEntity[] | null;
}
export interface Data1 {
  id: number;
  trnsId: number;
  trnsUserId: number;
  trnsUserName: string;
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
  trnsConfirmTime?: null;
  trnsExpiredTime: string;
  trnsCreatedTime: string;
  links: Links;
}
export interface Links {
  trnsEventId: number;
  traiTrnsId?: null[] | null;
  tabdTrnsId?: null[] | null;
  tcbdTrnsId?: null[] | null;
  tahdTrnsId?: null[] | null;
  tatdTrnsId?: null[] | null;
  trndTrnsId?: number[] | null;
  trihTrnsId?: number[] | null;
  tridTrnsId?: number[] | null;
  evrlTrnsId?: number[] | null;
  etikTrnsId?: null[] | null;
  tdrwTrnsId?: null[] | null;
  viruTrnsId?: null[] | null;
  vrtrTrnsId?: number[] | null;
  saduTrnsId?: number[] | null;
}
export interface Linked {
  trnsEventId?: TrnsEventIdEntity[] | null;
  traiTrnsId?: null[] | null;
  tabdTrnsId?: null[] | null;
  tcbdTrnsId?: null[] | null;
  tahdTrnsId?: null[] | null;
  tatdTrnsId?: null[] | null;
  trndTrnsId?: TrndTrnsIdEntity[] | null;
  trihTrnsId?: TrihTrnsIdEntity[] | null;
  tridTrnsId?: TridTrnsIdEntity[] | null;
  evrlTrnsId?: EvrlTrnsIdEntity[] | null;
  etikTrnsId?: null[] | null;
  tdrwTrnsId?: null[] | null;
  viruTrnsId?: null[] | null;
  vrtrTrnsId?: VrtrTrnsIdEntity[] | null;
  saduTrnsId?: SaduTrnsIdEntity[] | null;

  jtvaTrnsId?: {jtvaVANumber: string}[] | null;
  bnivTrnsId?: {bnivVANumber: string}[] | null;
  trcpTrnsId?: any[] | null;
}
export interface TrnsEventIdEntity {
  id: number;
  evnhId: number;
  evnhType: number;
  evnhName: string;
  evnhQuotaRegistration: number;
  evnhFeatured: number;
  evnhSizeChart: string;
  evnhDescription: string;
  evnhPlace: string;
  evnhNote?: null;
  evnhThumbnail: string;
  evnhBallot: number;
  evnhQuotaConfirmation: number;
  evnhTimeLimitRegistration: string;
  evnhCategory: string;
  evnhLinkWeb?: null;
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
export interface TrndTrnsIdEntity {
  id: number;
  trndId: number;
  trndTrnsId: number;
  trndRefId: string;
  trndType: number;
  trndTypeName: string;
  trndQuantity: number;
  trndDescription: string;
  trndAmount: string;
  trndTotal: string;
  trndIsPaid: number;
}
export interface TrihTrnsIdEntity {
  id: number;
  trihId: number;
  trihCreatedTime: string;
  trihEventId: number;
  trihTrnsId: number;
  trihTrnsRefId: string;
  trihInvoiceCode: string;
  trihInvoiceNumber: number;
  trihPaymentType: string;
  trihPaymentTypeName: string;
  trihAmount: string;
  trihIsCurrent: number;
  trihIsPaid: number;
  trihIsClosed: number;
  trihIsSettlement: number;
}
export interface TridTrnsIdEntity {
  id: number;
  tridId: number;
  tridTrnsId: number;
  tridTrnsRefId: string;
  tridTrihInvoiceCode: string;
  tridTrihInvoiceNumber: number;
  tridTrndType: number;
  tridTrndTypeName: string;
  tridTrndId: number;
  tridAmount: string;
  tridQuantity: number;
  tridDescription: string;
  tridTotal: string;
}
export interface EvrlTrnsIdEntity {
  id: string;
  evrlId: string;
  evrlEvpaId: string;
  evrlTrnsId: string;
  evrlEvpaName: string;
  evrlEvpaCategory: string;
  evrlEvpaGender: string;
  evrlComuId?: null;
  evrlCreatedTime: string;
  evpaId: string;
  evpaEvnhId: string;
  evpaEvncId: string;
  evpaName: string;
  evpaGender: string;
  evpaBIBNo?: null | string | number;
  evpaBirthPlace: string;
  evpaBirthDate: string;
  evpaAddress: string;
  evpaCity: string;
  evpaProvinsi: string;
  evpaCountry: string;
  evpaNationality: string;
  evpaEmergencyContactName: string;
  evpaEmergencyContactNumber: string;
  evpaIDNumber: string;
  evpaCommunity: string;
  evpaBloodType: string;
  evpaMedicalTreatment: string;
  evpaMentionTreatment: string;
  evpaLongTreatment: string;
  evpaBIBName: string;
  evpaWave: string;
  evpaSourceURL: string;
  evpaFRrace: string;
  evpaFRtime: string;
  evpaFRcertificate: string;
  evpaFRlink: string;
  evpaJersey: string;
  evpaCovidVaksin: string;
}
export interface VrtrTrnsIdEntity {
  id: number;
  vrtrId: number;
  vrtrEventId: number;
  vrtrTrnsId: number;
  vrtrTrihId: number;
  vrtrRefId: string;
  vrtrOrderId: string;
  vrtrTypeName: string;
  vrtrURL: string;
  vrtrStatus: number;
  vrtrGrossAmount: string;
  vrtrCreatedTime: string;
}
export interface SaduTrnsIdEntity {
  id: number;
  saduId: number;
  saduTrnsId: number;
  saduTrihId: number;
  saduOrderId: string;
  saduInvoiceNumber: string;
  saduSaveduitNumber: string;
  saduAmount: string;
  saduExpired?: null;
  saduNtb?: null;
  saduStatus: number;
  saduCreatedTime: string;
}
export interface FieldsEntity {
  name: string;
  label: string;
  size: number;
  type: string;
}
