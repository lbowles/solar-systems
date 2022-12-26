import { ethers } from "hardhat"
import { Greeter, Greeter__factory } from "../types"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"

describe("Greeter", function () {
  let signers: SignerWithAddress[]
  let greeter: Greeter

  beforeEach(async function () {
    signers = await ethers.getSigners()
    const greeterFactory = new Greeter__factory(signers[0])
    greeter = await greeterFactory.deploy("Hello, Hardhat!")
    await greeter.deployed()
  })

  it("Should return the new greeting once it's changed", async function () {
    const Greeter = await ethers.getContractFactory("Greeter")
    const greeter = await Greeter.deploy("Hello, world!")
    await greeter.deployed()

    expect(await greeter.greet()).to.equal("Hello, world!")

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!")

    // wait until the transaction is mined
    await setGreetingTx.wait()

    expect(await greeter.greet()).to.equal("Hola, mundo!")
  })
})
