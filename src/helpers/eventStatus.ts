import moment from 'moment';
import {convertDateTimeToLocalTimezone} from './datetimeTimezone';

export function getEventRegistrationStatus(
  start?: Date | string,
  end?: Date | string,
) {
  if (start) {
    start = convertDateTimeToLocalTimezone(start);
    const isUpcoming = moment(
      convertDateTimeToLocalTimezone(new Date()),
      'YYYY-MM-DD HH:mm:ss',
    ).isBefore(moment(start));

    if (isUpcoming) {
      return 'UPCOMING';
    }
  }

  if (end) {
    end = convertDateTimeToLocalTimezone(end);
    const isExpired = moment(end, 'YYYY-MM-DD HH:mm:ss').isBefore(
      moment(convertDateTimeToLocalTimezone(new Date())),
    );

    if (isExpired) {
      return 'EXPIRED';
    }
  }

  return 'REGISTRATION';
}
