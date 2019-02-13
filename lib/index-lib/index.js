const path = require('path')
const fs = require('fs')
const { promisify } = require('util')
const mkdirp = promisify(require('mkdirp'))

const identity = x => x

class IndexLib {
  constructor (indexKeys, { databaseName = 'db.json' } = {}) {
    this.indexKeys = indexKeys
    this.databaseName = databaseName
  }

  async index (inputDir, outputDir) {
    console.log('> Indexing...')
    const db = this.readDb(path.resolve(inputDir, this.databaseName))
    
    // TODO: Process special values like @link
    
    const stringify = data => JSON.stringify(data, 0, 2)

    for (const {
      key,
      api,
      pathTransform,
      dataTransform = identity,
      dumpTransform = stringify,
      extension = '.json',
      indexFile = '@all.json'
    } of this.indexKeys) {
      console.log(`> Indexing '${key}' to /api/${api}`)

      const nameTransform = pathTransform || ((item) => item[key])
      const apiPath = path.resolve(outputDir, api)

      const files = db.map(item => {
        const key = nameTransform(item)

        return {
          filename: path.resolve(apiPath, `${key}${extension}`),
          data: dataTransform(item),
          key,
        }
      })

      const allFileContent = files.reduce((acc, { key, data }) => ({
        ...acc,
        [key]: data
      }), {})

      const allFile = {
        filename: path.resolve(outputDir, api, indexFile),
        content: stringify(allFileContent)
      }
      
      await mkdirp(apiPath)
      files
        .map(({ filename, data }) => ({ filename, content: dumpTransform(data) }))
        .concat([ allFile ])
        .forEach(({ filename, content }) => fs.writeFileSync(filename, content))

      console.log(`> Saved ${files.length + 1} files ${apiPath}`)
    }
  }

  readDb (dbPath) {
    const db = JSON.parse(fs.readFileSync(dbPath))

    if (Array.isArray(db)) {
      return db
    } else {
      // Transform into an array of objects in which the object key is a value with key `@key`
      return Object.keys(db).reduce((acc, key) => (
        [
          ...acc,
          {
            ['@key']: key,
            ...(
              typeof db[key] !== 'object' || Array.isArray(db[key])
                ? { ['@value']: db[key] }
                : db[key]
              )

          },
        ]), [])
    }
  }
}

module.exports = IndexLib