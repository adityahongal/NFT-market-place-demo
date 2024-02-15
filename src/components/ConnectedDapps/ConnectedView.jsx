import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Stack, HStack, Avatar, Heading, Text, Button, Box } from "@chakra-ui/react";

import { disconnectFromDapp } from "../../store/slices/wallet";

const ConnectedView = () => {
  const dispatch = useDispatch();
  const { connectedDApp } = useSelector((state) => state.wallet);
  const { namespaces = {}, peer = [] } = connectedDApp || {};
  const { eip155 = {} } = namespaces;
  const { accounts = [] } = eip155;
  const { metadata = {} } = peer || {};
  const { icons = "", name = "" } = metadata || {};
  const walletAddress = accounts.length > 0 ? accounts[0].split(":")[2] : "";

  const handleDisconnect = () => {
    dispatch(disconnectFromDapp());
  };

  return (
    <HStack justify={"space-between"}>
      <HStack>
        {icons.length > 0 && <Avatar src={icons[0]} alt={name} objectFit="cover" />}
        <Stack>
          <Heading fontSize={"md"}>{name}</Heading>
          {walletAddress && (
            <Text fontSize={"sm"}>{`${walletAddress.slice(0, 8)}......${walletAddress.slice(-8)}`}</Text>
          )}
        </Stack>
      </HStack>
      <Stack>
        <Box flex={1} ml={"auto"}>
          <Button
            bg={"button_gradient"}
            color={"white"}
            size={"md"}
            _hover={{
              bg: "button_gradient_light",
            }}
            _active={{
              bg: "button_gradient_light",
            }}
            flex={1}
            onClick={() => handleDisconnect()}
          >
            Disconnect
          </Button>
        </Box>
      </Stack>
    </HStack>
  );
};

export default ConnectedView;
