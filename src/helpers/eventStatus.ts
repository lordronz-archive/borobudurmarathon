import moment from 'moment';

export function getEventRegistrationStatus(
  start?: Date | string,
  end?: Date | string,
) {
  if (start) {
    const isUpcoming = moment(new Date(), 'YYYY-MM-DD HH:mm:ss').isBefore(
      moment(start),
    );

    if (isUpcoming) {
      return 'UPCOMING';
    }
  }

  if (end) {
    const isExpired = moment(end, 'YYYY-MM-DD HH:mm:ss').isBefore(
      moment(new Date()),
    );

    if (isExpired) {
      return 'EXPIRED';
    }
  }

  return 'REGISTRATION';
}
