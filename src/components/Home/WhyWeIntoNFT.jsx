import React from "react";
// import { useSelector } from "react-redux";
import { Image } from "@chakra-ui/image";
import { Heading, Text, Stack } from "@chakra-ui/layout";

import WhyWeIntoNFTImage from "../../Assets/WhyWeIntoNFTImage.png"

const WhyWeIntoNFT = () => {

    return (
        <Stack
        align={"center"}
        pt={{ base: "16", lg: "16" }}
        pb={{ base: "24", lg: "16" }}
        spacing={{ base: "16", lg: "6" }}
      >
        <Stack align={"center"} px={{ base: 4, md: 16 }} spacing={{ base: "8" }}>
          <Heading size={"2xl"} textAlign={"center"} color={"gray.900"} fontSize={{ base: "2xl", lg: "4xl" }}>
            Why are we into NFT?
          </Heading>
          <Text fontWeight={500} textAlign={"center"} w={{ base: "full", md: "80%", lg: "60%" }}>
          We're into NFTs for various reasons, but it often comes down to owning unique digital assets and supporting creators in new ways.
          </Text>
        </Stack>
        <Image src={WhyWeIntoNFTImage} w={{ base: "full", lg: "lg" }} transform={{ base: "scale(1.5)", md: "none" }} />
      </Stack>  
    );
};

export default WhyWeIntoNFT;