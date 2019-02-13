const IndexLib = require('../../../lib/index-lib') // This will be executed inside build/raw/[dbName]

const index = [
  {
    key: 'address',
    api: 'addr',
  }, 
  {
    key: 'symbol',
    api: 'ticker',
    pathTransform: ({ symbol }) => symbol.toLowerCase(),
  }
]

module.exports = new IndexLib(index)
