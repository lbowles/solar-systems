import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { ethers } from "hardhat"
import readline from "readline"

function userInput(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close()
      resolve(ans)
    }),
  )
}

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  const utilities = await deployments.get("utils")
  const trigonometry = await deployments.get("Trigonometry")

  await deploy("Renderer", {
    from: deployer,
    libraries: {
      Utilities: utilities.address,
      Trigonometry: trigonometry.address,
    },
    log: true,
  })
}
export default func
func.tags = ["Renderer"]
func.dependencies = ["Libraries"]
