export const LIST_MONTH = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

export const LIST_MONTH_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Mei',
  'Jun',
  'Jul',
  'Ags',
  'Sept',
  'Okt',
  'Nov',
  'Des',
];

const LIST_DAY = [
  'Minggu',
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  `Jum'at`,
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

  const now = new Date();
  if (now.getFullYear() === date.getFullYear()) {
    if (now.getMonth() === date.getMonth()) {
      if (now.getDate() === date.getDate()) {
        return 'Hari ini';
      } else if (now.getDate() - date.getDate() === 1) {
        return 'Kemarin';
      } else if (date.getDate() - now.getDate() === 1) {
        return 'Besok';
      }
    }
  }

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

export default datetime;
