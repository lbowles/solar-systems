import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { ethers } from "hardhat"

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  const utilitiesLibrary = await deploy("utils", {
    from: deployer,
  })

  const trigonometryLibrary = await deploy("Trigonometry", {
    from: deployer,
  })

  const rendererLibrary = await deploy("Renderer", {
    from: deployer,
  })

  await deploy("SolarSystems", {
    from: deployer,
    log: true,
    libraries: {
      Utilities: utilitiesLibrary.address,
      Trigonometry: trigonometryLibrary.address,
      Renderer: rendererLibrary.address,
    },
    args: [ethers.utils.parseEther("0.01"), 1000],
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
  })
}
export default func
func.tags = ["SolarSystems"]

// import {HardhatRuntimeEnvironment} from "hardhat/types"
// import {DeployFunction} from "hardhat-deploy/types"

// const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
//   const {deployments, getNamedAccounts} = hre
//   const {deploy} = deployments

//   const {deployer} = await getNamedAccounts()

//   await deploy("Greeter", {
//     from: deployer,
//     log: true,
//     args: ["Hello, Hardhat!"],
//     autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
//   })
// }
// export default func
// func.tags = ["Greeter"]
