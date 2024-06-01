const { fromDate, toDate } = require('../helpers/date')

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

module.exports = {
  queryTogglEntries
}
