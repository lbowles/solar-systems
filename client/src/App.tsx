import React from "react"
import logo from "./logo.svg"
import "./App.css"
import "@rainbow-me/rainbowkit/styles.css"

import { WagmiConfig, createClient, configureChains, mainnet } from "wagmi"
import { publicProvider } from "wagmi/providers/public"
import { getDefaultWallets, lightTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { LandingPage } from "./pages/LandingPage"

const { chains, provider, webSocketProvider } = configureChains([mainnet], [publicProvider()])

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
