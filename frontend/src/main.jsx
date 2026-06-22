import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, lightTheme } from "@rainbow-me/rainbowkit";
import { Toaster } from "react-hot-toast";
import "@rainbow-me/rainbowkit/styles.css";
import "./index.css";

import App from "./App.jsx";
import { config } from "./lib/wagmi.js";
import { setupRipple } from "./lib/ripple.js";

setupRipple();

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={lightTheme({
            accentColor: "#16a34a",
            accentColorForeground: "white",
            borderRadius: "none",
            fontStack: "system",
          })}
        >
          <BrowserRouter>
            <App />
          </BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                borderRadius: "0px",
                background: "#0c1a2b",
                color: "#fff",
                fontSize: "14px",
              },
              success: { iconTheme: { primary: "#16a34a", secondary: "#fff" } },
            }}
          />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);