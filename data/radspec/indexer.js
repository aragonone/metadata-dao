const IndexLib = require('../../../lib/index-lib') // This will be executed inside build/raw/[dbName]
const { keccak256 } = require('js-sha3')

const sigBytes = signature => `0x${keccak256(signature).slice(0, 8)}`

const index = [
  {
    key: '@key',
    api: 'sigs',
    pathTransform: item => sigBytes(item['@key']),
    dataTransform: item => item['@value'],
    dumpTransform: text => text,
    extension: ''
  },
  {
    key: '@key',
    api: 'name',
    pathTransform: item => item['@key'],
    dataTransform: item => ({ sig: sigBytes(item['@key']), notice: item['@value'] }),
  }
]

module.exports = new IndexLib(index)
