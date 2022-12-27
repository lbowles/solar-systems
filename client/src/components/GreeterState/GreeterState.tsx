import { useEffect } from "react"
import { useAccount, useContract, useContractRead, useContractWrite, useProvider, useSigner } from "wagmi"
import deployments from "./../../deployments.json"
// import {Greeter} from "../../../../backend/types"

export const GreeterState = () => {
  const provider = useProvider()
  const [{ data: signer }] = useSigner()
  const [{ data: account }] = useAccount()
  

  // const greeter = useContract({
  //   addressOrName: deployments.contracts.Greeter.address,
  //   contractInterface: deployments.contracts.Greeter.abi,
  //   signerOrProvider: signer || provider,
  // }) as Greeter

  // const [{ data: greeting, error }, readGreeting] = useContractRead(
  //   {
  //     addressOrName: deployments.contracts.Greeter.address,
  //     contractInterface: deployments.contracts.Greeter.abi,
  //     signerOrProvider: provider,
  //   },
  //   'greet'
  // ) 

  // const setGreeting = async (greeting: string) => {
  //   try {
  //     const tx = await greeter?.setGreeting(`Hello, ${greeting}`)
  //     console.log(tx)
  //     await tx?.wait()
  //     readGreeting()
  //   } catch (e) {
  //     console.warn(e)
  //   }
  // }

  // useEffect(() => {
  //   readGreeting()
  // }, [provider])

  return <div>
    {/* <div>{greeting}{error?.message}</div>
    {signer && <div>
      <button onClick={() => account?.address && setGreeting(account?.address)}>Update greeting</button>
      <button onClick={() => setGreeting("Hardhat")}>Reset greeting</button>
    </div>} */}
    
  </div>
}