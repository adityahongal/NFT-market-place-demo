import { useRef, useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { web3wallet, createWeb3Wallet } from "../utils/walletConnect.utils";

export default function useInitialization() {
    const [initialized, setInitialized] = useState(false)
    const prevRelayerURLValue = useRef('')
    const { relayerRegionURL, uri } = useSelector((state) => state.wallet);

    const onInitialize = useCallback(async () => {
        try {
            await createWeb3Wallet(relayerRegionURL)
            setInitialized(true)
        } catch (error) {
            toast.warn("Error: WalletConnect Init", {
                newestOnTop: true,
                pauseOnHover: true,
                autoClose: 2000,
            });
            console.error(error);
        }
    }, [relayerRegionURL]); 

    // restart transport if relayer region changes
    const onRelayerRegionChange = useCallback(() => {
        try {
        web3wallet.core.relayer.restartTransport(relayerRegionURL)
        prevRelayerURLValue.current = relayerRegionURL
        } catch (error) {
            toast.warn("Error: WalletConnect Relay Init", {
                newestOnTop: true,
                pauseOnHover: true,
                autoClose: 2000,
            });
            console.error(error);
        }
    }, [relayerRegionURL])

    useEffect(() => {
        if (!initialized) {
            onInitialize()
        }
        if (prevRelayerURLValue.current !== relayerRegionURL) {
            onRelayerRegionChange()
        }
    }, [initialized, onInitialize, relayerRegionURL, onRelayerRegionChange])

    return initialized;

};