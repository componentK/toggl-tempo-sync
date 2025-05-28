'use strict'

const {
  fromDate,
  toDate
} = require('../helpers/date')

/**
 * Retrieves entries from Toggl
 *
 * @param {AxiosInstance|*} togglClient
 * @param {string} from - date in `2019-03-19` format
 * @param {string} to - date in `2019-04-25` format
 * @param {string} utc - UTC hours to add, e.g. `+01:00` for UTC+1
 * @return {Promise<TogglEntry[]>}
 */
const queryTogglEntries = async (togglClient, from, to, utc) => {
  const { data: timeEntries } = await togglClient
    .get(`me/time_entries?start_date=${fromDate(from, utc)}&end_date=${toDate(to, utc)}`)

  return timeEntries
}

/**
 * Retrieves Toggl client data
 *
 * @param {AxiosInstance|*} togglClient
 * @return {Promise<ToggleAccountEntry>}
 */
const getAccountData = async (togglClient) => {
  const { data } = await togglClient(`me`)
  return data
}

/**
 * Retrieves Toggl client data
 *
 * @param {AxiosInstance|*} togglClient
 * @param {number} workspaceId
 * @param {?string} name - e.g. Nvidia
 * @return {Promise<TogglClientEntity[]>}
 */
const getActiveClients = async (togglClient, workspaceId, name = null) => {
  const { data } = await togglClient
    .get(`workspaces/${workspaceId}/clients?status=active${name ? `&name=${name}` : ''}`)
  return data
}

/**
 * Retrieves Toggl project data
 *
 * @param {AxiosInstance|*} togglClient
 * @param {number} workspaceId
 * @param {string[]|number[]} clientIds
 * @return {Promise<ToggleProject[]>}
 */
const getActiveProjects = async (togglClient, workspaceId, clientIds) => {
  const { data } = await togglClient.get(`workspaces/${workspaceId}/projects?statuses=active&client_ids=${clientIds.join(',')}`)
  return data
}

module.exports = {
  queryTogglEntries,
  getActiveClients,
  getAccountData,
  getActiveProjects
}
