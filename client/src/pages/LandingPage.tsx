import { SolarSystems, SolarSystems__factory } from "../../../backend/types"

import deployments from "../../deployments.json"

import { ConnectButton } from "@rainbow-me/rainbowkit"

export function LandingPage() {
  // const solarSystems = SolarSystems__factory.connect(deployments.contracts.SolarSystems.address)
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <ConnectButton />
    </div>
  )
}
