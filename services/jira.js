'use strict'

/**
 * Retrieve data for current user
 * @param {AxiosInstance} jiraClient
 * @returns {Promise<JiraAPIMyselfResponse>}
 */
const getSelf = async (jiraClient) => {
  return jiraClient.get('/myself').then(response => response.data)
}

/**
 * Retrieves a map list of issueKeys to issueIds
 * @see JQL info: https://support.atlassian.com/jira-software-cloud/docs/jql-fields/
 * @param {AxiosInstance} jiraClient
 * @param {string[]} issueKeys
 * @returns {Promise<JiraAPIReducedIssue[]>}
 */
const getReducedIssueList = async (jiraClient, issueKeys) => {
  const issueKeysString = issueKeys.map(key => `'${key}'`).join(', ')
  return getIssueList(jiraClient, {
    fields: ['id', 'key'],
    jql: `issueKey IN (${issueKeysString})`
  }).then(response => response.data.issues)
}

/**
 * Retrieves a map list of issueKeys to issueIds
 * @param {AxiosInstance} jiraClient
 * @param {Object} data
 * @returns {Promise<Object>} - too big to document
 */
const getIssueList = async (jiraClient, data) => {
  return jiraClient.post('/search/jql', data)
}

module.exports = {
  getSelf,
  getReducedIssueList
}
