import React, { useState } from "react";
import { Stack, StackDivider, Heading, Text } from "@chakra-ui/layout";
import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Image } from "@chakra-ui/image";
import { Button } from "@chakra-ui/button";
import { OrderedList, ListItem, useBoolean } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";

import { SessionRequest } from "./ComponentController/RequestComponents";
import { initWalletConnect } from "../../store/slices/wallet";
import walletConnectIcon from "../../Assets/wallet-connect.png";

const NotConnectedView = () => {
  const dispatch = useDispatch();
  const [isConnecting, setIsConnecting] = useBoolean(false);
  const [dappUri, setDappUri] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { requests } = useSelector((state) => state.wallet);

  const handleConnect = () => {
    setIsConnecting.on();
    try {
      dispatch(initWalletConnect(dappUri));
      setIsConnecting.off();
    } catch (e) {
      setErrorMessage("Invalid URI");
      setIsConnecting.off();
    }
  };

  return (
    <>
      <Stack bg={"white"} borderRadius={"xl"} w={"full"} spacing={"10"} p={{ base: 6, lg: 8 }}>
        <Heading textAlign={"center"} fontSize={{ base: "xl", lg: "4xl" }}>
          Connect via WalletConnect
        </Heading>
        <Stack direction={{ base: "column", md: "row" }} spacing={"10"} divider={<StackDivider />}>
          {requests.length > 0 && requests[0]?.method === "session_request" ? (
            <SessionRequest obj={requests[0]} />
          ) : (
            <Stack w={{ base: "full", lg: "50%" }} align={"center"} spacing={"10"}>
              <Stack align={"center"}>
                <Image
                  src={walletConnectIcon}
                  alt="WalletConnect"
                  h={{ base: "10", lg: "20" }}
                  w={{ base: "10", lg: "20" }}
                />
                <Text fontWeight={600} fontSize={"lg"} textAlign={"center"}>
                  WalletConnect
                </Text>
                <Text
                  w={{ base: "full", lg: "60%" }}
                  textAlign={"center"}
                  fontSize={{ base: "sm", lg: "md" }}
                  color={"GrayText"}
                >
                  Connect your wallet to DApp via WalletConnect and trigger transactions.
                </Text>
              </Stack>
              <Stack w={{ base: "full", md: "80%" }} spacing={"4"}>
                <FormControl>
                  <Input
                    placeholder="Paste wallet connect URI"
                    bg={"gray.100"}
                    value={dappUri}
                    onChange={(e) => setDappUri(e.target.value)}
                  />
                  {errorMessage && <Text color="red.500">{errorMessage}</Text>}
                </FormControl>
                <Button
                  w={"full"}
                  color={"white"}
                  bg={"button_gradient"}
                  fontSize={"md"}
                  _hover={{
                    bg: "button_gradient_light",
                  }}
                  _active={{
                    bg: "button_gradient_light",
                  }}
                  isLoading={isConnecting}
                  loadingText={"connecting..."}
                  disabled={isConnecting}
                  onClick={handleConnect}
                >
                  Connect
                </Button>
              </Stack>
            </Stack>
          )}
          <Stack spacing={"4"}>
            <Text fontSize={"lg"} fontWeight={600} color={"gray.600"}>
              How to connect to a DApp?
            </Text>
            <OrderedList color={"gray.700"} spacing={"6"} pl={{ base: "4", lg: "0" }}>
              <ListItem>Open a DApp with Wallet Connect support.</ListItem>
              <ListItem>Copy the URI.</ListItem>
              <ListItem>Paste the URI in the given input field.</ListItem>
              <ListItem>Accept the connection request.</ListItem>
              <ListItem>WalletConnect connection is established automatically.</ListItem>
              <ListItem>Now you can trigger transactions via the DApp to your wallet.</ListItem>
            </OrderedList>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};

export default NotConnectedView;
