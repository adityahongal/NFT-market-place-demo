import React, { useState, useEffect } from "react";
import {
  Stack,
  Heading,
  Text,
  StackDivider,
  Box,
  Divider,
} from "@chakra-ui/layout";
import {
  Tooltip,
  Image,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { IconButton, Button } from "@chakra-ui/button";
import { FiCopy, FiEdit2, FiEdit3 } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import Web3 from "web3";

import { UploadImageModal, EditNameModal } from "./../components/Settings";
import getMaticPrice from "./../utils/getMaticPrice";
import { userStateSelector } from "./../store/slices/user";
import { useGetNativeBalance } from "./../api/externalService";

import maticLogo from "./../Assets/polygon-matic-logo.svg";

const Settings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [copyTooltipLabel, setCopyTooltipLabel] = useState(
    "Copy wallet address"
  );
  const [maticUSDBalance, setMaticUSDBalance] = useState(0);
  const [maticBalance, setMaticBalance] = useState(0);
  const [imageUploadContext, setImageUploadContext] = useState("");
  const { wallet = {}, loggedIn } = useSelector((state) => state.wallet);
  const { address = "" } = wallet;
  const { data: nativeBalance, getNativeBalance } = useGetNativeBalance();
  const userDetails = useSelector(userStateSelector);
  const sliceCount = useBreakpointValue({ base: 6, lg: 20 });
  const {
    isOpen: isUploadImageModalOpen,
    onClose: onUploadImageModalClose,
    onOpen: onUploadImageModalOpen,
  } = useDisclosure();
  const {
    isOpen: isEditNameModalOpen,
    onClose: onEditNameModalClose,
    onOpen: onEditNameModalOpen,
  } = useDisclosure();

  const formatMaticBalance = (maticBalance) => {
    const formattedBalance = Web3.utils.fromWei(maticBalance, "ether");
    setMaticBalance(formattedBalance);
    convertMaticToUSD(Number(formattedBalance));
  };

  const convertMaticToUSD = async (amount) => {
    const maticUSDPrice = await getMaticPrice();
    const convertedPrice = Number(maticUSDPrice * Number(amount)).toFixed(4);
    setMaticUSDBalance(convertedPrice);
  };

  useEffect(() => {
    if (!loggedIn) {
      navigate("/connect-wallet", {
        state: {
          redirectedFrom: location?.pathname || "",
        },
      });
    }
  }, [location?.pathname, loggedIn, navigate]);

  useEffect(() => {
    if (address) {
      getNativeBalance({
        address,
        chain: process.env.REACT_APP_MORALIS_CHAIN_NAME,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  useEffect(() => {
    if (nativeBalance?.balance) {
      formatMaticBalance(nativeBalance.balance);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nativeBalance?.balance]);

  return (
    <Stack
      bg="background_gradient_1"
      py={{ base: "6", lg: "10" }}
      px={{ base: 4, md: 16 }}
      align={"center"}
      spacing={{ base: "6", lg: "10" }}
      w={"full"}
      flex={1}
    >
      {isUploadImageModalOpen && (
        <UploadImageModal
          isOpen={isUploadImageModalOpen}
          onClose={onUploadImageModalClose}
          context={imageUploadContext}
        />
      )}
      {isEditNameModalOpen && (
        <EditNameModal
          isOpen={isEditNameModalOpen}
          onClose={onEditNameModalClose}
        />
      )}
      <Heading>My profile</Heading>
      <Stack
        bg={"white"}
        borderRadius={"xl"}
        w={{ base: "full", lg: "50%" }}
        spacing={{ base: "3", lg: "5" }}
      >
        <Stack>
          <Box
            h={"30vh"}
            borderTopRadius={"xl"}
            pos={"relative"}
            cursor={"pointer"}
          >
            <Image
              src={userDetails?.background_image}
              h={"full"}
              w={"full"}
              borderTopRadius={"xl"}
              objectFit={"cover"}
              fallbackStrategy={"beforeLoadOrError"}
              fallbackSrc={
                "https://images.unsplash.com/photo-1642370324100-324b21fab3a9?w=500"
              }
            />
            <Stack
              pos={"absolute"}
              top={0}
              left={0}
              bg={"black"}
              h={"30vh"}
              w={"full"}
              opacity={0}
              borderTopRadius={"xl"}
              _hover={{ opacity: 0.9 }}
              transition={"all 0.2s linear"}
              justify={"center"}
              align={"center"}
              onClick={() => {
                setImageUploadContext("cover");
                onUploadImageModalOpen();
              }}
            >
              <Stack direction={"row"} color={"white"} align={"center"}>
                <FiEdit2 /> <Text>Edit</Text>
              </Stack>
            </Stack>
          </Box>
          <Box
            pos={"relative"}
            px={{ base: 4, md: 16 }}
            pb={"16"}
            w={"full"}
            zIndex={90}
          >
            <Box
              borderRadius={"full"}
              h={"28"}
              w={"28"}
              border={"5px solid #FFFFFF"}
              pos={"absolute"}
              top={"-14"}
              left={"50%"}
              transform={"translateX(-50%)"}
              bg={"white"}
            >
              <Image
                src={userDetails?.avatar}
                h={"full"}
                w={"full"}
                borderRadius={"full"}
                objectFit={"cover"}
                fallbackStrategy={"beforeLoadOrError"}
                fallbackSrc={`https://api.dicebear.com/7.x/identicon/svg?seed=${wallet?.address}`}
              />
            </Box>
            <Stack
              borderRadius={"full"}
              h={"28"}
              w={"28"}
              border={"5px solid #FFFFFF"}
              pos={"absolute"}
              top={"-14"}
              left={"50%"}
              transform={"translateX(-50%)"}
              bg={"black"}
              opacity={0}
              _hover={{ opacity: 0.9 }}
              transition={"all 0.2s linear"}
              cursor={"pointer"}
              justify={"center"}
              align={"center"}
              onClick={() => {
                setImageUploadContext("avatar");
                onUploadImageModalOpen();
              }}
            >
              <Stack
                direction={"row"}
                color={"white"}
                align={"center"}
                fontSize={"sm"}
              >
                <FiEdit2 /> <Text fontSize={"sm"}>Edit</Text>
              </Stack>
            </Stack>
          </Box>
          <Stack
            align={"center"}
            justify={"center"}
            px={{ base: "4", lg: "8" }}
          >
            <Stack justify={"center"} align={"center"} direction={"row"}>
              <Heading textAlign={"center"} fontSize={"xl"}>
                {userDetails?.name}
              </Heading>
              <Tooltip label={"Edit Name and bio"} hasArrow>
                <IconButton
                  icon={<FiEdit3 />}
                  borderRadius={"full"}
                  size={"xs"}
                  variant={"ghost"}
                  onClick={onEditNameModalOpen}
                />
              </Tooltip>
            </Stack>
          </Stack>
          <Stack
            align={"center"}
            justify={"center"}
            px={{ base: "4", lg: "8" }}
          >
            <Stack justify={"center"} align={"center"}>
              <Text textAlign={"center"} fontSize={"sm"} color={"gray.600"}>
                {userDetails?.bio}
              </Text>
            </Stack>
          </Stack>
        </Stack>
        <Divider />
        <Stack
          px={{ base: "4", lg: "8" }}
          pb={{ base: "4", lg: "8" }}
          spacing={{ base: "3", lg: "5" }}
          divider={<StackDivider />}
        >
          <Stack
            direction={"row"}
            fontSize={"sm"}
            justify={"space-between"}
            align={"center"}
          >
            <Text>Wallet Address</Text>
            <Tooltip label={copyTooltipLabel}>
              <Stack
                direction={"row"}
                border={"1px solid"}
                borderColor={"gray.200"}
                p={"2.5"}
                borderRadius={"md"}
                align={"center"}
                cursor={"pointer"}
                onClick={() => {
                  if (navigator) {
                    navigator.clipboard.writeText(address);
                    setCopyTooltipLabel("Copied!");
                    setTimeout(() => {
                      setCopyTooltipLabel("Copy wallet address");
                    }, 2500);
                  }
                }}
              >
                <Text>{`${address.slice(0, sliceCount)} ...`}</Text>
                <Box>
                  <FiCopy />
                </Box>
              </Stack>
            </Tooltip>
          </Stack>
          <Stack
            direction={"row"}
            fontSize={"sm"}
            justify={"space-between"}
            align={"center"}
          >
            <Text>Network</Text>
            <Stack direction={"row"}>
              <Image src={maticLogo} h={5} w={5} />
              <Text color={"gray.600"} fontWeight={500}>
                Polygon
              </Text>
            </Stack>
          </Stack>
          <Heading fontSize={"xl"}>Assets</Heading>
          <Stack
            direction={"row"}
            fontSize={"sm"}
            justify={"space-between"}
            align={"center"}
          >
            <Stack direction={"row"}>
              <Image src={maticLogo} h={5} w={5} />
              <Text fontWeight={500}>{`${Number(maticBalance).toFixed(
                4
              )} MATIC`}</Text>
            </Stack>
            <Heading fontSize={"xl"}>{`${maticUSDBalance} USD`}</Heading>
          </Stack>
        </Stack>
        <Stack px={{ base: "4", lg: "8" }} pb={{ base: "4", lg: "8" }}>
          <Button
            color={"white"}
            bg={"button_gradient"}
            size={"lg"}
            fontSize={"md"}
            _hover={{
              bg: "button_gradient_light",
            }}
            _active={{
              bg: "button_gradient_light",
            }}
            onClick={() => {
              localStorage.removeItem("delta");
              localStorage.removeItem("alpha");
              localStorage.removeItem("beta");
              window.location.href = window.location.origin;
            }}
          >
            Sign Out
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Settings;
