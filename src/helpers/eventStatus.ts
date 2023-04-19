import moment from 'moment';
import {convertDateTimeToLocalTimezone} from './datetimeTimezone';

export function getEventRegistrationStatus(
  start?: Date | string,
  end?: Date | string,
) {
  if (start) {
    start = convertDateTimeToLocalTimezone(start);
    const isUpcoming = moment(new Date()).isBefore(
      moment(convertDateTimeToLocalTimezone(start)),
    );

    if (isUpcoming) {
      return 'UPCOMING';
    }
  }

  if (end) {
    end = convertDateTimeToLocalTimezone(end);
    const isExpired = moment(convertDateTimeToLocalTimezone(end)).isBefore(
      moment(new Date()),
    );

    if (isExpired) {
      return 'EXPIRED';
    }
  }

  return 'REGISTRATION';
}
