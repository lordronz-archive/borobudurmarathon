import moment from 'moment';
import {EEventStatus, EInvitationStatus} from '../types/event.type';
import {convertDateTimeToLocalTimezone} from './datetimeTimezone';

export function getEventTypeName(params: {
  evnhType?: number | string;
  evnhBallot?: number | string;
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

  if (evnhBallot) {
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
  if (evnhRegistrationStart) {
    evnhRegistrationStart = convertDateTimeToLocalTimezone(
      evnhRegistrationStart,
    );
    const isUpcoming = moment(new Date()).isBefore(
      moment(convertDateTimeToLocalTimezone(evnhRegistrationStart)),
    );

    if (isUpcoming) {
      return EEventStatus.UPCOMING;
    }
  }

  if (evnhEndDate) {
    evnhEndDate = convertDateTimeToLocalTimezone(evnhEndDate);
    const isExpired = moment(
      convertDateTimeToLocalTimezone(evnhEndDate),
    ).isBefore(moment(new Date()));

    if (isExpired) {
      return EEventStatus.EXPIRED;
    }
  }

  if (evnhRegistrationEnd) {
    evnhRegistrationEnd = convertDateTimeToLocalTimezone(evnhRegistrationEnd);
    const isExpired = moment(
      convertDateTimeToLocalTimezone(evnhRegistrationEnd),
    ).isBefore(moment(new Date()));

    if (isExpired) {
      return EEventStatus.REGISTRATION_CLOSED;
    }
  }

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
  iregExpired: string | null;
  iregIsUsed: number;
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
  eventStatus: EEventStatus;
  invitationStatus?: EInvitationStatus;
}) {
  // jika tidak punya invitation, hanya bisa daftar ketika status event REGISTRATION
  if (!params.invitationStatus) {
    return params.eventStatus === EEventStatus.REGISTRATION;
  }

  if (params.invitationStatus === EInvitationStatus.EXPIRED) {
    return false;
  }
  if (params.invitationStatus === EInvitationStatus.USED) {
    return false;
  }
  if (params.invitationStatus === EInvitationStatus.INVITED) {
    return true;
  }

  return false;
}
