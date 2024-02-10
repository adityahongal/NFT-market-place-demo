import React, { useState } from "react";
import { Stack, Heading, Text, Box } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { Input, InputRightElement, InputGroup } from "@chakra-ui/input";
import { useBoolean } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import isEmpty from "lodash/isEmpty";

import { setWallet } from "./../../store/slices/wallet";
import { setCreateWalletStep, setExistingWalletStep, connectWalletStateSelector } from "./../../store/slices/layout";

import { useCreateUser } from "./../../api/userService";

const CreatePassword = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { reEnteredSeedPhrase, seedPhrase } = useSelector((state) => state.wallet);
  const { currentContext } = useSelector(connectWalletStateSelector);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useBoolean(false);
  const { state } = location;
  const { mutate: createUser } = useCreateUser();

  const handleContinue = () => {
    setIsLoading.on();
    const seed = currentContext === "create" ? seedPhrase : reEnteredSeedPhrase;

    let redirectedFrom = "";

    if (!isEmpty(state)) {
      redirectedFrom = state?.redirectedFrom || "";
    }

    dispatch(
      setWallet({
        seedPhrase: seed,
        password: newPassword,
        createUser,
        onComplete: () => {
          setIsLoading.off();
          if (redirectedFrom) {
            navigate(redirectedFrom);
          } else {
            if (currentContext === "create") dispatch(setCreateWalletStep(4));
            else dispatch(setExistingWalletStep(3));
          }
        },
      })
    );
  };

  return (
    <Stack
      bg="background_gradient_1"
      py={{ base: "6", lg: "10" }}
      px={{ base: 4, md: 16 }}
      align={"center"}
      spacing={6}
    >
      <Heading as="h1" textAlign={"center"} color={"gray.800"}>
        Create password
      </Heading>
      <Text textAlign={"center"} width={{ base: "90%", lg: "35%" }} fontWeight={400}>
        Create a password. (Hint: Your password will unlock your wallet on this device only.)
      </Text>
      <Stack
        bg={"white"}
        borderRadius={"lg"}
        p={{ base: 4, md: 6, lg: 8 }}
        spacing={6}
        w={{ base: "100%", lg: "45%" }}
        userSelect={"none"}
      >
        <Heading fontSize={"3xl"} borderBottom={"1px solid"} borderColor={"gray.200"} pb={4}>
          Create password
        </Heading>
        <Stack>
          <Heading fontSize={"lg"}>New Password</Heading>
          <InputGroup>
            <Input
              type={showNewPassword ? "text" : "password"}
              size={"md"}
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
            />
            <InputRightElement
              children={
                <Box cursor={"pointer"} onClick={() => setShowNewPassword(!showNewPassword)}>
                  {showNewPassword ? <FiEyeOff /> : <FiEye />}
                </Box>
              }
            />
          </InputGroup>
        </Stack>
        <Stack>
          <Heading fontSize={"lg"}>Confirm Password</Heading>
          <InputGroup>
            <Input
              type={showConfirmPassword ? "text" : "password"}
              size={"md"}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
            <InputRightElement
              children={
                <Box cursor={"pointer"} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </Box>
              }
            />
          </InputGroup>
        </Stack>
        <Button
          variant={"solid"}
          bg={"button_gradient"}
          px={{ lg: "16" }}
          py={{ base: "6" }}
          color={"white"}
          _hover={{
            bg: "button_gradient_light",
          }}
          _active={{
            bg: "button_gradient_light",
          }}
          onClick={handleContinue}
          isLoading={isLoading}
          disabled={newPassword === "" || confirmPassword === "" || newPassword !== confirmPassword || isLoading}
        >
          Create Password
        </Button>
      </Stack>
    </Stack>
  );
};

export default CreatePassword;
