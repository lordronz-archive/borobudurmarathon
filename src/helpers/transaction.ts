import moment from 'moment';
import {TransactionStatus} from '../types/event.type';

export function getTransactionStatus(params: {
  isBallot: boolean;
  regStatus: number;
  trnsConfirmed: number;
  trnsExpiredTime: Date | string;
}): TransactionStatus {
  let newStatus;
  if (params.isBallot) {
    if (params.regStatus === 0) {
      newStatus = 'Registered';
    } else if (params.regStatus === 99) {
      newStatus = 'Unqualified';
    } else {
      if (params.trnsConfirmed === 1) {
        newStatus = 'Paid';
      } else if (moment(params.trnsExpiredTime).isBefore(moment(new Date()))) {
        newStatus = 'Payment Expired';
      } else {
        newStatus = 'Waiting Payment';
      }
    }
  } else {
    if (params.trnsConfirmed === 1) {
      newStatus = 'Paid';
    } else if (moment(params.trnsExpiredTime).isBefore(moment(new Date()))) {
      newStatus = 'Payment Expired';
    } else {
      newStatus = 'Waiting Payment';
    }
  }
  return newStatus as TransactionStatus;
}
