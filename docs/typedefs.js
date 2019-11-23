/**
 * @typedef TogglEntry
 * @property {string} description - e.g. "MAGENTO-123 This is a ticket"
 * @property {date} start - ISO 8601 format
 * @property {date} stop - ISO 8601 format
 * @property {number} duration - seconds of work time
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
 * @property {boolean|string|undefined} dryRun - whether to run
 * @property {string} tempoUserName - user name to log in to Tempo/JIRA
 * @property {string} tempoPassword - password to log in to Tempo/JIRA
 * @property {string} tempoBaseURL - URL of Tempo/JIRA API service
 * @property {string} togglBaseURL - URL of Toggl API service
 * @property {string} togglAPIToken - Toggl API token
 * @property {ConfigResponseCompact} compact
 */

/**
 * @typedef {Object} ConfigResponseCompact
 * @property {boolean} all - whether to compact all entries with same summary into one or keep them all separate
 */
