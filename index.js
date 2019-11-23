const bluebird = require('bluebird')
const moment = require('moment')

/**
 * @var {ConfigResponse}config
 */
const config = require('./config')
const { formatDate } = require('./helpers/date')
const { getUniqueEntries, parseJiraData } = require('./helpers/entry')
const { tempoClient, togglClient } = require('./services/client.js')
const { queryTogglEntries } = require('./services/togglEntries')

/**
 * Main logic
 *
 * @param {date8601} from
 * @param {date8601} to
 * @param {boolean|string} dryRun
 * @return {Promise<void>}
 */
const transferFromTogglToTempo = async (from, to, dryRun = false) => {
  let timeEntries = await queryTogglEntries(togglClient(), from, to, config.utc)
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
        issue: {
          key: issueKey
        },
        timeSpentSeconds: duration,
        billedSeconds: duration,
        dateStarted: moment(start).utcOffset(config.utc).toISOString(true),
        comment,
        author: {
          name: config.tempoUserName
        }
      }))
  )

  console.log('number of worklogs added to tempo', parsedEntries.length)
}

const fromDate = formatDate(config.from)
const toDate = config.to ? formatDate(config.to) : fromDate

transferFromTogglToTempo(fromDate, toDate, config.dryRun)
  .catch(function (error) {
    console.log(error)
  })
