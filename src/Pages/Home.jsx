import React from "react";
import { Box } from "@chakra-ui/react";

import {
  Landing,
  FeaturedArtists,
  FeaturedProject,
} from "./../components/Home";

const Home = () => {
  return (
    <Box w={"full"} flex={1}>
      <Landing />
      <FeaturedArtists />
      <FeaturedProject />
    </Box>
  );
};

export default Home;