export const averagePace = (
  totalHour: number,
  totalMinute: number,
  totalSecond: number,
  distance: number,
) => {
  const paceSeconds =
    (totalHour * 60 * 60 + totalMinute * 60 + totalSecond) / distance;
  const minutes = Math.floor(paceSeconds / 60);
  const seconds = paceSeconds - minutes * 60;
  return (
    minutes.toFixed().toString().padStart(2, '0') +
    ':' +
    seconds.toFixed().toString().padStart(2, '0')
  );
};

export default {averagePace};
