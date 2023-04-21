import moment from 'moment';
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
) {
  if (evnhRegistrationStart) {
    evnhRegistrationStart = convertDateTimeToLocalTimezone(
      evnhRegistrationStart,
    );
    const isUpcoming = moment(new Date()).isBefore(
      moment(convertDateTimeToLocalTimezone(evnhRegistrationStart)),
    );

    if (isUpcoming) {
      return 'UPCOMING';
    }
  }

  if (evnhEndDate) {
    evnhEndDate = convertDateTimeToLocalTimezone(evnhEndDate);
    const isExpired = moment(
      convertDateTimeToLocalTimezone(evnhEndDate),
    ).isBefore(moment(new Date()));

    if (isExpired) {
      return 'EXPIRED';
    }
  }

  if (evnhRegistrationEnd) {
    evnhRegistrationEnd = convertDateTimeToLocalTimezone(evnhRegistrationEnd);
    const isExpired = moment(
      convertDateTimeToLocalTimezone(evnhRegistrationEnd),
    ).isBefore(moment(new Date()));

    if (isExpired) {
      return 'REGISTRATION_CLOSED';
    }
  }

  return 'REGISTRATION';
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
