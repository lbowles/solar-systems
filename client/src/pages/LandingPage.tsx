import { SolarSystems, SolarSystems__factory } from "../../../backend/types"
import { getSVG } from "../util/sample"
import style from "./LandingPage.module.css"
import deployments from "../../src/deployments.json"
import background from ".././img/background.svg"
import loading from ".././img/loading.svg"
import opensea from ".././img/opensea.svg"
import github from ".././img/github.svg"
import etherscan from ".././img/etherscan.svg"
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
import useSound from "use-sound"
import successSound from ".././sounds/success.mp3"
import smallClickSound from ".././sounds/smallClick.mp3"
import mintClickSound from ".././sounds/mintClickSound.mp3"
import generalClickSound from ".././sounds/generalClickSound.mp3"

const solarSystemsConfig = {
  address: deployments.contracts.SolarSystems.address,
  abi: deployments.contracts.SolarSystems.abi,
}

const etherscanBaseURL = `https://${process.env.NODE_ENV === "development" ? "goerli." : ""}etherscan.io`

function getOpenSeaLink(tokenId: string | number) {
  const development = process.env.NODE_ENV === "development"
  return `https://${development ? "testnets." : ""}opensea.io/assets/${development ? "goerli/" : ""}${
    deployments.contracts.SolarSystems.address
  }/${tokenId}`
}

