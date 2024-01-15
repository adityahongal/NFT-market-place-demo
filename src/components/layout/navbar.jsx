import React from "react";
import { Box } from "@chakra-ui/react";
import { Flex, useColorModeValue, Image } from "@chakra-ui/react";
import logo from '../../Assets/logo.svg';

const NavBar = () => {
  return (
    <Box>
      <Flex 
      bg={useColorModeValue("white", "gray.800")} 
      minH={"60px"}
      color={useColorModeValue("gray.600", "white")}
      borderBottom={1}
      borderStyle={"solid"}
      borderColor={useColorModeValue("gray.200", "gray.900")}
      >
        <Flex>
            <Image src={logo}/>
        </Flex>
      </Flex>
    </Box>
  );
};

export default NavBar;
