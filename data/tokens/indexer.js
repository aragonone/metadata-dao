const IndexLib = require('../../../lib/index-lib') // This will be executed inside build/raw/[dbName]

const views = [
  {
    api: 'addr',    // on the /api/tokens/addr/:addr resource
    key: 'address', // index by token address
  }, 
  {
    api: 'ticker',  // on the /api/tokens/ticker/:ticker resource
    key: 'symbol',  // index by token symbol
    pathTransform: ({ symbol }) => symbol.toLowerCase(), // paths are the lowercased token symbol /api/tokens/ticker/ant
  }
]

module.exports = new IndexLib(views)
