import React from "react";
import { Stack, Heading, Text } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { useBoolean } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";

import { createWallet } from "./../../store/slices/wallet";
import {
    setCurrentContext,
    setCreateWalletStep,
    setExistingWalletStep,
    setLoginStep,
  } from "./../../store/slices/layout";

const LandingScreen = () => {
    const dispatch = useDispatch();
    const { walletExists } = useSelector((state) => state.wallet);
    const [isCreateWalletLoading, setIsCreateWalletLoading] = useBoolean(false);

    const handleCreateWallet = () => {
        setIsCreateWalletLoading.on();
        dispatch(setCurrentContext({ context: "create", type: "walletCreate" }));
        dispatch(
          createWallet(() => {
            setIsCreateWalletLoading.off();
            dispatch(setCreateWalletStep(1));
          })
        );
      };
    
      const handleLogin = () => {
        dispatch(setCurrentContext({ context: "login", type: "walletCreate" }));
        dispatch(setLoginStep(1));
      };

    return(
        <Stack py={{ base: "6", lg: "10" }} px={{ base: 4, md: 16 }} align={"center"} spacing={4}>
      <Heading as="h1" color={"gray.800"}>
        My Wallet
      </Heading>
      <Text textAlign={"center"}>
        {walletExists
          ? `Connect your wallet using your password or you can create a new wallet.`
          : `Connect your exisiting wallet or create a new one.`}
      </Text>
      <Stack
        direction={walletExists ? { base: "column" } : { base: "column", lg: "row" }}
        spacing={{ base: 4, lg: 8 }}
        pt={6}
        w={{ base: "100%", md: "60%", lg: "auto" }}
      >
        <Button
          variant={"solid"}
          fontSize={"md"}
          color={"white"}
          bg={"button_gradient"}
          _hover={{
            bg: "button_gradient_light",
          }}
          _active={{
            bg: "button_gradient_light",
          }}
          px={{ lg: "16" }}
          py={{ base: "6" }}
          w={"100%"}
          isLoading={isCreateWalletLoading}
          onClick={() => {
            walletExists ? handleLogin() : handleCreateWallet();
          }}
        >
          {walletExists ? `Continue With Password` : `Create wallet`}
        </Button>

        {walletExists ? (
          <Button
            variant={"link"}
            w={"100%"}
            fontWeight={500}
            onClick={() => {
              dispatch(setCurrentContext({ context: "existing", type: "walletCreate" }));
              dispatch(setExistingWalletStep(1));
            }}
          >
            <Text bg="button_gradient" bgClip="text">
              Forgot Password
            </Text>
          </Button>
        ) : (
          <Button
            variant={"outline"}
            borderColor={"brand_red.500"}
            _hover={{
              bg: "brand_pink.100",
            }}
            px={{ lg: "16" }}
            py={{ base: "6" }}
            w={"100%"}
            onClick={() => {
              dispatch(setCurrentContext({ context: "existing", type: "walletCreate" }));
              dispatch(setExistingWalletStep(1));
            }}
          >
            <Text bg="button_gradient" bgClip="text">
              Use existing
            </Text>
          </Button>
        )}
      </Stack>
    </Stack>
    );
};

export default LandingScreen;