const moment = require('moment');

/**
 * Checks incoming date to be of correct format
 * @param {string} [inputDate]
 * @return {string} - returns standard 'YYYY-MM-DD' format string
 *
 * @throws Error - in case the input is not valid
 */
const checkDate = (inputDate) => {
  if (!inputDate) {
    return moment()
      .format('YYYY-MM-DD');
  }
  const check = moment(inputDate, ['MM-DD', 'MM-DD-YY', 'MM-DD-YYYY']);
  if (check.isValid()) {
    return check.format('YYYY-MM-DD');
  }
  throw new Error(`Input is not of valid format: ${inputDate}`);
};

module.exports = {
  checkDate,
};
