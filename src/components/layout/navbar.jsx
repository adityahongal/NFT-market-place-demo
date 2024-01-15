import React from "react";
import { Box } from "@chakra-ui/react";
import { Flex, useColorModeValue, Image, Button } from "@chakra-ui/react";
import logo from "../../Assets/logo.svg";
import { NavLink, useLocation } from "react-router-dom";
import { navitems } from "../../constants/navitems";
import { Stack, Text } from "@chakra-ui/react";

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
          <Flex align={"center"}>
            <NavLink to={"/"}>
              <Image src={logo} />
            </NavLink>
          </Flex>

          <Flex display={{ base: "none", lg: "flex" }} ml={16}>
            <DesktopNav />
          </Flex>

          <Flex
            flex={{ base: 1 }}
            justify={{ base: "flex-end" }}
            direction={"row"}
          >
            <Button
              fontSize={"md"}
              color={"white"}
              px={8}
              bg={"button_gradient"}
              _hover={{
                bg: "button_gradient_light",
              }}
              _active={{
                bg: "button_gradient_light",
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
  const location = useLocation();
  console.log(location);
  return (
    <Stack direction={"row"} spacing={10}>
      {navitems.map(({ item, link }) => (
        <NavLink to={link}>
          <Text
            p={2}
            fontSize={"md"}
            fontWeight={400}
            color={location.pathname === link ? "brand_pink.900" : "gray.800"}
            _hover={
              location.pathname !== link && {
                color: "gray.600",
                textDecoration: "none",
              }
            }
          >
            {item}
          </Text>
        </NavLink>
      ))}
    </Stack>
  );
};

export default NavBar;
