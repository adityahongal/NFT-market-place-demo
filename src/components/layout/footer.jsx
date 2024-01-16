import React from "react";
import { Box, SimpleGrid, useColorModeValue, Image, Text, Link } from "@chakra-ui/react";
import { Stack } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { footerNavitems } from "../../constants/footerNavItems";
import logo from "../../Assets/logo.svg"

const ListHeader = ({ children }) => {
  return (
    <Text fontWeight={"700"} fontSize={"sm"} mb={2}>
      {children}
    </Text>
  );
};

const Footer = () => {
  return (
    <Box
      bg={useColorModeValue("brand_pink.100", "gray.900")}
      color={useColorModeValue("gray.700", "gray.200")}
      pt={{ base: 10, md: 16 }}
      pb={{ base: 10, md: 8 }}
      px={{ base: 4, md: 16 }}
    >
      <Stack color={"black"} flexWrap={"wrap"}>
        <Image src={logo} w={"36"} mb={8}/>
          <Stack direction={{ base: "row" }} justify={{ base: "center", lg: "space-between" }} flexWrap={"wrap"}>
            <Box display={{ base: "none", lg: "initial" }}>
              <DesktopFooterItems/>
            </Box>
          </Stack>
      </Stack>
    </Box>
  );
};


const DesktopFooterItems = () => {
      return(
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
          {footerNavitems.map(({ headerText = "", children = []}) => (
            <Stack align={"flex-start"} key={headerText}>
              <ListHeader>{headerText}</ListHeader>
                {children.map(({ item = "", link = "#"}) => (
                    <NavLink 
                    key={item}
                    to={link}
                    _hover={{ color: "red.600", textDecor: "underline" }}
                    fontSize={"sm"}
                    >
                    {item}
                    </NavLink>
                ))}
            </Stack>
          ))
          
          }
        </SimpleGrid>
      );
};

export default Footer;