export function LandingPage() {
  const [heroSVG, setHeroSVG] = useState<string>()

  const [mintCount, setMintCount] = useState<number>(1)

  const [mintedTokens, setMintedTokens] = useState<number[]>([])

  const { data: signer, isError, isLoading } = useSigner()

  const addRecentTransaction = useAddRecentTransaction()

  const [playbackRate, setPlaybackRate] = useState(0.75)

  const [playSuccess] = useSound(successSound)

  const [playGeneralClick] = useSound(generalClickSound)

  // const [playSmallClickUp] = useSound()

  const [playSmallClick] = useSound(smallClickSound, {
    playbackRate,
    interrupt: true,
  })

  const [playMintClick] = useSound(mintClickSound)

  const handleAmountClickUp = () => {
    setPlaybackRate(playbackRate + 0.4)
    playSmallClick()
  }
  const handleAmountClickDown = () => {
    if (mintCount > 1) setPlaybackRate(playbackRate - 0.4)
    playSmallClick()
  }

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
    if (isMintSignSuccess) {
      playMintClick()
    }
  }, [isMintSignSuccess])

  useEffect(() => {
    console.log("isMintSignLoading", isMintSignLoading)
  }, [isMintSignLoading])

  useEffect(() => {
    console.log("mintTx", mintTx)
    if (mintTx) {
      playSuccess()
      const tokenIds = mintTx.logs.map((log) => {
        const events = SolarSystems__factory.createInterface().decodeEventLog("Transfer", log.data, log.topics)
        return events.tokenId.toString()
      })
      setMintedTokens(tokenIds)
    }
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
              onClick={() => {
                playGeneralClick()
              }}
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
                onClick={() => {
                  setMintCount(Math.max(mintCount - 1, 1))
                  handleAmountClickDown()
                }}
              >
                –
              </button>
              <button
                className={style.claimBtn}
                disabled={signer && maxSupply && totalSupply && maxSupply.gt(totalSupply) ? false : true}
                onClick={() => {
                  mint?.()
                  playGeneralClick()
                }}
              >
                {maxSupply.gt(totalSupply)
                  ? `Mint ${mintCount} for ${formatEther(mintPrice.mul(mintCount))} Ξ`
                  : "Sold out"}
              </button>
              <button
                className="text-xl font-bold hover:scale-125 duration-100 ease-in-out"
                onClick={() => {
                  setMintCount(mintCount + 1)
                  handleAmountClickUp()
                }}
              >
                +
              </button>
            </div>
          )}
        </div>
      )}
      {mintTx && mintTx.status && (
        <div className="flex justify-center alignw-screen mt-1 z-1 pl-10 pr-10 z-10 relative -mb-5 h-4">
          <div>
            <a
              href={`https://${process.env.NODE_ENV === "development" ? "goerli." : ""}etherscan.io/tx/${
                mintTx.transactionHash
              }`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-center text-xs hover:text-blue-900"
            >
              View transaction
            </a>
          </div>

          <div>
            Minted tokens:[{" "}
            {mintedTokens.map((tokenId) => {
              return (
                <span>
                  <a
                    href={getOpenSeaLink(tokenId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs hover:text-blue-900"
                  >
                    {tokenId}
                  </a>
                  &nbsp;
                </span>
              )
            })}{" "}
            ]
          </div>
        </div>
      )}
      <div className="flex justify-center alignw-screen mt-28 z-1 pl-10 pr-10 z-10 relative">
        <p className="font-bold">Fully on-chain, procedurally generated, animated solar systems.</p>
      </div>
      <div className="flex justify-center alignw-screen mt-10 z-1 pl-10 pr-10 relative">
        <div className="block bg-white border border-gray-100 rounded-lg shadow-md w-[450px]">
          <div className="w-100 px-5 pt-5">
            <p className="font- text-xl pb-4">FAQ</p>
            <div className="block bg-gray-100 px-3 py-2 rounded-lg w-100 text-sm text-gray-900 ">
              <span>What are Solar Systems?</span>
            </div>
            <p className="text-sm text-gray-500 px-3 pt-3 pb-5">
              Solar Systems are a fully on-chain NFT collection which features procedurally generated planets orbiting
              around a star. Each Solar System is unique and can be minted for the price of 0.01 ETH. The collection is
              limited to 1,000 Solar Systems.
            </p>
            <div className="block bg-gray-100 px-3 py-2 rounded-lg w-100 text-sm text-gray-900 mt-1">
              <span>Features</span>
            </div>
            <p className="text-sm text-gray-500 px-3 pt-3 pb-5">
              Each Solar System is
              <ul className="space-y-2 mt-2  list-disc list-inside ml-3">
                <li>
                  <span className="text-gray-500 font-bold">Procedurally generated.</span> This means that the solar
                  systems are generated using a set of rules or procedures, rather than being created manually or
                  pre-designed. This makes each solar system fully unique.
                </li>
                <li>
                  <a
                    href={`${etherscanBaseURL}/address/${deployments.contracts.Renderer.address}`}
                    onClick={() => {
                      playGeneralClick()
                    }}
                  >
                    <span className="text-gray-500 font-bold underline hover:text-blue-900">Fully on-chain</span>
                  </a>
                  . This means that your NFT will exist for as long as the Ethereum blockchain is around.
                </li>
                <li>
                  <span className="text-gray-500 font-bold">Animated.</span> Planets orbit around a star which adds to a
                  dynamic and lively viewing experience.
                </li>
              </ul>
            </p>
          </div>
          <div className="w-100 bg-slate-900 h-12 -ml-0 -mr-0 translate-y-[1px] rounded-bl-lg rounded-br-lg pt-3">
            <div className="flex justify-center items-center ">
              <div className=" grid  grid-flow-col gap-3">
                {/* TODO: Add OpenSea */}

                <a
                  className="hover:scale-110 duration-100 ease-in-out"
                  onClick={() => {
                    playGeneralClick()
                  }}
                >
                  <img src={opensea} alt="opensea" />
                </a>
                <a
                  className="hover:scale-110 duration-100 ease-in-out"
                  href={`${etherscanBaseURL}/address/${deployments.contracts.SolarSystems.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    playGeneralClick()
                  }}
                >
                  <img src={etherscan} alt="etherscan" />
                </a>
                <a
                  href="https://github.com/lbowles/SolarNFT"
                  className="hover:scale-110 duration-100 ease-in-out"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    playGeneralClick()
                  }}
                >
                  <img src={github} alt="github" />
                </a>
              </div>
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
            onClick={() => {
              playGeneralClick()
            }}
          >
            @npm_luko
          </a>{" "}
          and{" "}
          <a
            href="https://twitter.com/stephancill"
            className="font-bold text-blue-500 hover:text-blue-800"
            target="_blank"
            onClick={() => {
              playGeneralClick()
            }}
          >
            @stephancill
          </a>
        </footer>
      </div>
    </div>
  )
}
