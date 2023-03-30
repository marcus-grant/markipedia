function leadingZero(num, numDigits) {
  let digits = numDigits;
  // If digits is not defined, calculate it from log10 of num
  if (!digits) {
    // calculate decimal digits (above 0)
    digits = Math.floor(Math.log10(num)) + 1;
  }
  // return string with leading zeros for validatedDigits of places
  return num.toString().padStart(digits, '0');
}

module.exports = {
  leadingZero,
};
