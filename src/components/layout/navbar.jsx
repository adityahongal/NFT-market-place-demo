import React, { useEffect }  from "react";
import { Box } from "@chakra-ui/react";
import { Flex, useColorModeValue, Image, Button } from "@chakra-ui/react";
import { Collapse, useDisclosure } from "@chakra-ui/react";
import { IconButton } from "@chakra-ui/button";
import logo from "../../Assets/logo.svg";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/menu";
import { navitems } from "../../constants/navitems";
import { Stack, Text } from "@chakra-ui/react";
import { FiMenu, FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

import { checkWalletExistsLocally } from "./../../store/slices/wallet";
import userIcon from "./../../Assets/ic_user.svg";
import { loggedInItemsDetails } from "../../constants/loggedInItems";

export default function WithSubnavigation() {
  const { isOpen, onToggle } = useDisclosure();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { loggedIn } = useSelector((state) => state.wallet);

  useEffect(() => {
    dispatch(checkWalletExistsLocally());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box>
      <Flex
        bg={useColorModeValue("white", "gray.800")}
        color={useColorModeValue("gray.600", "white")}
        minH={"60px"}
        py={{ base: 6 }}
        px={{ base: 4, md: 16 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
        align={"center"}
      >
        <Flex flex={{ base: 1 }} justify={{ base: "start" }}>
          <Flex align={"center"}>
            <NavLink to={"/"}>
              <Image src={logo} />
            </NavLink>
          </Flex>

          <Flex display={{ base: "none", lg: "flex" }} ml={"16"}>
            <DesktopNav />
          </Flex>
        </Flex>

        <Stack flex={{ base: 1, md: 0 }} justify={"flex-end"} direction={"row"} spacing={6}>
          <Flex display={{ base: "flex", lg: "none" }}>
            <IconButton
              onClick={onToggle}
              color={"brand_pink.900"}
              icon={isOpen ? <FiX size="32px" /> : <FiMenu size="32px" />}
              variant={"ghost"}
              aria-label={"Toggle Navigation"}
            />
          </Flex>
          <Box display={{ base: "none", lg: "inline-flex" }}>
            {loggedIn ? (
              <Menu>
                <MenuButton
                  border={"none"}
                  borderRadius={"full"}
                  as={IconButton}
                  aria-label="Options"
                  icon={
                    <Box h="8" w="8" cursor={"pointer"}>
                      <Image src={userIcon} h="full" w="full" />
                    </Box>
                  }
                  variant="outline"
                />
                <MenuList zIndex={"99999"}>
                  {loggedInItemsDetails.map(({ item = "", link = "/", icon = "" }) => (
                    <MenuItem
                      key={item}
                      icon={icon && <Image src={icon} h="full" w="full" />}
                      onClick={() => {
                        if (location?.pathname !== link) {
                          navigate(link);
                        }
                      }}
                    >
                      {item}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            ) : (
              <NavLink to={"/connect-wallet"}>
                <Button
                  fontSize={"md"}
                  color={"white"}
                  bg={"button_gradient"}
                  px={8}
                  _hover={{
                    bg: "button_gradient_light",
                  }}
                  _active={{
                    bg: "button_gradient_light",
                  }}
                >
                  Connect Wallet
                </Button>
              </NavLink>
            )}
          </Box>
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav onToggle={onToggle} />
      </Collapse>
    </Box>
  );
}

const DesktopNav = () => {
  const location = useLocation();

  return (
    <Stack direction={"row"} spacing={4}>
      {navitems.map(({ item = "", link = "" }) => (
        <Box key={item}>
          <NavLink to={`${location?.pathname === link ? "" : link}`}>
            <Text
              p={2}
              fontSize={"md"}
              fontWeight={400}
              color={location?.pathname === link ? "brand_pink.900" : "gray.800"}
              _hover={
                location?.pathname !== link && {
                  textDecoration: "none",
                  color: "gray.600",
                }
              }
            >
              {item}
            </Text>
          </NavLink>
        </Box>
      ))}
    </Stack>
  );
};

const MobileNav = ({ onToggle }) => {
  const { loggedIn } = useSelector((state) => state.wallet);

  return (
    <Stack bg={useColorModeValue("white", "gray.800")} p={4} display={{ lg: "none" }} spacing={0}>
      {navitems.map(({ item = "", link = "" }) => (
        <MobileNavItem key={item} onClick={onToggle} item={item} link={link} />
      ))}
      <Box onClick={onToggle}>
        {loggedIn ? (
          <>
            {loggedInItemsDetails.map(({ item = "", link = "" }) => (
              <MobileNavItem key={item} onClick={onToggle} item={item} link={link} />
            ))}
          </>
        ) : (
          <NavLink to={"/connect-wallet"}>
            <Button
              fontSize={"md"}
              color={"white"}
              bg={"button_gradient"}
              px={8}
              _hover={{
                bg: "button_gradient_light",
              }}
              _active={{
                bg: "button_gradient_light",
              }}
            >
              Connect Wallet
            </Button>
          </NavLink>
        )}
      </Box>
    </Stack>
  );
};

const MobileNavItem = ({ link, item, onClick }) => {
  const location = useLocation();

  return (
    <NavLink to={`${location?.pathname === link ? "" : link}`}>
      <Flex
        justify={"space-between"}
        align={"center"}
        _hover={{
          textDecoration: "none",
        }}
        onClick={onClick}
      >
        <Text fontWeight={400} color={location?.pathname === link ? "brand_pink.900" : "gray.600"}>
          {item}
        </Text>
      </Flex>
    </NavLink>
  );
};
