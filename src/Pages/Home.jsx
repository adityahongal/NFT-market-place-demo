import React from "react";
import { Box } from "@chakra-ui/react";

import {
  Landing,
  FeaturedArtists,
} from "./../components/Home";

const Home = () => {
  return (
    <Box w={"full"} flex={1}>
      <Landing />
      <FeaturedArtists />
    </Box>
  );
};

export default Home;