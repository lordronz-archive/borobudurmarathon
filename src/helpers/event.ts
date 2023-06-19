import moment from 'moment';
import {EEventStatus, EInvitationStatus} from '../types/event.type';
import {convertDateTimeToLocalTimezone} from './datetimeTimezone';

export function getEventTypeName(params: {
  evnhType?: number | string;
  evnhBallot?: number | string;
  mregTypeDesc?: string | null;
}) {
  const evnhType = params.evnhType ? Number(params.evnhType) : 0;
  const evnhBallot = params.evnhBallot ? Number(params.evnhBallot) : 0;
  let typeName = '';
  if (evnhType === 2) {
    typeName = 'VIRTUAL';
  } else if (evnhType === 1 || evnhType === 7) {
    typeName = 'REGULER';
  } else {
    typeName = 'OTHER (' + evnhType + ')';
  }

  if (params.mregTypeDesc) {
    typeName = typeName + ' - ' + params.mregTypeDesc;
  } else if (evnhBallot) {
    typeName = typeName + ' - BALLOT';
  }
  return typeName;
}

export function getEventRegistrationStatus(
  evnhRegistrationStart?: Date | string,
  evnhRegistrationEnd?: Date | string,
  evnhStartDate?: Date | string,
  evnhEndDate?: Date | string,
): EEventStatus {
  console.info('evnhRegistrationStart', evnhRegistrationStart);
  console.info('evnhRegistrationEnd', evnhRegistrationEnd);
  console.info('evnhEndDate', evnhEndDate);
  console.info('now', moment());

  if (evnhRegistrationStart) {
    evnhRegistrationStart = convertDateTimeToLocalTimezone(
      evnhRegistrationStart,
    );
    console.info('--evnhRegistrationStart', evnhRegistrationStart);
    const isUpcoming = moment().isBefore(evnhRegistrationStart);

    if (isUpcoming) {
      console.info('UPCOMING');
      return EEventStatus.UPCOMING;
    }
  }

  if (evnhEndDate) {
    evnhEndDate = convertDateTimeToLocalTimezone(evnhEndDate);
    console.info('--evnhEndDate', evnhEndDate);
    const isExpired = moment(evnhEndDate).isBefore(moment());

    if (isExpired) {
      console.info('EXPIRED');
      return EEventStatus.EXPIRED;
    }
  }

  if (evnhRegistrationEnd) {
    evnhRegistrationEnd = convertDateTimeToLocalTimezone(evnhRegistrationEnd);
    console.info('--evnhRegistrationEnd', evnhRegistrationEnd);
    const isClosed = moment(evnhRegistrationEnd).isBefore(moment());

    if (isClosed) {
      console.info('REGISTRATION_CLOSED');
      return EEventStatus.REGISTRATION_CLOSED;
    }
  }

  console.info('REGISTRATION');
  return EEventStatus.REGISTRATION;
}

export function getEventQuotaStatus(
  event: {
    evnhQuotaRegistration?: string;
  },
  categories: {
    evncHold?: string;
  }[],
) {
  const totalHold = categories.reduce(
    (acc, curr) => acc + Number(curr.evncHold),
    0,
  );
  console.info('totalHold', totalHold);
  console.info('event.evnhQuotaRegistration', event.evnhQuotaRegistration);
  if (totalHold >= Number(event.evnhQuotaRegistration)) {
    return 'SOLDOUT';
  } else {
    return 'OPEN';
  }
}

export function getEventCategoryQuotaStatus(cat: {
  evncQuotaRegistration?: string;
  evncHold?: string;
}) {
  if (Number(cat.evncHold) >= Number(cat.evncQuotaRegistration)) {
    return 'SOLDOUT';
  } else {
    return 'OPEN';
  }
}

export function getInvitationStatus(invitationData: {
  iregExpired?: string | null;
  iregIsUsed?: number;
}): EInvitationStatus {
  if (invitationData.iregIsUsed === 1) {
    return EInvitationStatus.USED;
  }

  if (
    !!invitationData.iregExpired &&
    moment(convertDateTimeToLocalTimezone(invitationData.iregExpired)).isAfter(
      moment(new Date()),
    )
  ) {
    return EInvitationStatus.EXPIRED;
  }

  return EInvitationStatus.INVITED;
}

export function isAvailableForRegister(params: {
  isRegistered: boolean;
  access?: boolean;
  eventStatus: EEventStatus;
  invitationStatus?: EInvitationStatus;
  categories: number[];
  iregEvncId: number | null;
}) {
  if (!params.access) {
    console.info('params.access = false');
    return false;
  }
  if (params.isRegistered) {
    console.info('params.isRegistered = true');
    return false;
  }
  // jika tidak punya invitation, hanya bisa daftar ketika status event REGISTRATION
  if (!params.invitationStatus) {
    console.info('!params.invitationStatus');
    return params.eventStatus === EEventStatus.REGISTRATION;
  }

  if (params.invitationStatus === EInvitationStatus.EXPIRED) {
    console.info('params.invitationStatus === EInvitationStatus.EXPIRED');
    return false;
  }
  if (params.invitationStatus === EInvitationStatus.USED) {
    console.info('params.invitationStatus === EInvitationStatus.USED');
    return false;
  }
  if (params.invitationStatus === EInvitationStatus.INVITED) {
    console.info('params.invitationStatus === EInvitationStatus.INVITED');
    if (params.eventStatus === EEventStatus.EXPIRED) {
      console.info('params.eventStatus === EEventStatus.EXPIRED');
      return false;
    }
    if (!params.iregEvncId) {
      console.info('!params.iregEvncId');
      return true;
    }

    const res = params.categories.includes(params.iregEvncId);
    console.info(
      'params.categories.includes(params.iregEvncId)',
      JSON.stringify(res),
    );
    return res;
  }

  return false;
}
