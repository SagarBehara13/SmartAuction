require('dotenv').config()

require('babel-register');
require('babel-polyfill');

const HDWalletProvider = require('truffle-hdwallet-provider');


const privateKey = process.env.PRIVATE_KEY


module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    matic: {
      provider: function() {
        return new HDWalletProvider(
          [privateKey],
          `https://rpc-mumbai.matic.today`
        )
      },
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      version: "0.6.6",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
