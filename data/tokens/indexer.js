const IndexLib = require('../../../lib/index-lib') // This will be executed inside build/raw/[dbName]

const views = [
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

module.exports = new IndexLib(views)
