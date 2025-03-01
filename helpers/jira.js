'use strict'

const config = require('../config')
const { createJiraClient } = require('../services/client')
const {
  getSelf,
  getReducedIssueList
} = require('../services/jira')

/**
 * Returns JiraAccountId
 * @returns {Promise<string>}
 */
const getJiraAccountId = async () => {
  if (config.JiraAccountId) {
    return config.JiraAccountId
  }
  const jiraClient = createJiraClient()
  return getSelf(jiraClient).then(data => data.accountId)
}

/**
 * Filters missing issues
 *
 * @param {string[]} issueKeys
 * @param {Object.<string, string>} apiReducedIssue
 * @returns {string[]}
 */
const getMissingIssueKeys = (issueKeys, apiReducedIssue) =>
  issueKeys.filter(issueKey => !apiReducedIssue.hasOwnProperty(issueKey))

/**
 * Retrieve a map of issueKey & issue ID in JIRA as we can no longer just use issueKey
 *
 * @param {string[]} issueKeys
 * @returns {Promise<Object.<string, string>>} - e.g. { "JIRA-111": "1234" }
 */
const getIssueMap = async (issueKeys) => {
  const jiraClient = createJiraClient()
  const reducedIssueList = await getReducedIssueList(jiraClient, issueKeys)
  const apiReducedIssue = reducedIssueList.reduce((map, {
    id,
    key
  }) => {
    map[key.toUpperCase()] = id
    return map
  }, {})

  // sometimes issues are moved to a different project
  const missingIssueKeys = getMissingIssueKeys(issueKeys, apiReducedIssue)

  // we gotta map them one by one as the API is not friendly regarding moved issues
  const missingPromises = missingIssueKeys.map(async key => {
    const issues = await getReducedIssueList(jiraClient, [key])
    if (issues.length > 1) {
      throw new Error(`Multiple issues found for key ${key}: ${issues.map(issue => issue.key)
        .join(', ')}`)
    }
    return {
      key,
      issueId: issues[0].id
    }
  })

  const results = await Promise.all(missingPromises)
  results.forEach(({
    key,
    issueId
  }) => {
    apiReducedIssue[key] = issueId
  })

  return apiReducedIssue
}

module.exports = {
  getJiraAccountId,
  getIssueMap
}
