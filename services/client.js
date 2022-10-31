import axios from 'axios'
import config  from '../config/index.js'

export function tempoClient (options = {}) {
  return axios.create({
    baseURL: config.tempoCloudURL,
    headers: {
      Authorization: `Bearer ${config.tempoCloudApiKey}`
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

export function togglClient (options = {}) {
  return axios.create({
    baseURL: config.togglBaseURL,
    headers: {
      Authorization: `Basic ${bufferToken(config.togglAPIToken)}`
    },
    ...options
  })
}
