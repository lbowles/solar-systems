import { deployments, ethers } from "hardhat"
import { expect } from "chai"
import { SolarSystems, SolarSystems__factory } from "../types"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { BigNumber } from "ethers"

describe("SolarSystems", function () {
  let signers: SignerWithAddress[]
  let solarSystems: SolarSystems
  let mintPrice: BigNumber

  beforeEach(async function () {
    await deployments.fixture(["SolarSystems"])
    signers = await ethers.getSigners()
    const SolarSystems = await deployments.get("SolarSystems")
    solarSystems = SolarSystems__factory.connect(SolarSystems.address, signers[0]) as SolarSystems
    mintPrice = await solarSystems.price()
  })

  it("Should have the correct price set in the constructor", async function () {
    expect(await solarSystems.price()).to.equal(ethers.utils.parseEther("0.01"))
  })

  it("Should mint a new NFT and assign it to the caller", async function () {
    const initialSupply = await solarSystems.totalSupply()
    await solarSystems.connect(signers[0]).mint(1, { value: mintPrice })
    const finalSupply = await solarSystems.totalSupply()
    expect(finalSupply).to.equal(initialSupply.add(1))
    expect(await solarSystems.ownerOf(initialSupply)).to.equal(signers[0].address)
  })

  it("Should not allow minting more NFTs than the max supply", async function () {
    await expect(solarSystems.mint(100001, { value: mintPrice.mul("100001") })).to.be.revertedWith("Exceeds max supply")
  })

  it("Should return the correct token URI for a given token ID", async function () {
    const tokenId = 1
    const name = "SolarSystems #" + tokenId
    const description = "Fully on-chain, procedurally generated, animated solar systems."
    const svg = await solarSystems.tokenURI(tokenId)

    // Decode base64 encoded json
    const decoded = Buffer.from(svg.split(",")[1], "base64").toString()
    const json = JSON.parse(decoded)

    expect(json.name).to.equal(name)
    expect(json.description).to.equal(description)
    expect(json.image).to.contain("data:image/svg+xml;base64")
    expect(json.attributes).to.have.lengthOf(2)
    expect(json.attributes[0]["trait_type"]).to.equal("Planets")
    expect(json.attributes[0]["value"]).to.be.greaterThan(0)
    expect(json.attributes).to.have.lengthOf(2)
    expect(json.attributes[1]["trait_type"]).to.equal("Ringed Planets")
    expect(json.attributes[1]["value"]).to.be.greaterThanOrEqual(0)
  })

  it("Should allow the owner to withdraw their balance", async function () {
    const [owner, minter] = signers
    const initialBalance = await owner.getBalance()
    await solarSystems.connect(minter).mint(1, { value: mintPrice })
    await solarSystems.connect(owner).withdraw()
    const finalBalance = await owner.getBalance()
    expect(finalBalance).to.be.gt(initialBalance)
  })

  it("Should not allow a non-owner to withdraw the contract's balance", async function () {
    await expect(solarSystems.connect(signers[1]).withdraw()).to.be.revertedWith("Ownable: caller is not the owner")
  })
})
