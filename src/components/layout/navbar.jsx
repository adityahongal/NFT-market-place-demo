import React from "react";
import { Box } from "@chakra-ui/react";
import { Flex, useColorModeValue, Image, Button } from "@chakra-ui/react";
import logo from "../../Assets/logo.svg";
import { NavLink } from "react-router-dom";
import {navitems} from "../../constants/navitems";
import { Stack, Text } from '@chakra-ui/react';

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
        align={"center"}
        py={{ base: 6 }}
        px={{ base: 4 }}
      >
        <Flex flex={{ base: 1 }} justify={{ base: "start" }}>
          <NavLink to={"/"}>
            <Image src={logo} />
          </NavLink>

          <Flex flex={{ base:1}} justify={{ base: "flex-end"}} direction={"row"}>
            <Button
            fontSize={"md"}
            color={"white"}
            px={8}
            bg={"button_gradient"}
            _hover={{
                bg: "button_gradient_light"
            }}
            _active={{
                bg: "button_gradient_light"
            }}
            >
                Connect Wallet
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};


const DesktopNav = () => {
    return(
        <Stack direction={"row"} >
            {navitems.map(({item, link}) => (
                <NavLink to={link}>
                    <Text>
                        {item}
                    </Text>
                </NavLink>
            ))}
        </Stack>
    )
};

export default NavBar;
