/**
 * Retrieves entries from Tempo
 *
 * @param {AxiosInstance|*} tempoClient
 * @param {string} from - date in `2019-03-19` format
 * @param {string} to - date in `2019-04-25` format
 * @return {Promise<TempoEntry[]>}
 */
export const queryTempoEntries = async (tempoClient, from, to) => {
  const { data: timeEntries } = await tempoClient.post('worklogs', {
    from,
    to
  })

  return timeEntries
}
