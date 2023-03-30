const stringHelpers = require('./string-helpers');

const dU = {
  Y: (date) => date.getFullYear(),
  y: (date) => date.getFullYear() % 100,
  M: (date) => date.getMonth() + 1,
  D: (date) => date.getDate(),
  d: (date) => date.getDay(),
  H: (date) => date.getHours(),
  h: (date) => date.getHours() % 12,
  m: (date) => date.getMinutes(),
  s: (date) => date.getSeconds(),
};

// const dayOfWeek3 = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
// const dayOfWeekFull = [
//   'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
// ];

const dUS = {
  Y: (date) => stringHelpers.leadingZero(dU.Y(date), 4),
  y: (date) => stringHelpers.leadingZero(dU.y(date), 2),
  M: (date) => stringHelpers.leadingZero(dU.M(date), 2),
  D: (date) => stringHelpers.leadingZero(dU.D(date), 2),
  H: (date) => stringHelpers.leadingZero(dU.H(date), 2),
  h: (date) => stringHelpers.leadingZero(dU.h(date), 2),
  m: (date) => stringHelpers.leadingZero(dU.m(date), 2),
  s: (date) => stringHelpers.leadingZero(dU.s(date), 2),
};

function shortDateString(date) {
  return (
    `${dUS.Y(date)}-${dUS.M(date)}-${dUS.D(date)}`
    + ` ${dUS.H(date)}:${dUS.m(date)}`
  );
}

module.exports = {
  shortDateString,
};
