export function convertDateTimeToLocalTimezone(
  dt?: Date | string,
  baseTimezone: number = 7,
) {
  const datetime = dt ? new Date(dt) : new Date();

  // console.info('datetime.toISOString()', datetime.toISOString());
  // console.info('get timeoffset', datetime.getTimezoneOffset() / 60);

  const offset = datetime.getTimezoneOffset() / 60;
  const diff = -1 * baseTimezone - offset; // (-7 - (-8) = 1)
  // console.info('diff', diff);

  datetime.setHours(datetime.getHours() + diff);
  // console.info('new datetime', datetime.toISOString());

  return datetime;
}
