import "./App.css"
import "@rainbow-me/rainbowkit/styles.css"

import { WagmiConfig, createClient, configureChains, mainnet } from "wagmi"
import { publicProvider } from "wagmi/providers/public"
import { getDefaultWallets, lightTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { LandingPage } from "./pages/LandingPage"
import { hardhat } from "@wagmi/chains"

// Check if in development
const isDev = process.env.NODE_ENV === "development"

const { chains, provider, webSocketProvider } = configureChains([isDev ? hardhat : mainnet], [publicProvider()])

const { connectors } = getDefaultWallets({
  appName: "Solar Systems",
  chains,
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
})

function App() {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        theme={{
          ...lightTheme(),
          fonts: {
            body: "Space Mono, monospace",
          },
        }}
      >
        <LandingPage />
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default App
