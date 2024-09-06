const bluebird = require('bluebird')
const _get = require('lodash.get')

/**
 * @var {ConfigResponse} config
 */
const config = require('./config')
const {
  formatDate,
  formatTime
} = require('./helpers/date')
const {
  getUniqueEntries,
  parseJiraData
} = require('./helpers/entry')
const { tempoClient, togglClient } = require('./services/client.js')
const { queryTogglEntries } = require('./services/togglEntries')
const { queryTempoEntries } = require('./services/tempoEntries')

/**
 * Main logic for toggl to tempo entry creation
 *
 * @param {date8601} from
 * @param {date8601} to
 * @param {string} utc
 * @param {boolean|string} dryRun
 * @return {Promise<void>}
 */
const transferFromTogglToTempo = async (from, to, utc, dryRun = false) => {
  let timeEntries = await queryTogglEntries(togglClient(), from, to, utc)
  console.log('number of time entries from toggl', timeEntries.length)

  if (config.compact.all) {
    timeEntries = getUniqueEntries(timeEntries)
    console.log('number of unique entries', timeEntries.length)
  }

  const parsedEntries = timeEntries
    .map((timeEntry) => parseJiraData(timeEntry))
    .filter(({ issueKey }) => Boolean(issueKey))

  if (dryRun) return

  // create worklogs in tempo from toggl time entries
  await bluebird.map(
    parsedEntries,
    async ({ issueKey, start, duration, comment }) => (
      tempoClient().post('worklogs', {
        authorAccountId: config.JiraAccountId,
        issueKey,
        startDate: formatDate(start),
        startTime: formatTime(start),
        timeSpentSeconds: duration,
        billableSeconds: duration,
        description: comment
      }).catch(e => printError(e)))
  )

  console.log('number of worklogs added to tempo', parsedEntries.length)
}

/**
 * Main logic for deleting Tempo entries
 *
 * @param {date8601} from
 * @param {date8601} to
 * @param {string} utc
 * @param {boolean|string} dryRun
 * @return {Promise<void>}
 */
const removeFromTempo = async (from, to, utc, dryRun = false) => {
  const entries = await queryTempoEntries(tempoClient(), from, to)

  if (dryRun) {
    console.log(`Would be removing ${entries.length} entries`)
    return
  }

  await bluebird.map(
    entries,
    async ({ tempoWorklogId }) => (
      tempoClient().delete(`worklogs/${tempoWorklogId}`))
  )
  console.log(`Finished removing ${entries.length} entries`)
}

const fromDate = formatDate(config.from ? config.from : config._[0])
const configToDate = config.to ? formatDate(config.to) : config.to
const toDate = configToDate || (config._[1] ? formatDate(config._[1]) : fromDate)

if (config.delete) {
  removeFromTempo(fromDate, toDate, config.utc, config.dryRun)
    .catch(error => printError(error))
} else {
  transferFromTogglToTempo(fromDate, toDate, config.utc, config.dryRun)
    .catch(error => printError(error))
}

/**
 * Helps print errors
 * @param {AxiosError} error
 */
const printError = error => {
  console.log(translateError(error))
}
/**
 * Structures error
 * @param {AxiosError} error
 * @return {string}
 */
const translateError = error => {
  const errorList = _get(error, 'response.data.errors', []).map(err => err.message)
  return JSON.stringify({
    url: `${error.config.method.toUpperCase()} ${error.config.baseURL}${error.config.url}`,
    status: error.response.status,
    statusText: error.response.statusText,
    message: error.message,
    errorList,
    requestBody: error.config.data
  })
}
