import csv from "csv-parser"
import fs from "fs"
import { ethers } from "ethers"
import { SolarSystems, SolarSystems__factory } from "../types"

// Download transactions csv from etherscan
const filename = "./analytics/transactions.csv"

const txs: any[] = []

fs.createReadStream(filename)
  .pipe(csv())
  .on("data", (row: any) => {
    if (row.Method === "Mint" && parseFloat(row["Value_IN(ETH)"]) > 0.01 && !row.Status) {
      console.log(row)
      txs.push(row)
    }
  })
  .on("end", async () => {
    console.log("csv file successfully processed")
    console.log(`Found ${txs.length} transactions`)
    const provider = new ethers.providers.InfuraProvider("homestead", process.env.INFURA_PROJECT_ID)
    const iface = SolarSystems__factory.createInterface()
    const mintPrice = 0.01

    await Promise.all(
      txs.map(async (tx) => {
        const receipt = await provider.getTransactionReceipt(tx.Txhash)

        // console.log(receipt)

        const eventsCount = receipt.logs.reduce((acc, log) => {
          try {
            const parsed = iface.parseLog(log)
            if (parsed.name === "Transfer") {
              return acc + 1
            }
          } catch (e) {
            // console.log(e)
          }
          return acc
        }, 0)

        if (eventsCount !== Math.floor(parseFloat(tx["Value_IN(ETH)"]) / mintPrice)) {
          console.log("Refund", tx.Txhash)
        }
      }),
    )
  })
