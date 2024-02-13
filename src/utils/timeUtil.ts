interface Elapse {
  value: number;
  unit: Intl.RelativeTimeFormatUnit;
}

const secToMin = (sec: number): Elapse => {
  return { value: sec / 60, unit: "minute" };
};
const secToHour = (sec: number): Elapse => {
  return { value: secToMin(sec).value / 60, unit: "hour" };
};
const secToDay = (sec: number): Elapse => {
  return { value: secToHour(sec).value / 24, unit: "day" };
};
const secToWeek = (sec: number): Elapse => {
  return { value: secToDay(sec).value / 7, unit: "week" };
};
const secToMonth = (sec: number): Elapse => {
  return { value: secToDay(sec).value / 30, unit: "month" };
};
const secToYear = (sec: number): Elapse => {
  return { value: secToDay(sec).value / 365, unit: "year" };
};

const makeElapsedTime = (value: number): Array<Elapse> => {
  const aryTimeSet: Array<Elapse> = [];

  aryTimeSet.push(secToMin(value));
  aryTimeSet.push(secToHour(value));
  aryTimeSet.push(secToDay(value));
  aryTimeSet.push(secToWeek(value));
  aryTimeSet.push(secToMonth(value));
  aryTimeSet.push(secToYear(value));

  return aryTimeSet;
};

const checkElapsedTime = (elapsedSec: number): Elapse => {
  const validAry: Array<Elapse> = makeElapsedTime(elapsedSec).filter(
    (elapse) => elapse.value > 1
  );

  return validAry.sort((a, b) => a.value - b.value)[0];
};

export const elapsedTime = (value: number): string => {
  const elapsedTimeFormatter = new Intl.RelativeTimeFormat("ko", {
    numeric: "auto",
  });

  const elapse: Elapse = checkElapsedTime((Date.now() - value) / 1000);

  if (elapse) {
    return elapsedTimeFormatter.format(
      Math.floor(elapse.value) * -1,
      elapse.unit
    );
  } else {
    return "조금 전";
  }
};
