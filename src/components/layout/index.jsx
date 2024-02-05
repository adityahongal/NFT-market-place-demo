import React from "react";
import NavBar from "./navbar";
import Footer from "./footer";
import PropTypes from "prop-types";
import { VStack, Box } from "@chakra-ui/react";

const Layout = ({ children }) => {
  return (
    <VStack spacing={0} align={"start"} minH={"100vh"}>
      <Box width={"full"}>
        <NavBar />
      </Box>
      <VStack spacing={0} align={"start"} w={"full"} flex={1}>
        {children}
      </VStack>
      <Box width={"full"}>
        <Footer />
      </Box>
    </VStack>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
