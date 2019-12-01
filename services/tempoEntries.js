/**
 * Retrieves entries from Tempo
 *
 * @param {AxiosInstance|*} tempoClient
 * @param {string} worker - email of the worker whose entries we are pulling
 * @param {string} from - date in `2019-03-19` format
 * @param {string} to - date in `2019-04-25` format
 * @return {Promise<TempoEntry[]>}
 */
const queryTempoEntries = async (tempoClient, worker, from, to) => {
  const { data: timeEntries } = await tempoClient.post('worklogs/search', {
    from,
    to,
    worker: [
      worker
    ]
  })

  return timeEntries
}

module.exports = {
  queryTempoEntries
}
