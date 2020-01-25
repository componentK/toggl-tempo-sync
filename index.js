const bluebird = require('bluebird')

/**
 * @var {ConfigResponse}config
 */
const config = require('./config')
const { formatDate } = require('./helpers/date')
const { getUniqueEntries, parseJiraData } = require('./helpers/entry')
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
      tempoClient().post('worklogs/', {
        worker: config.tempoWorker,
        originTaskId: issueKey,
        started: formatDate(start),
        timeSpentSeconds: duration,
        billableSeconds: duration,
        comment,
        includeNonWorkingDays: true
      }))
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
  const entries = await queryTempoEntries(tempoClient(), config.tempoWorker, from, to)

  if (dryRun) return

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
    .catch(error => console.log(error.message))
} else {
  transferFromTogglToTempo(fromDate, toDate, config.utc, config.dryRun)
    .catch(error => console.log(error.message))
}
