let {networkConfig }= require('../helper-hardhat-config')

module.exports = async({
  getNamedAccounts,
  deployments,
  getChainId 
}) => {
  const {deploy, log} = deployments
  const {deployer} = await getNamedAccounts()
  const chainId = await getChainId()

  log("[][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][]")
  const SOLNFT = await deploy("SOLNFT",{
    from:deployer,
    log:true
  })
  log(" ")
  log(`Deployed contract to ${SOLNFT.address}`)

  const solNFTContract = await ethers.getContractFactory("SOLNFT")
  const accounts = await hre.ethers.getSigners()
  const signer = accounts[0]
  const solNFT = new ethers.Contract(SOLNFT.address, solNFTContract.interface, signer)
  const networkName = networkConfig[chainId]['name']
  log(`Verify with : \n npx hardhat verify --network ${networkName} ${solNFT.address}`)
}