import "@nomiclabs/hardhat-ethers"
import "@nomiclabs/hardhat-etherscan"
import "@nomiclabs/hardhat-waffle"
import "@typechain/hardhat"
import dotenv from "dotenv"
import "hardhat-deploy"
import "hardhat-gas-reporter"
import { HardhatUserConfig, task } from "hardhat/config"
import { HardhatNetworkUserConfig, NetworksUserConfig } from "hardhat/types"
dotenv.config()

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(await account.address)
  }
})

let hardhatNetwork: HardhatNetworkUserConfig = {}

if (process.env.FORK) {
  if (process.env.FORK === "mainnet") {
    console.log("forking mainnet")
    hardhatNetwork = {
      chainId: 1,
      forking: {
        url: `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      },
    }
  }
}

const networks: NetworksUserConfig = {
  hardhat: hardhatNetwork,
}

if (process.env.DEFAULT_DEPLOYER_KEY && process.env.INFURA_PROJECT_ID) {
  console.log(process.env.DEFAULT_DEPLOYER_KEY)
  networks["goerli"] = {
    chainId: 5,
    url: `https://goerli.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
    accounts: [process.env.DEFAULT_DEPLOYER_KEY],
    verify: {
      etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY || "",
      },
    },
  }
}

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.16",
      },
      // {
      //   version: "0.8.4",
      // },
    ],
    settings: {
      optimizer: {
        enabled: false,
      },
    },
  },
  networks,
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: process.env.ETHERSCAN_API_KEY || "",
  },
  typechain: {
    outDir: "types",
    target: "ethers-v5",
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  gasReporter: {
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
}

export default config
