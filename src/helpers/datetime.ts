export const LIST_MONTH = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const LIST_MONTH_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec',
];

const LIST_DAY = [
  'Minggu',
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  "Jum'at",
  'Sabtu',
];

function getDateString(
  date: Date | string | undefined,
  format: 'long' | 'short' = 'long',
  formatMonth: 'long' | 'short' = 'long',
) {
  if (!date) {
    return '-';
  }
  if (typeof date === 'string') {
    date = new Date(date);
  }

  // const now = new Date();
  // if (now.getFullYear() === date.getFullYear()) {
  //   if (now.getMonth() === date.getMonth()) {
  //     if (now.getDate() === date.getDate()) {
  //       return t('time.today');
  //     } else if (now.getDate() - date.getDate() === 1) {
  //       return t('time.yesterday');
  //     } else if (date.getDate() - now.getDate() === 1) {
  //       return t('time.tomorrow');
  //     }
  //   }
  // }

  const dayText = LIST_DAY[date.getDay()];
  const dateText = date.getDate();
  const monthText =
    formatMonth === 'long'
      ? LIST_MONTH[date.getMonth()]
      : LIST_MONTH_SHORT[date.getMonth()];
  const yearText = date.getFullYear();

  if (format === 'short') {
    return dateText + ' ' + monthText + ' ' + yearText;
  } else {
    return dayText + ', ' + dateText + ' ' + monthText + ' ' + yearText;
  }
}

function getDateRangeString(
  startAt: Date | string | undefined,
  endAt: Date | string | undefined,
  format: 'long' | 'short' = 'short',
  formatMonth: 'long' | 'short' = 'long',
) {
  if (startAt && !endAt) {
    return getDateString(startAt, format, formatMonth);
  } else if (!startAt && endAt) {
    return getDateString(endAt, format, formatMonth);
  } else if (
    startAt &&
    endAt &&
    new Date(startAt).getTime() === new Date(endAt).getTime()
  ) {
    return getDateString(startAt, format, formatMonth);
  } else if (startAt && endAt) {
    const dateStartAt = new Date(startAt);
    const dateStartAtYear = dateStartAt.getFullYear();
    const dateStartAtMonth = dateStartAt.getMonth();
    const dateStartAtDate = dateStartAt.getDate();

    const dateEndAt = new Date(endAt);
    const dateEndAtYear = dateEndAt.getFullYear();
    const dateEndAtMonth = dateEndAt.getMonth();
    const dateEndAtDate = dateEndAt.getDate();

    if (dateStartAtYear === dateEndAtYear) {
      if (dateStartAtMonth === dateEndAtMonth) {
        if (dateStartAtDate === dateEndAtDate) {
          // 1 Jan 2022
          return getDateString(startAt, format, formatMonth);
        } else {
          // 1 - 2 Jan 2022
          return (
            dateStartAtDate + ' - ' + getDateString(endAt, format, formatMonth)
          );
        }
      } else {
        // 1 Jan - 1 Feb 2022
        return (
          dateStartAtDate +
          ' ' +
          (formatMonth === 'long'
            ? LIST_MONTH[dateStartAtMonth]
            : LIST_MONTH_SHORT[dateStartAtMonth]) +
          ' - ' +
          getDateString(endAt, format, formatMonth)
        );
      }
    }

    // 1 Jan 2021 - 1 Jan 2022
    return (
      getDateString(startAt, format, formatMonth) +
      ' - ' +
      getDateString(endAt, format, formatMonth)
    );
  } else {
    return '-';
  }
}

export const toAcceptableApiFormat = (s?: string) => {
  return s
    ? new Date(s).toJSON().slice(0, 10).split('-').reverse().join('-')
    : s;
};

const datetime = {
  getDateString,
  getDateRangeString,
};

export const getAge = (dateString?: string, base?: string) => {
  const baseDate = base ? new Date(base) : new Date();
  const birthDate = dateString ? new Date(dateString) : new Date();
  let age = baseDate.getFullYear() - birthDate.getFullYear();
  const m = baseDate.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && baseDate.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export default datetime;
