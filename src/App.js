import React, { useEffect } from "react";
import AppRoutes from "./Routes";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import theme from "./utils/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ScrollToTop } from "./components/Common";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useInitialization from "./hooks/useInitialization";
import { web3wallet } from "./utils/walletConnect.utils";
import useWalletConnectEventsManager from "./hooks/useWalletConnectEventsManager";
import { RELAYER_EVENTS } from '@walletconnect/core'


export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
    },
  },
});

function App() {

  const initialized = useInitialization()
  useWalletConnectEventsManager(initialized)
  useEffect(() => {
    if (!initialized) return
    web3wallet.core.relayer.on(RELAYER_EVENTS.connect, () => {
      console.log("Network Connection Restored")
    })

    web3wallet.core.relayer.on(RELAYER_EVENTS.disconnect, (error) => {
      console.log("Network Connection lost")
      
    })
  }, [initialized])
  // disable console logs in production
  if (process.env.NODE_ENV === "production") {
    console.log = () => {};
    console.error = () => {};
    console.debug = () => {};
  }


  useEffect(() => {}, []);

  return (
    <BrowserRouter>
    <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
            <ScrollToTop>
              <ToastContainer />
              <AppRoutes />
            </ScrollToTop>
        </ChakraProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
