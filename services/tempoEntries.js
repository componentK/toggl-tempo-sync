'use strict'

/**
 * Retrieves entries from Tempo
 *
 * @param {AxiosInstance|*} tempoClient
 * @param {string} from - date in `2019-03-19` format
 * @param {string} to - date in `2019-04-25` format
 * @return {Promise<TempoEntry[]>}
 */
const queryTempoEntries = async (tempoClient, from, to) => {
  const params = new URLSearchParams({
    from,
    to,
    limit: 100
  })
  const { data: { results } } = await tempoClient.get(`worklogs`, { params })

  return results
}

module.exports = {
  queryTempoEntries
}
