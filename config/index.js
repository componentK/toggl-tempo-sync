import nconf from 'nconf'
import path from 'path';
import yaml from 'js-yaml'

// prevent exposing backend config on the frontend
if (typeof (window) !== 'undefined') {
  throw new Error('config cannot be used on front end')
}
const format = {
  parse: yaml.load,
  stringify: yaml.safeDump
}
const nconfProvider = new nconf.Provider()

// command line parameters
nconfProvider.argv({ parseValues: true })

nconfProvider.file('user', {
  file: path.resolve('user.yml'),
  format
})

nconfProvider.file('app-default', {
  file: path.resolve('default.yml'),
  format
})

/**
 * @var {ConfigResponse} config
 */
const config = nconfProvider.get()
export default config
