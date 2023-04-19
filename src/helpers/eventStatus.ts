import moment from 'moment';
import {convertDateTimeToLocalTimezone} from './datetimeTimezone';

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
