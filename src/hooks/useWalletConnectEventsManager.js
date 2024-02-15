import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  web3wallet,
  getApprovedNamespaces,
} from "../utils/walletConnect.utils";
import { setRequests } from "../store/slices/wallet";
import { getSdkError } from "@walletconnect/utils";
import { setConnectedDApp } from "../store/slices/wallet";

export default function useWalletConnectEventsManager(initialized) {
  const dispatch = useDispatch();
  const { wallet = {} } = useSelector((state) => state.wallet);
  const { address = "" } = wallet;

  try {
    const onSessionRequest = (request) => {
      dispatch(setRequests({ requests: request }));
    };

    const onSessionProposal = async (request) => {
      if (address) {
        const { params, id } = request;
        const approvedNamespaces = getApprovedNamespaces(params, address);

        try {
          const session = await web3wallet.approveSession({
            id,
            namespaces: approvedNamespaces,
          });

          localStorage.setItem("WalletConnectConnectedAppId", session?.topic);

          dispatch(setConnectedDApp(true, session));
        } catch (error) {
          console.error(error);
          await web3wallet.rejectSession({
            id: request.id,
            reason: getSdkError("USER_REJECTED"),
          });
        }
      }
    };

    const loadExistingSession = async () => {
      try {
        const topic = window.localStorage.getItem(
          "WalletConnectConnectedAppId"
        );
        const sessions = web3wallet.getActiveSessions();
        const connectedDAppMetadata = sessions[topic];

        dispatch(setConnectedDApp(true, connectedDAppMetadata));

        web3wallet.on("session_proposal", (payload) => {
          onSessionProposal(payload);
        });
        web3wallet.on("session_request", onSessionRequest);
        // auth
        web3wallet.on("auth_request", onSessionRequest);
        // TODOs
        web3wallet.engine.signClient.events.on("session_ping", (data) =>
          console.log("ping", data)
        );
        web3wallet.on("session_delete", (data) => deleteSession(data));
      } catch (error) {
        console.error(error);
      }
    };

    const deleteSession = async (data) => {
      try {
        window.localStorage.removeItem("WalletConnectConnectedAppId");
        console.log("session loggedout");
        dispatch(setConnectedDApp(false, {}));
        await web3wallet.disconnectSession({
          topic: data?.topic,
          reason: getSdkError("USER_DISCONNECTED"),
        });
      } catch (error) {
        console.error(error);
      }
    };

    const subscribeSession = () => {
      try {
        const topic = window.localStorage.getItem(
          "WalletConnectConnectedAppId"
        );

        if (!topic) {
          //sign
          web3wallet.on("session_proposal", (payload) => {
            onSessionProposal(payload);
          });
          web3wallet.on("session_request", onSessionRequest);
          // auth
          web3wallet.on("auth_request", onSessionRequest);
          // TODOs
          web3wallet.engine.signClient.events.on("session_ping", (data) =>
            console.log("ping", data)
          );
          web3wallet.on("session_delete", (data) => deleteSession(data));
        }
      } catch (error) {
        console.error(error);
      }
    };

    useEffect(() => {
      if (initialized) {
        loadExistingSession();
        subscribeSession();
      }
    }, [initialized]);
  } catch (error) {
    console.error(error);
  }
}
