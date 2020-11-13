const axios = require('axios')
const {
  togglAPIToken,
  togglBaseURL,
  tempoCloudURL,
  tempoCloudApiKey
} = require('../config')

module.exports.tempoClient = (options = {}) => {
  return axios.create({
    baseURL: tempoCloudURL,
    headers: {
      Authorization: `Bearer ${tempoCloudApiKey}`
    },
    timeout: 60 * 4 * 1000, // 4 min
    ...options
  })
}

/**
 * Token buffering
 * @param {string} token
 * @return {string}
 */
const bufferToken = (token) =>
  Buffer.from(`${token}:api_token`).toString('base64')

module.exports.togglClient = (options = {}) => {
  return axios.create({
    baseURL: togglBaseURL,
    headers: {
      Authorization: `Basic ${bufferToken(togglAPIToken)}`
    },
    ...options
  })
}
