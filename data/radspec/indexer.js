const IndexLib = require('../../../lib/index-lib') // This will be executed inside build/raw/[dbName]

const index = [
  {
    key: '@key',
    api: 'sigs',
    pathTransform: item => '0x12345678', // TODO
    dataTransform: item => item['@value'],
    dumpTransform: text => text,
    extension: ''
  }
]

module.exports = new IndexLib(index)
