import React from "react";
import { useSelector } from "react-redux";
import { Stack, Heading } from "@chakra-ui/react";

import { NotConnectedView, ConnectedView } from "../components/ConnectedDapps";
import { ComponentRequestController } from "../components/ConnectedDapps";

const ConnectedDapps = () => {
  const { connected, requests, connectedDApp } = useSelector(
    (state) => state.wallet
  );

  return (
    <Stack
      bg="background_gradient_1"
      py={{ base: "6", lg: "10" }}
      px={{ base: 4, md: 16 }}
      spacing={"6"}
      align={connected && connectedDApp ? "center" : "flex-start"}
      w={"full"}
      flex={1}
    >
      {connected && connectedDApp ? (
        <>
          <Stack
            bg={"white"}
            borderRadius={"xl"}
            w={{ base: "full", lg: "50%" }}
            spacing={{ base: "3", lg: "5" }}
            p={6}
          >
            <ConnectedView />
          </Stack>
          <Stack
            bg={"white"}
            borderRadius={"xl"}
            w={{ base: "full", lg: "50%" }}
            spacing={{ base: "3", lg: "5" }}
            p={6}
          >
            <Heading fontSize={"md"}>
              Pending Requests ( {requests.length} )
            </Heading>
            <ComponentRequestController />
          </Stack>
        </>
      ) : (
        <NotConnectedView />
      )}
    </Stack>
  );
};

export default ConnectedDapps;
