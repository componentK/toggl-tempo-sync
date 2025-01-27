// prevent exposing backend config on the frontend
if (typeof (window) !== 'undefined') {
  throw new Error('config cannot be used on front end')
}

const nconf = require('nconf')
const yaml = require('js-yaml')

const format = {
  parse: yaml.load,
  stringify: yaml.safeDump
}

const nconfProvider = new nconf.Provider()

// command line parameters
nconfProvider.argv({ parseValues: true })

nconfProvider.file('user', {
  file: `${__dirname}/user.yml`,
  format
})

nconfProvider.file('app-default', {
  file: `${__dirname}/default.yml`,
  format
})
/**
 * @type {ConfigResponse}
 */
module.exports = nconfProvider.get()
