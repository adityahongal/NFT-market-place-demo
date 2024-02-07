import React from "react";
import { Box, Stack, Heading, chakra, Button, useBreakpointValue } from "@chakra-ui/react";

import projectImageDesktop from "./../../Assets/featured-project-1.png";
import projectImageMobile from "./../../Assets/featured-project-1.png";

const FeaturedProject = () => {
  const featBackgroundImage = useBreakpointValue({
    base: `url(${projectImageMobile}), #000000`,
    md: `url(${projectImageDesktop}), transparent`,
  });

  return (
    <Box minH={{ base: "70vh", md: "100vh" }} background={featBackgroundImage} backgroundSize={"100% 100%"}>
      <Stack
        px={{ base: "4", md: "10", lg: "20" }}
        pt={{ base: "10", lg: "20" }}
        pb={{ base: "6", lg: "20" }}
        w={{ base: "100%", md: "fit-content" }}
        h={{ base: "70vh", md: "fit-content" }}
        spacing={{ base: 4, lg: 8 }}
        align={{ base: "center", md: "start" }}
      >
        <Heading color={"black"} fontSize={"2xl"}>
          Featured Projects
        </Heading>
        <Heading
          color={"black"}
          fontSize={{ base: "4xl", md: "5xl", lg: "7xl" }}
          textAlign={{ base: "center", md: "left" }}
        >
          Popcorn Monkey
          <br />
          This is{" "}
          <chakra.span bg="button_gradient" bgClip="text">
            NFT
          </chakra.span>{" "}
          Sample.
        </Heading>
        <Box w={{ base: "100%", md: "100%" }} mt={{ base: "auto !important", md: "" }} pt={{ lg: "10" }}>
          <Button
            variant={"outline"}
            color={"black"}
            w={{ base: "100%", md: "70%" }}
            size={"lg"}
            _hover={{ color: "black", bg: "white" }}
          >
            Learn More
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default FeaturedProject;
