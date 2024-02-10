import React from "react";
import { Stack, Heading, Text, SimpleGrid, HStack } from "@chakra-ui/layout";
import { Image } from "@chakra-ui/image";
import { Button } from "@chakra-ui/button";
import { Skeleton } from "@chakra-ui/skeleton";
import { useSelector, useDispatch } from "react-redux";

import { setCreateWalletStep } from "./../../store/slices/layout";
// import infoIcon from "./../../assets/ic_alert.svg";

const SeedLoader = () => {
  return (
    <>
      {[...Array(12)].map((_, index) => (
        <HStack key={index} spacing={4}>
          <Text bg="button_gradient" bgClip="text">
            {index + 1}
          </Text>
          <Skeleton h={"8"} w={"full"} />
        </HStack>
      ))}
    </>
  );
};

const SaveRecoverySeed = () => {
  const dispatch = useDispatch();
  const { seedPhrase } = useSelector((state) => state.wallet);

  const downloadSeedPharse = () => {
    const element = document.createElement("a");
    const file = new Blob([seedPhrase], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "phrase.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    document.body.removeChild(element);
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
        Save your recovery phrase
      </Heading>
      <Text textAlign={"center"} width={{ base: "90%", lg: "40%" }} bg="button_gradient" bgClip="text" fontWeight={400}>
        These 12 words are your recovery phrase. Write them down somewhere safe and don't share them with anyone.
      </Text>
      <Stack
        bg={"white"}
        borderRadius={"lg"}
        p={{ base: 4, md: 6, lg: 8 }}
        spacing={10}
        w={{ base: "100%", lg: "45%" }}
      >
        <SimpleGrid columns={3} spacing={10} fontWeight={"bold"}>
          {seedPhrase ? (
            seedPhrase.split(" ").map((word, index) => (
              <HStack key={index} spacing={4}>
                <Text bg="button_gradient" bgClip="text">
                  {index + 1}
                </Text>
                <Text>{word}</Text>
              </HStack>
            ))
          ) : (
            <SeedLoader />
          )}
        </SimpleGrid>
        <HStack spacing={"4"}>
          <Image /*src={infoIcon}*/ h={"6"} w={"6"} />
          <Text bg="button_gradient" bgClip="text" fontSize={"sm"}>
            If your device is lost, damaged or stolen,{" "}
            <strong>these 12 words are the only way to restore access to your wallet.</strong> Store them safely and
            securely!
          </Text>
        </HStack>
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
            dispatch(setCreateWalletStep(2));
          }}
        >
          I’ve Copied It Somewhere Safe
        </Button>
        <Button
          variant={"outline"}
          borderColor={"brand_red.500"}
          _hover={{
            bg: "brand_pink.100",
          }}
          px={{ lg: "16" }}
          py={{ base: "6" }}
          onClick={downloadSeedPharse}
        >
          <Text bg="button_gradient" bgClip="text">
            Save 12 Word Phrases as a File
          </Text>
        </Button>
      </Stack>
    </Stack>
  );
};

export default SaveRecoverySeed;
