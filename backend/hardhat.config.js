require('@nomiclabs/hardhat-waffle')
require('@nomiclabs/hardhat-ethers')
require('hardhat-deploy')
require('@nomiclabs/hardhat-etherscan')

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address)
  }
})

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require('dotenv').config()
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL
const MNEMONIC = process.env.MNEMONIC
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

module.exports = {
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {},
    goerli: {
      url: GOERLI_RPC_URL,
      accounts: {
        mnemonic: MNEMONIC,
      },
      saveDeployments: true,
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  solidity: '0.8.4',
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
}
