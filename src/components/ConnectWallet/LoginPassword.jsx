import React, { useState } from "react";
import { Stack, Heading, Text, Box } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { Input, InputRightElement, InputGroup } from "@chakra-ui/input";
import { useBoolean, Image } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import isEmpty from "lodash/isEmpty";

import { login } from "./../../store/slices/wallet";
import { setLoginStep } from "./../../store/slices/layout";
import { useGetCurrentUserDetails } from "./../../api/userService";

// import errorIcon from "./../../assets/ic_error.svg";

const LoginPasword = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useBoolean(false);
  const [isError, setIsError] = useBoolean(false);
  const { state } = location;
  const { mutate } = useGetCurrentUserDetails();

  const enableAlert = () => {
    setIsError.on();
    setTimeout(() => {
      setIsError.off();
    }, 3000);
  };

  const handleContinue = () => {
    setIsLoading.on();
    let redirectedFrom = "";

    if (!isEmpty(state)) {
      redirectedFrom = state?.redirectedFrom || "";
    }

    dispatch(
      login({
        password,
        mutate,
        onSuccess: () => {
          setIsLoading.off();
          setPassword("");
          if (redirectedFrom) navigate(redirectedFrom);
          else dispatch(setLoginStep(2));
        },
        onError: () => {
          setIsLoading.off();
          enableAlert();
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
      <Heading as="h1" textAlign={"center"}>
        Enter Password
      </Heading>
      <Text textAlign={"center"} width={{ base: "90%", lg: "35%" }} fontWeight={400}>
        Enter your password to access your wallet.
      </Text>
      <Stack
        bg={"white"}
        borderRadius={"lg"}
        p={{ base: 4, md: 6, lg: 8 }}
        spacing={6}
        w={{ base: "100%", lg: "40%" }}
        userSelect={"none"}
      >
        <Stack>
          <Heading fontSize={"lg"}>Password</Heading>
          <InputGroup>
            <Input
              type={showPassword ? "text" : "password"}
              size={"md"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <InputRightElement
              children={
                <Box cursor={"pointer"} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </Box>
              }
            />
          </InputGroup>
        </Stack>
        {isError && (
          <Stack direction={"row"}>
            <Image /*src={errorIcon}*/ h={"6"} w={"6"} />
            <Text bg="button_gradient" bgClip="text" fontSize={"sm"}>
              That didn't match your password. Please try again.
            </Text>
          </Stack>
        )}
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
          loadingText={"Fetching wallet"}
          disabled={password === "" || isLoading}
        >
          Connect My Wallet
        </Button>
      </Stack>
    </Stack>
  );
};

export default LoginPasword;
