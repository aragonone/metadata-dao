const APM = require('@aragon/apm')
const Web3 = require('web3')

const DEFAULT_NETWORKS = {
  staging: {
    ens: '0xfe03625ea880a8cba336f9b5ad6e15b0a3b5a939',
    eth: 'https://rinkeby.eth.aragon.network',
  }
}

const DEFAULT_IPFS = { gateway: 'http://localhost:8080/ipfs' }
const DEFAULT_METADATA_REPO = 'metadata.aragonpm.eth'

const JSON_FORMAT = 'json'

class MetadataDAO {
  constructor ({ apm, network = 'staging', ipfs = DEFAULT_IPFS } = {}) {
    if (apm) {
      this.apm = apm
    } else if (DEFAULT_NETWORKS[network]) {
      const { ens, eth } = DEFAULT_NETWORKS[network]
      this.apm = APM(new Web3(eth), { ipfs, ensRegistryAddress: ens })
    } else {
      throw new Error('Couldnt initialize Metadata DAO. Required apm or network')
    }
  }

  async init (repo = DEFAULT_METADATA_REPO) {
    const { content } = await this.apm.getLatestVersion(repo)

    this.metadataRoot = `${content.provider}:${content.location}`
  }

  async query (database, view, query, { format = JSON_FORMAT } = {}) {
    if (!this.metadataRoot) {
      await this.init()
    }

    const extension = format ? `.${format}` : ''
    const path = `/api/${database}/${view}/${query}${extension}`
    const file = await this.apm.getFile(this.metadataRoot, path)

    if (format === JSON_FORMAT) {
      return JSON.parse(file)
    }

    return file
  }
}

module.exports = MetadataDAO
