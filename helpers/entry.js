const _ = require('lodash')

/**
 * @typedef TogglEntry
 * @property {string} description
 * @property {date} start
 * @property {number} duration
 */

/**
 * Compacts existing entries into one and sums up duration.
 * Uses the first item's start date/time
 *
 * @param {TogglEntry[]} result
 * @param {TogglEntry} value
 * @param {number} key
 * @param {Object} object
 */
function compactAllEntries (result, value, key, object) {
  const duplicate = result.find((entry) => entry.description === value.description)
  if (!duplicate) {
    value.duration = _.reduce(object, function (sum, entry) {
      return sum + (value.description === entry.description ? entry.duration : 0)
    }, 0)
    result.push(value)
  }
}

/**
 * Find all the unique entries
 *
 * @param {TogglEntry[]} timeEntries
 * @todo-konstantin: break by date, else we compact everything!
 *
 * @return {TogglEntry[]}
 */
const getUniqueEntries = (timeEntries) =>
  _(timeEntries)
    .map(({ description, start, duration }) => ({
      description,
      start,
      duration
    }))
    .transform(compactAllEntries, [])
    .value()

module.exports = {
  getUniqueEntries
}
