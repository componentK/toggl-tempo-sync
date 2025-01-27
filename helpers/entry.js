'use strict'

const _ = require('lodash')
const moment = require('moment')
const isNumber = require('is-number')

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
 * Gets unique entries
 * 1. Splits by date into 2 different lists
 * 2. First map simply goes over the lists
 * 3. Second map strips not needed properties
 * 4. Transform creates a unique list of entries with durations summed up
 * 5. Flatten concatenates the two lists
 * 6. Returns the array instead of the lodash wrapper
 *
 * @param {TogglEntry[]} timeEntries
 * @return {TogglEntry[]}
 */
const getUniqueEntries = timeEntries =>
  _(timeEntries)
    .groupBy((value) => moment(value.start).format('MM-DD-YYYY'))
    .map((entriesByDate) =>
      _(entriesByDate)
        .map(({
          description,
          start,
          duration
        }) => ({
          description,
          start,
          duration
        }))
        .transform(compactAllEntries, [])
        .value())
    .flatten()
    .value()

/**
 * Parses data and returns a modified TogglEntry
 *
 * @param {TogglEntry} timeEntry
 * @returns {TogglEntry | {issueKey: string, comment:string}}
 */
const parseJiraData = timeEntry => {
  const { description } = timeEntry

  if (description.includes('-')) {
    const issueKey = description.split(' ', 1).shift()
    const issueNum = issueKey.split('-').pop()
    if (isNumber(issueNum)) {
      return {
        ...timeEntry,
        issueKey: issueKey.toUpperCase(),
        comment: _(description).replace(issueKey, '').trim()
      }
    }
  }
  console.log(`Cannot parse out JIRA key from entry: "${description}"`)
  return timeEntry
}

module.exports = {
  getUniqueEntries,
  parseJiraData
}
