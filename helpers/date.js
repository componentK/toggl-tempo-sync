const moment = require('moment')

/**
 * Checks incoming date to be of correct format
 * @param {string} [inputDate]
 * @return {string} - returns standard 'YYYY-MM-DD' format string
 *
 * @throws Error - in case the input is not valid
 */
const formatDate = (inputDate) => {
  if (!inputDate) {
    return moment()
      .format('YYYY-MM-DD')
  }
  const check = moment(inputDate, ['MM-DD', 'MM-DD-YY', 'MM-DD-YYYY', 'YYYY-MM-DD'])
  if (check.isValid()) {
    return check.format('YYYY-MM-DD')
  }
  throw new Error(`Input is not of valid format: ${inputDate}`)
}

/**
 * Encodes the From date into a proper format
 *
 * @param {string} date - date in 'YYYY-MM-DD' format
 * @param {string} utc - e.g. +01:00 for UTC+1
 * @return {string}
 */
const fromDate = (date, utc) => encodeURIComponent(`${date}T00:00:00${utc}`)

/**
 * Encodes the To date into a proper format
 *
 * @param {string} date - date in 'YYYY-MM-DD' format
 * @param {string} utc - e.g. +01:00 for UTC+1
 * @return {string}
 */
const toDate = (date, utc) => encodeURIComponent(`${date}T23:59:59${utc}`)

module.exports = {
  formatDate,
  fromDate,
  toDate
}
