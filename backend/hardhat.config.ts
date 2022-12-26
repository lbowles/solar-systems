import { HardhatUserConfig, task } from "hardhat/config"
import "@typechain/hardhat"
import "@nomiclabs/hardhat-waffle"
import "@nomiclabs/hardhat-ethers"
import "hardhat-deploy"
import dotenv from "dotenv"
import { HardhatNetworkUserConfig } from "hardhat/types"
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
        url: `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
      }
    }
  }
}

const config: HardhatUserConfig = {
  solidity: "0.8.0",
  networks: {
    hardhat: hardhatNetwork
  },
  typechain: {
    outDir: "types",
    target: "ethers-v5",
  },
  namedAccounts: {
    deployer: {
      default: 0,
    }
  }
}

export default config
