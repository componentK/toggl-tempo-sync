const axios = require('axios')
const rateLimit = require('axios-rate-limit')

const {
  togglAPIToken,
  togglBaseURL,
  tempoCloudURL,
  tempoCloudApiKey
} = require('../config')

/**
 * Wraps axios with rate limiter
 *
 * @param {AxiosInstance} axios
 * @return {RateLimitedAxiosInstance}
 */
const wrap = (axios) => rateLimit(axios, {
  maxRequests: 5,
  perMilliseconds: 1000,
  maxRPS: 5
})

module.exports.createTempoClient = (options = {}) => {
  return wrap(axios.create({
    baseURL: tempoCloudURL,
    headers: {
      Authorization: `Bearer ${tempoCloudApiKey}`
    },
    timeout: 60 * 4 * 1000, // 4 min
    ...options
  }))
}

/**
 * Token buffering
 * @param {string} token
 * @return {string}
 */
const bufferToken = (token) =>
  Buffer.from(`${token}:api_token`).toString('base64')

module.exports.createTogglClient = (options = {}) => {
  return axios.create({
    baseURL: togglBaseURL,
    headers: {
      Authorization: `Basic ${bufferToken(togglAPIToken)}`
    },
    ...options
  })
}
