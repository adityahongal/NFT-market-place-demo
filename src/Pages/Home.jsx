import React from "react";
import { Box } from "@chakra-ui/react";

import {
  Landing,
  FeaturedArtists,
  FeaturedProject,
  WhyWeIntoNFT,
} from "./../components/Home";

const Home = () => {
  return (
    <Box w={"full"} flex={1}>
      <Landing />
      <FeaturedArtists />
      <FeaturedProject />
      <WhyWeIntoNFT />
    </Box>
  );
};

export default Home;