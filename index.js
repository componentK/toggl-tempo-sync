const axios = require('axios')
const bluebird = require('bluebird')
const moment = require('moment')
const isNumber = require('is-number')

const { checkDate } = require('./helpers/date')
const { getUniqueEntries } = require('./helpers/entry')
const config = require('./config')
const {
  togglAPIToken,
  togglBaseURL,
  tempoPassword,
  tempoBaseURL,
  tempoUserName
} = config

const basicAuthToken = Buffer.from(`${togglAPIToken}:api_token`)
  .toString('base64')
const togglClient = axios.create({
  baseURL: togglBaseURL,
  headers: {
    Authorization: `Basic ${basicAuthToken}`
  }
})

const tempoClient = axios.create({
  baseURL: tempoBaseURL,
  auth: {
    username: tempoUserName,
    password: tempoPassword
  }
})

/**
 * Main logic
 *
 * @param {string} from
 * @param {string} to
 * @param {boolean} dryRun
 * @return {Promise<void>}
 */
const transferFromTogglToTempo = async (from, to, dryRun = false) => {
  // get time entries from toggl
  const startDate = encodeURIComponent(`${from}T00:00:00+01:00`)
  const endDate = encodeURIComponent(`${to}T23:59:59+01:00`)
  let { data: timeEntries } = await togglClient
    .get(`time_entries?start_date=${startDate}&end_date=${endDate}`)

  console.log('number of time entries from toggl', timeEntries.length)

  if (config.compact.all) {
    const uniqueEntries = getUniqueEntries(timeEntries)
    console.log('number of unique entries', uniqueEntries.length)
    timeEntries = uniqueEntries
  }

  // compute JIRA issueKey from tags
  const validTimeEntries = timeEntries
    .map((timeEntry) => {
      const { description } = timeEntry

      if (description.includes('-')) {
        // e.g. description being "MAGENTO-123 This is a ticket"
        const issueKey = description.split(' ', 1)
          .shift()
        const issueNum = issueKey.split('-')
          .pop()
        if (isNumber(issueNum)) {
          return {
            ...timeEntry,
            issueKey: issueKey.toUpperCase(),
            comment: description.replace(issueKey, '')
          }
        }
      }
      console.log(`Cannot parse out JIRA key from entry: "${description}"`)
      return timeEntry
    })
    .filter(({ issueKey }) => Boolean(issueKey))
    .filter(({ duration }) => duration >= 60)

  if (dryRun) return

  // create worklogs in tempo from toggl time entries
  await bluebird.map(
    validTimeEntries,
    async ({ issueKey, start, duration, comment }) => (
      tempoClient.post('worklogs/', {
        issue: {
          key: issueKey
        },
        timeSpentSeconds: duration,
        billedSeconds: duration,
        dateStarted: moment(start)
          .toDate(),
        comment,
        author: {
          name: tempoUserName
        }
      }))
  )

  console.log('number of worklogs added to tempo', validTimeEntries.length)
}

const fromDate = checkDate(config.from)
const toDate = config.to ? checkDate(config.to) : fromDate

transferFromTogglToTempo(fromDate, toDate, config.dryRun)
