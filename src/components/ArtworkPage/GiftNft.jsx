import React, { useState } from "react";
import { Stack, Heading, Box, Text } from "@chakra-ui/layout";
import { Input } from "@chakra-ui/input";
import { Button } from "@chakra-ui/button";
import { Image } from "@chakra-ui/image";
import { useBoolean } from "@chakra-ui/react";
import { Tooltip } from "@chakra-ui/tooltip";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/form-control";

import { transfer721NFT, transfer1155NFT } from "./../../store/slices/wallet";
import { setGiftNftStep } from "./../../store/slices/layout";
import { useGetNativeBalance } from "./../../api/externalService";

import alertIcon from "./../../Assets/ic_alert.svg";

const GiftNft = ({ nftDetails }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { contractAddress = "", tokenId = "" } = useParams();
  const { wallet } = useSelector((state) => state.wallet);
  const [senderWalletAddress, setSenderWalletAddress] = useState("");
  const [isTransfering, setIsTransfering] = useBoolean(false);
  const [isAmtError, setIsAmtError] = useBoolean(false);
  const [quantity, setQuantity] = useState(1);
  const { getNativeBalance } = useGetNativeBalance();

  const { contract_type = "", amount = "0" } = nftDetails || {};

  const handleNftGift = () => {
    setIsTransfering.on();
    if (contract_type === "ERC721") {
      dispatch(
        transfer721NFT({
          NFT: { contract_address: contractAddress, tokenId },
          transferAddress: senderWalletAddress,
          wallet,
          navigate,
          originUrl: location.pathname || "/",
          handleClose: () => {
            setIsTransfering.off();
            dispatch(setGiftNftStep(2));
          },
          getNativeBalance,
        })
      );
    } else {
      dispatch(
        transfer1155NFT({
          NFT: { contract_address: contractAddress, tokenId, quantity },
          transferAddress: senderWalletAddress,
          wallet,
          navigate,
          originUrl: location.pathname || "/",
          getNativeBalance,
          handleClose: () => {
            setIsTransfering.off();
            dispatch(setGiftNftStep(2));
          },
        })
      );
    }
  };

  const handleQuantityChange = (e) => {
    const { value } = e.target;
    if (Number(value) > Number(amount)) {
      setIsAmtError.on();
    } else {
      setIsAmtError.off();
    }
    setQuantity(value);
  };

  return (
    <Stack spacing={"4"}>
      <Stack direction={"row"} align={"center"}>
        <Heading fontSize={"md"}>Recipient wallet address</Heading>
        <Tooltip
          borderRadius={"xl"}
          bg="#484848"
          label={
            <Stack p={3}>
              <Heading color={"white"} fontSize={"md"}>
                Wallet Addresses
              </Heading>
              <Text>
                If you don’t know this, ask the person you want to send this gift to and they can share their address.
              </Text>
            </Stack>
          }
          hasArrow
        >
          <Box cursor={"pointer"}>
            <Image src={alertIcon} h={"full"} w={"full"} />
          </Box>
        </Tooltip>
      </Stack>
      <Input
        type={"text"}
        placeholder={"e.g. 1s94I5d3cd..."}
        size={"lg"}
        fontSize={"md"}
        _placeholder={{
          fontSize: "md",
        }}
        _focusVisible={{
          borderColor: "brand_pink.900",
        }}
        onChange={(e) => setSenderWalletAddress(e.target.value)}
      />

      {contract_type === "ERC1155" && (
        <FormControl isInvalid={isAmtError}>
          <FormLabel htmlFor="amount" color={"black"}>
            Quantity
          </FormLabel>
          <Input
            type={"number"}
            size={"lg"}
            fontSize={"md"}
            min={1}
            max={Number(amount)}
            value={quantity}
            onChange={handleQuantityChange}
          />
          <FormErrorMessage>
            <Text color={"red.500"}>Quantity should be less than total available amount</Text>
          </FormErrorMessage>
        </FormControl>
      )}
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
        loadingText={"Sending..."}
        isLoading={isTransfering}
        isDisabled={isAmtError || senderWalletAddress.length < 20 || isTransfering}
        onClick={handleNftGift}
      >
        Send
      </Button>
    </Stack>
  );
};

export default GiftNft;
