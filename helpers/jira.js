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
 * Retrieve a map of issueKey & issue ID in JIRA as we can no longer just use issueKey
 * @param {string[]} issueKeys
 * @returns {Promise<JiraAPIReducedIssue>}
 */
const getIssueMap = async (issueKeys) => {
  const jiraClient = createJiraClient()
  const reducedIssueList = await getReducedIssueList(jiraClient, issueKeys)
  return reducedIssueList.reduce((map, {
    id,
    key
  }) => {
    map[key.toUpperCase()] = id
    return map
  }, {})
}

module.exports = {
  getJiraAccountId,
  getIssueMap
}
