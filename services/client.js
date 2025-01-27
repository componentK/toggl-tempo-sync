'use strict'

const axios = require('axios')
const rateLimit = require('axios-rate-limit')

const {
  JiraApiURL,
  JiraUsername,
  JiraAPIKey,
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

/**
 * Client for Tempo Cloud
 * @param {Object} options
 * @return {AxiosInstance}
 */
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
 * @param {string} username
 * @param {string} token
 * @return {string}
 */
const bufferToken = (username, token) =>
  Buffer.from(`${username}:${token}`).toString('base64')

/**
 * Client for Toggl
 * @param {Object} options
 * @return {AxiosInstance}
 */
module.exports.createTogglClient = (options = {}) => {
  return axios.create({
    baseURL: togglBaseURL,
    headers: {
      Authorization: `Basic ${bufferToken(togglAPIToken, 'api_token')}`
    },
    ...options
  })
}

/**
 * Client for JIRA
 * @param {Object} options
 * @return {AxiosInstance}
 */
module.exports.createJiraClient = (options = {}) => {
  return axios.create({
    baseURL: JiraApiURL,
    headers: {
      Authorization: `Basic ${bufferToken(JiraUsername, JiraAPIKey)}`
    },
    ...options
  })
}
