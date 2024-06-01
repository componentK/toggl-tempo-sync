/**
 * @typedef TogglEntry
 * @property {string} description - e.g. "MAGENTO-123 This is a ticket"
 * @property {date} start - ISO 8601 format
 * @property {date} stop - ISO 8601 format
 * @property {number} duration - seconds of work time
 */

/**
 * @typedef TempoEntry
 * @property {number} id - entry to reference
 * @property {number} jiraWorklogId - seems to be the same as id
 * @property {string} comment - e.g. "This is a ticket"
 * @property {date8601} dateStarted - ISO 8601 format
 * @property {date8601} dateCreated - ISO 8601 format
 * @property {date8601} dateUpdated - ISO 8601 format
 */

/**
 * @typedef {string} date8601
 * @description String in the ISO 8601 format, e.g. YYYY-MM-ddT00:00:00.000+0000
 */
/**
 * @typedef {Object} ConfigResponse
 * @property {string} utc - e.g. +04:00 or -05:00
 * @property {date8601} to
 * @property {date8601} from
 * @property {boolean|string|undefined} delete - whether to delete entries from Atlassian Tempo
 * @property {boolean|string|undefined} dryRun - whether to run
 * @property {string} togglBaseURL - URL of Toggl API service
 * @property {string} tempoCloudURL - URL of Toggl Cloud API
 * @property {string} tempoCloudApiKey - Toggl Cloud API Authorize Key
 * @property {string} togglAPIToken - Toggl API token
 * @property {string} JiraAccountId - Atlassian main user account ID
 * @property {ConfigResponseCompact} compact
 */

/**
 * @typedef {Object} ConfigResponseCompact
 * @property {boolean} all - whether to compact all entries with same summary into one or keep them all separate
 */
