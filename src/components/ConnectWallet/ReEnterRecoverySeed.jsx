import React, { useState } from "react";
import { Stack, Heading, Text, SimpleGrid, HStack } from "@chakra-ui/layout";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/input";
import { Button } from "@chakra-ui/button";
import { useBoolean, Image } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";

import { setReEnteredSeedPhrase } from "./../../store/slices/wallet";
import { setCreateWalletStep, setExistingWalletStep, connectWalletStateSelector } from "./../../store/slices/layout";
// import errorIcon from "./../../assets/ic_error.svg";

const ReEnterRecoverySeed = () => {
  const dispatch = useDispatch();
  const { seedPhrase } = useSelector((state) => state.wallet);
  const { currentContext } = useSelector(connectWalletStateSelector);
  const [seed, setSeed] = useState({
    0: "",
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
    7: "",
    8: "",
    9: "",
    10: "",
    11: "",
  });
  const [isError, setIsError] = useBoolean(false);

  const handleFillAllBoxes = (value) => {
    const trimmedValue = value.trim();
    const valueArr = trimmedValue.split(" ");
    valueArr.forEach((item, index) => {
      setSeed((prev) => ({ ...prev, [index]: item }));
    });
  };

  const handlePhraseChange = (event) => {
    const { value, name } = event.target;
    if (name === "0" && value.split(" ").length > 1) {
      handleFillAllBoxes(value);
    } else {
      setSeed({ ...seed, [event.target.name]: event.target.value });
    }
  };

  const enableAlert = () => {
    setIsError.on();
    setTimeout(() => {
      setIsError.off();
    }, 3000);
  };

  const matchSeed = () => {
    let isSeedMatching = true;
    const seedArr = seedPhrase.split(" ");
    for (let i = 0; i < seedArr.length; i++) {
      if (seedArr[i] !== seed[i]) {
        isSeedMatching = false;
        break;
      }
    }
    if (isSeedMatching) {
      dispatch(setCreateWalletStep(3));
    } else {
      enableAlert();
    }
  };

  const validateSeed = () => {
    const combinedSeed = Object.values(seed);
    if (combinedSeed.length === 12 && !combinedSeed.includes("")) {
      const phrase = combinedSeed.join(" ");
      dispatch(setReEnteredSeedPhrase({ phrase }));
      dispatch(setExistingWalletStep(2));
    } else {
      enableAlert();
    }
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
        Confirm your recovery phrase
      </Heading>
      <Text textAlign={"center"} width={{ base: "90%", lg: "40%" }} bg="button_gradient" bgClip="text" fontWeight={400}>
        Please enter your 12 recovery phrase.
      </Text>
      <Stack
        bg={"white"}
        borderRadius={"lg"}
        p={{ base: 4, md: 6, lg: 8 }}
        w={{ base: "100%", lg: "45%" }}
        spacing={10}
      >
        <SimpleGrid columns={3} spacing={{ base: 2, lg: 6 }} fontWeight={"bold"}>
          {[...Array(12)].map((_, index) => (
            <InputGroup key={index}>
              <InputLeftElement
                pointerEvents="none"
                children={
                  <Text bg="button_gradient" bgClip="text">
                    {index + 1}
                  </Text>
                }
              />
              <Input
                name={`${index}`}
                value={seed[index]}
                type="text"
                borderStyle={"dashed"}
                borderColor={"brand_red.500"}
                fontWeight={"700"}
                _hover={{}}
                _focusVisible={{ borderColor: "brand_red.900" }}
                onChange={handlePhraseChange}
                autoComplete="off"
              />
            </InputGroup>
          ))}
        </SimpleGrid>
        {isError && (
          <HStack>
            <Image /*src={errorIcon}*/ h={"6"} w={"6"} />
            <Text bg="button_gradient" bgClip="text" fontSize={"sm"}>
              That didn't match your recovery phrase. Please try again.
            </Text>
          </HStack>
        )}
      </Stack>
      <Stack spacing={6} w={{ base: "100%", lg: "45%" }}>
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
          onClick={() => {
            if (currentContext === "create") {
              matchSeed();
            } else {
              validateSeed();
            }
          }}
        >
          Continue
        </Button>
      </Stack>
    </Stack>
  );
};

export default ReEnterRecoverySeed;
