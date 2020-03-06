const axios = require('axios')
const {
  togglAPIToken,
  togglBaseURL,
  tempoPassword,
  tempoBaseURL,
  tempoUserName,
  tempoAPIToken
} = require('../config')

module.exports.tempoClient = (options = {}) => axios.create({
  baseURL: tempoBaseURL,
  headers: {
    Authorization: `Bearer ${tempoAPIToken}`,
  },
  timeout: 60 * 4 * 1000, // 4 min
  ...options
})

module.exports.togglClient = (options = {}) => {
  const basicAuthToken = Buffer.from(`${togglAPIToken}:api_token`)
    .toString('base64')

  return axios.create({
    baseURL: togglBaseURL,
    headers: {
      Authorization: `Basic ${basicAuthToken}`
    },
    ...options
  })
}
