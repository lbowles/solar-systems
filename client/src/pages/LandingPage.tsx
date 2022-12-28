import { SolarSystems, SolarSystems__factory } from "../../../backend/types"
import { getSVG } from "../util/sample"
import style from "./LandingPage.module.css"
import deployments from "../../src/deployments.json"
import background from ".././img/background.svg"
import loading from ".././img/loading.svg"
import { ConnectButton, useAddRecentTransaction } from "@rainbow-me/rainbowkit"
import { useEffect, useState } from "react"
import { prepareWriteContract, writeContract } from "@wagmi/core"
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useSigner,
  useWaitForTransaction,
} from "wagmi"
import { BigNumber } from "ethers"
import { formatEther } from "ethers/lib/utils.js"

const solarSystemsConfig = {
  address: deployments.contracts.SolarSystems.address,
  abi: deployments.contracts.SolarSystems.abi,
}

export function LandingPage() {
  const [heroSVG, setHeroSVG] = useState<string>()

  const [mintCount, setMintCount] = useState<number>(1)

  const { data: signer, isError, isLoading } = useSigner()

  const addRecentTransaction = useAddRecentTransaction()

  const {
    data: mintPrice,
    isError: isMintPriceError,
    isLoading: isMintPriceLoading,
  } = useContractRead({
    ...solarSystemsConfig,
    functionName: "price",
  })

  const {
    data: maxSupply,
    isError: isMaxSupplyError,
    isLoading: isMaxSupplyLoading,
  } = useContractRead({
    ...solarSystemsConfig,
    functionName: "maxSupply",
  })

  const {
    data: totalSupply,
    isError: isTotalSupplyError,
    isLoading: isTotalSupplyLoading,
  } = useContractRead({
    ...solarSystemsConfig,
    functionName: "totalSupply",
    watch: true,
  })

  const { config: mintConfig, error: mintError } = usePrepareContractWrite({
    ...solarSystemsConfig,
    functionName: "mint",
    args: [BigNumber.from(`${mintCount}`)],
    overrides: {
      value: mintPrice?.mul(mintCount!),
    },
  })
  const {
    write: mint,
    data: mintSignResult,
    isLoading: isMintSignLoading,
    isSuccess: isMintSignSuccess,
  } = useContractWrite(mintConfig)

  const {
    data: mintTx,
    isError: isMintTxError,
    isLoading: isMintTxLoading,
  } = useWaitForTransaction({
    hash: mintSignResult?.hash,
    confirmations: 1,
  })

  useEffect(() => {
    const svg = new Blob([getSVG(200)], { type: "image/svg+xml" })
    const url = URL.createObjectURL(svg)
    setHeroSVG(url)
  }, [])

  useEffect(() => {
    if (mintSignResult) {
      console.log("mintSign", mintSignResult.hash)
      addRecentTransaction({
        hash: mintSignResult.hash,
        description: "Mint Solar System",
      })
    }
  }, [mintSignResult])

  useEffect(() => {
    console.log("isMintSignSuccess", isMintSignSuccess)
  }, [isMintSignSuccess])

  useEffect(() => {
    console.log("isMintSignLoading", isMintSignLoading)
  }, [isMintSignLoading])

  useEffect(() => {
    console.log("mintTx", mintTx)
  }, [mintTx])

  useEffect(() => {
    console.log("isMintTxLoading", isMintTxLoading)
  }, [isMintTxLoading])

  return (
    <div>
      <div className="flex justify-center alignw-screen">
        <img
          className="object-cover top-0 absolute z-0 min-w-[1510px] max-w-[1510px]"
          src={background}
          alt="screenshot"
        ></img>
        <img src={heroSVG} className="mt-[195px]"></img>
      </div>
      <div className="flex justify-between p-10  absolute w-full top-0">
        <h3 className="text-base font-bold">SOLAR SYSTEMS</h3>
        <ConnectButton />
      </div>
      <div className="flex justify-center alignw-screen mt-28 z-1 pl-10 pr-10 z-10 relative">
        <p className="text-size-xs">{`${totalSupply}/${maxSupply}`} minted</p>
      </div>
      {mintPrice && maxSupply && totalSupply && (
        <div className="flex justify-center alignw-screen mt-6 z-1 pl-10 pr-10 z-10 relative">
          {isMintSignLoading ? (
            <button className={style.claimBtn}>
              <div className="flex flex-row">
                <img src={loading} className="animate-spin w-4"></img>‎ Confirm in wallet
              </div>
            </button>
          ) : isMintTxLoading ? (
            <a
              href={`https://${process.env.NODE_ENV === "development" ? "goerli." : ""}etherscan.io/tx/${
                mintSignResult?.hash
              }`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-center"
            >
              <button className={style.claimBtn}>
                <div className="flex flex-row">
                  <img src={loading} className="animate-spin w-4"></img>‎ Transaction pending
                </div>
              </button>
            </a>
          ) : (
            <div>
              <button
                className="text-xl font-bold  hover:scale-125 duration-100 ease-in-out"
                onClick={() => setMintCount(Math.max(mintCount - 1, 1))}
              >
                –
              </button>
              <button
                className={style.claimBtn}
                disabled={signer && maxSupply && totalSupply && maxSupply.gt(totalSupply) ? false : true}
                onClick={() => {
                  mint?.()
                }}
              >
                {maxSupply.gt(totalSupply)
                  ? `Mint ${mintCount} for ${formatEther(mintPrice.mul(mintCount))} Ξ`
                  : "Sold out"}
              </button>
              <button
                className="text-xl font-bold hover:scale-125 duration-100 ease-in-out"
                onClick={() => setMintCount(mintCount + 1)}
              >
                +
              </button>
            </div>
          )}
        </div>
      )}
      {mintTx && (
        <a
          href={`https://${process.env.NODE_ENV === "development" ? "goerli." : ""}etherscan.io/tx/${
            mintTx.transactionHash
          }`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-center"
        >
          View transaction
        </a>
      )}
      <div className="flex justify-center alignw-screen mt-28 z-1 pl-10 pr-10 z-10 relative">
        <p className="font-bold">Welcome to the Solar System NFT landing page!</p>
      </div>
      <div className="flex justify-center alignw-screen mt-10 z-1 pl-10 pr-10 relative">
        <div className=" block p-6 bg-white border border-gray-100 rounded-lg shadow-md ">
          <div
            className="grid  md:gap-12 gap-4 text-sm text-justify md:grid-cols-3 text-slate-700"
            style={{ maxWidth: "800px" }}
          >
            <div className="">
              <p className="font-bold mb-3 text-slate-800">What are they?</p>
              <p>
                Our NFTs feature fully on-chain animated SVG solar systems, which means that the media is stored
                directly on the blockchain and there are no off-chain dependencies. This ensures that your NFTs are
                secure and fully owned by you.
              </p>
            </div>
            <div className="">
              <p className="font-bold mb-3 text-slate-800">What are they?</p>
              <p>
                Every solar system in our NFTs is unique, as they are generated randomly with a variety of different
                configurations. No two solar systems are exactly the same, which means that your NFT will truly be
                one-of-a-kind.
              </p>
            </div>
            <div className="">
              <p className="font-bold mb-3 text-slate-800">What are they?</p>

              <p>
                We hope you enjoy collecting and displaying your Solar System NFTs! Start minting your own today and add
                some cosmic beauty to your collection.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center alignw-screen mt-24 z-1 pl-10 pr-10 z-10 relative">
        <footer className="sticky w-full py-4  bottom-0 text-center text-gray-700 text-sm">
          Made by{" "}
          <a
            href="https://twitter.com/npm_luko"
            className="font-bold text-blue-500 hover:text-blue-800"
            target="_blank"
          >
            @npm_luko
          </a>{" "}
          and{" "}
          <a
            href="https://twitter.com/stephancill"
            className="font-bold text-blue-500 hover:text-blue-800"
            target="_blank"
          >
            @stephancill
          </a>
        </footer>
      </div>
    </div>
  )
}
