const IndexLib = require('../../../lib/index-lib') // This will be executed inside build/raw/[dbName]
const { keccak256 } = require('js-sha3')

const sigBytes = signature => `0x${keccak256(signature).slice(0, 8)}`

const views = [
  {
    api: 'sig', // on the /api/radspec/sig/:sig resource
    key: '@key', // index by the key of the object (the function signature)
    pathTransform: item => sigBytes(item['@key']), // paths are the signature identifier /api/radspec/sigs/0x12345678
    dataTransform: item => ({ signature: item['@key'], notice: item['@value'] }), // the served data is a JSON object
  },
  {
    api: 'name', // on the /api/radspec/name/:name resource
    key: '@key', // index by the key of the object (the function signature)
    pathTransform: item => item['@key'], // paths are signature /api/radspec/name/setOwner(address)
    dataTransform: item => ({ sig: sigBytes(item['@key']), notice: item['@value'] }), // the served data is a JSON object
  }
]

module.exports = new IndexLib(views)
