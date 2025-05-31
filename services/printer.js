'use strict'

const _get = require('lodash/get')

/**
 * @param {ToggleProject[]} projects
 */
const printClientProjects = (projects) => {
  const clients = projects.reduce((acc, project) => {
    const {
      client_name,
      client_id,
      name,
      id
    } = project
    if (!acc[client_name]) {
      acc[client_name] = {
        clientId: client_id,
        projects: []
      }
    }
    acc[client_name].projects.push({
      name,
      id
    })
    return acc
  }, {})

  Object.entries(clients)
    .forEach(([clientName, {
      clientId,
      projects
    }]) => {
      console.log(`"${clientName}" (${clientId})`)
      projects.forEach(p => console.log(`    Project "${p.name}" (${p.id})`))
    })
}

/**
 * Helps print errors
 * @param {AxiosError} error
 * @throws {Error}
 */
const printError = error => {
  if (!error.response) {
    console.log(error)
    throw Error()
  }
  console.log(translateError(error))
  throw Error(error.message)
}

/**
 * Structures error
 * @param {AxiosError} error
 * @return {string}
 * @private
 */
const translateError = error => {
  const errorList = _get(error, 'response.data.errors', []).map(err => err.message)
  return JSON.stringify({
    url: `${error.config.method.toUpperCase()} ${error.config.baseURL}${error.config.url}`,
    status: error.response.status,
    statusText: error.response.statusText,
    message: error.message,
    errorList,
    requestBody: error.config.data
  })
}

module.exports = {
  printClientProjects,
  printError
}
