import bluebird from 'bluebird'
import config from './config/index.js'
import { formatDate, formatTime } from './helpers/date.js'
import { getUniqueEntries, parseJiraData } from './helpers/entry.js'
import { tempoClient, togglClient } from './services/client.js'
import { queryTogglEntries } from './services/togglEntries.js'
import { queryTempoEntries } from './services/tempoEntries.js'

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
      }).catch(e => console.log(e.message))
    )
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
    .catch(error => console.log(error.message))
} else {
  transferFromTogglToTempo(fromDate, toDate, config.utc, config.dryRun)
    .catch(error => console.log(error.message))
}
