'use strict'

const _get = require('lodash/get')

const config = require('./config')
const {
  formatDate,
  formatTime
} = require('./helpers/date')
const {
  getUniqueEntries,
  parseJiraData,
  filterByProjectIds
} = require('./helpers/entry')
const {
  createTempoClient,
  createTogglClient
} = require('./services/client.js')

const {
  printClientProjects,
  printError
} = require('./services/printer')
const {
  queryTogglEntries,
  getAccountData,
  getActiveClients,
  getActiveProjects
} = require('./services/togglEntries')
const { queryTempoEntries } = require('./services/tempoEntries')
const {
  getJiraAccountId,
  getIssueMap
} = require('./helpers/jira')

/**
 * Main logic for toggl to tempo entry creation
 *
 * @param {Date8601} from
 * @param {Date8601} to
 * @param {string} utc
 * @param {boolean|string} dryRun
 * @return {Promise<void>}
 */
const transferFromTogglToTempo = async (from, to, utc, dryRun = false) => {
  const toggleClient = createTogglClient()
  let timeEntries = await queryTogglEntries(toggleClient, from, to, utc)
  console.log('number of time entries from toggl', timeEntries.length)

  if (config.projectIds) {
    timeEntries = timeEntries.filter(entry => filterByProjectIds(entry, config.projectIds))
    console.log('number of whitelisted project entries', timeEntries.length)
  }

  if (config.compact.all) {
    timeEntries = getUniqueEntries(timeEntries)
    console.log('number of unique entries', timeEntries.length)
  }

  const parsedEntries = timeEntries
    .map(timeEntry => parseJiraData(timeEntry))
    // Skip entries with duration less than 30 seconds
    .filter(({
      issueKey,
      duration
    }) => Boolean(issueKey) && duration >= 30)

  // We can no longer use issueKey like MAGE-122, so we need to retrieve a mpa (issue key to ID)
  const issueKeys = [...new Set(parsedEntries.map(({ issueKey }) => issueKey))]
  const issueMap = await getIssueMap(issueKeys)

  const populatedEntries = parsedEntries.map(issue => ({
    ...issue,
    issueId: issueMap[issue.issueKey.toUpperCase()] || null
  }))

  if (dryRun) return

  const authorAccountId = await getJiraAccountId()
  const tempoClient = createTempoClient()
  // create worklogs in tempo from toggl time entries
  await Promise.all(
    populatedEntries.map(
      async ({
        issueId,
        start,
        duration,
        comment
      }) => {
        // We already skip sub 30 second entries, now we round up 30 and 59 seconds entries
        const roundedDuration = duration < 60 ? 60 : duration
        return tempoClient.post('worklogs', {
          authorAccountId,
          issueId,
          startDate: formatDate(start),
          startTime: formatTime(start),
          timeSpentSeconds: roundedDuration,
          billableSeconds: roundedDuration,
          description: comment
        }).catch(e => printError(e))
      }
    )
  )

  console.log('number of worklogs added to tempo', parsedEntries.length)
}

/**
 * Main logic for deleting Tempo entries
 *
 * @param {Date8601} from
 * @param {Date8601} to
 * @param {boolean|string} dryRun
 * @return {Promise<void>}
 * @throws {Error}
 */
const removeFromTempo = async (from, to, dryRun = false) => {
  const entries = await queryTempoEntries(createTempoClient(), from, to)

  if (dryRun) {
    console.log(`Would be removing ${entries.length} entries`)
    console.log('first entry', _get(entries, '[0]'))
    console.log('last entry', _get(entries, `[${entries.length - 1}]`))
    return
  }

  const tempoClient = createTempoClient()
  await Promise.all(
    entries.map(
      async ({ tempoWorklogId }) => {
        return tempoClient.delete(`worklogs/${tempoWorklogId}`)
      }
    )
  )
  console.log(`Finished removing ${entries.length} entries`)
}

const getDefaultSpaceClients = async () => {
  const toggleClient = createTogglClient()
  const { default_workspace_id } = await getAccountData(toggleClient)
  const activeClients = await getActiveClients(toggleClient, default_workspace_id)
  const clientIds = activeClients.map(item => item.id)
  return getActiveProjects(toggleClient, default_workspace_id, clientIds)
}

const fromDate = formatDate(config.from ? config.from : config._[0])
const configToDate = config.to ? formatDate(config.to) : config.to
const toDate = configToDate || (config._[1] ? formatDate(config._[1]) : fromDate)

if (config.getClients) {
  getDefaultSpaceClients()
    .then(result => printClientProjects(result))
    .catch(err => printError(err))
} else if (config.delete) {
  removeFromTempo(fromDate, toDate, config.dryRun)
    .catch(error => printError(error))
} else {
  transferFromTogglToTempo(fromDate, toDate, config.utc, config.dryRun)
    .catch(error => printError(error))
}
