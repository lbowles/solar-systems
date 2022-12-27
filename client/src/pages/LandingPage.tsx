import { SolarSystems, SolarSystems__factory } from "../../../backend/types"
import {getSVG} from "../util/sample"
import deployments from "../../deployments.json"
import background from ".././img/background.svg"
import { ConnectButton } from "@rainbow-me/rainbowkit"

export function LandingPage() {
 

  const svg = new Blob([getSVG(200)], { type: "image/svg+xml" });
  const url = URL.createObjectURL(svg);

  return (
    <div>
            {/* <h3 className="text-base font-bold  z-2 ">Solar Systems</h3>
      <ConnectButton/> */}
      <div className="flex justify-center alignw-screen" >
        <img className="object-cover top-0 absolute z-0" src={background} alt="screenshot" style={{minWidth:"1500px",maxWidth:"1500px"}} ></img>
      <img src={ url} style={{marginTop:"195px"}}></img>

      </div>
      <div className="flex justify-between p-10">

      </div>
    </div>
  )
}
