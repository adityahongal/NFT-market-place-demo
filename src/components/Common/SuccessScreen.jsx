import React, { useEffect } from "react";
import PropType from "prop-types";
import { Stack, Heading, Box, Flex } from "@chakra-ui/layout";
import { Image } from "@chakra-ui/image";
import { Button } from "@chakra-ui/button";

import logo from "./../../Assets/logo.svg";

const SuccessScreen = ({ headingText, ctaText, ctaOnClick, onMount }) => {
  useEffect(() => {
    onMount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack
      py={{ base: "10" }}
      px={{ base: 4, md: 16 }}
      align={"center"}
      spacing={4}
      bg="background_gradient_1"
      w={"full"}
      flex={1}
    >
      <Box h={{ base: "12", lg: "14" }} w={{ base: "12", lg: "14" }}>
        <Image src={logo} h={"full"} w={"full"} />
      </Box>
      <Heading as="h1" color={"gray.800"} textAlign={"center"}>
        {headingText}
      </Heading>
      <Box pt={"8"} h={"80"}>
        <Image src={logo} h={"full"} w={"full"} />
      </Box>
      {ctaText !== "" && (
        <Flex w={{ base: "full", lg: "40%" }}>
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
            onClick={ctaOnClick}
          >
            {ctaText}
          </Button>
        </Flex>
      )}
    </Stack>
  );
};

SuccessScreen.defaultProps = {
  headingText: "",
  ctaText: "",
  ctaOnClick: () => {},
  onMount: () => {},
};

SuccessScreen.propTypes = {
  headingText: PropType.string,
  ctaText: PropType.string,
  ctaOnClick: PropType.func,
  onMount: PropType.func,
};

export default SuccessScreen;
