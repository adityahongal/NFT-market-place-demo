import React from "react";
import { Box } from "@chakra-ui/react";

import {
  Landing,
} from "./../components/Home";

const Home = () => {
  return (
    <Box w={"full"} flex={1}>
      <Landing />
    </Box>
  );
};

export default Home;