import React, { useState, useEffect } from "react";
import {
  Stack,
  Heading,
  Text,
  StackDivider,
  Box,
  Divider,
} from "@chakra-ui/layout";
import { Tooltip, Image, useBreakpointValue } from "@chakra-ui/react";
import { Button } from "@chakra-ui/button";
import { FiCopy } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/form-control";
import Web3 from "web3";
import { ethers } from "ethers";

import getMaticPrice from "./../utils/getMaticPrice";
import { Input, useBoolean } from "@chakra-ui/react";
import maticLogo from "./../Assets/polygon-matic-logo.svg";
import { useGetNativeBalance } from "./../api/externalService";
import { toast } from "react-toastify";

const TransferMatic = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [copyTooltipLabel, setCopyTooltipLabel] = useState(
    "Copy wallet address"
  );
  const [maticUSDBalance, setMaticUSDBalance] = useState(0);
  const [maticBalance, setMaticBalance] = useState(0);
  const [isQuantityError, setIsQuantityError] = useBoolean(false);
  const [loading, setLoading] = useBoolean(false);
  const [isTransfering, setIsTransfering] = useBoolean(false);
  const [senderWalletAddress, setSenderWalletAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [amount, setAmount] = useState(0);
  const { wallet = {}, loggedIn } = useSelector((state) => state.wallet);
  const { address = "" } = wallet;
  const { data: nativeBalance, getNativeBalance } = useGetNativeBalance();

  const sliceCount = useBreakpointValue({ base: 6, lg: 20 });

  const handleQuantityChange = (e) => {
    setLoading.on();
    const { value } = e.target;
    if (value !== 0 && value !== undefined) {
      setAmount(Number(value));
      if (Number(value) <= Number(maticBalance) && Number(value) !== 0) {
        setIsQuantityError.off();
      } else {
        setIsQuantityError.on();
      }
    }
    setLoading.off();
  };

  const handleTransfer = async () => {
    try {
      setErrorMessage("");
      setIsTransfering.on();
      const transactionsParameters = {
        from: address,
        to: senderWalletAddress,
        value: ethers.utils.parseEther(`${amount}`),
      };
      const transferResponse = await wallet.sendTransaction(
        transactionsParameters
      );
      await transferResponse.wait();
      setAmount(0);
      setSenderWalletAddress("");
      if (address) {
        getNativeBalance({
          address,
          chain: process.env.REACT_APP_MORALIS_CHAIN_NAME,
        });
      }

      toast.success(`Transfer Completed`, {
        newestOnTop: true,
        pauseOnHover: true,
        autoClose: 1000,
      });
      setIsTransfering.off();
    } catch (e) {
      console.error(e);
      setErrorMessage(
        "Failed to transfer, please try again with proper sender address and amount"
      );
      toast.warn(`Transfer Failed`, {
        newestOnTop: true,
        pauseOnHover: true,
        autoClose: 1000,
      });
    }
  };

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
      <Heading>Transfer Crypto</Heading>
      <Stack
        bg={"white"}
        borderRadius={"xl"}
        w={{ base: "full", lg: "50%" }}
        spacing={{ base: "3", lg: "5" }}
      >
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
          <Heading fontSize={"xl"}>Available Balances</Heading>
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
          <Stack>
            <FormControl isInvalid={isQuantityError} inputMode="numeric">
              <FormLabel>Receiver</FormLabel>
              <Input
                type={"text"}
                placeholder={"e.g. 0x1s94I5d3cd..."}
                size={"lg"}
                fontSize={"md"}
                _placeholder={{
                  fontSize: "md",
                }}
                _focusVisible={{
                  borderColor: "brand_pink.900",
                }}
                value={senderWalletAddress}
                onChange={(e) => setSenderWalletAddress(e.target.value)}
              />
            </FormControl>
            <FormControl isInvalid={isQuantityError} inputMode="numeric">
              <FormLabel>Amount</FormLabel>
              <Input
                type="number"
                placeholder="Amount of Matic"
                _focusVisible={{
                  borderColor: "brand_pink.900",
                  borderWidth: "2px",
                }}
                value={amount}
                onChange={handleQuantityChange}
              />
              <FormErrorMessage>
                Please enter proper amount not exceeding your balance
              </FormErrorMessage>
            </FormControl>
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
            isLoading={isTransfering}
            loadingText={"Transfering..."}
            disabled={loading || isQuantityError}
            onClick={() => {
              handleTransfer();
            }}
          >
            Transfer
          </Button>
          {errorMessage !== "" && <Text>{errorMessage}</Text>}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default TransferMatic;
