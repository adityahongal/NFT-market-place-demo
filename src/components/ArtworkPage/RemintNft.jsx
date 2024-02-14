import React, { useState } from "react";
import { Stack, Text } from "@chakra-ui/layout";
import { Input } from "@chakra-ui/input";
import { Button } from "@chakra-ui/button";
import { useBoolean } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/form-control";

import { mint1155Artwork } from "../../store/slices/wallet";
import { setRemintNftStep } from "../../store/slices/layout";
import { userStateSelector } from "../../store/slices/user";
import { useGetMinterAddress, useGetRoyaltyAddress } from "./../../api/listingService";
import { useGetNativeBalance } from "./../../api/externalService";

const RemintNft = ({ nftDetails }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { wallet } = useSelector((state) => state.wallet);
  const [isMinting, setIsMinting] = useBoolean(false);
  const [isAmtError, setIsAmtError] = useBoolean(false);
  const [quantity, setQuantity] = useState(1);
  const userDetails = useSelector(userStateSelector);
  const { minterAddress } = useGetMinterAddress();
  const { royaltyReceiverAddress } = useGetRoyaltyAddress();
  const { getNativeBalance } = useGetNativeBalance();

  const { token_id = 0, token_address = "" } = nftDetails || {};

  const handleRemintNft = () => {
    setIsMinting.on();
    dispatch(
      mint1155Artwork({
        wallet,
        originUrl: location.pathname || "/",
        userDetails,
        quantity,
        isRemint: true,
        existing_token_id: Number(token_id), // only required for reminting,
        existing_contact_address: token_address, // only required for reminting
        minterAddress,
        royaltyReceiverAddress,
        getNativeBalance,
        navigate,
        onSuccess: async() => {
          await new Promise(resolve => setTimeout(resolve, 1000));
          setIsMinting.off();
          dispatch(setRemintNftStep(2));
        },
      })
    );
  };

  const handleQuantityChange = (e) => {
    const { value } = e.target;

    if (Number(value) > 0 && Number(value) <= 10000) {
      setIsAmtError.off();
    } else {
      setIsAmtError.on();
    }
    setQuantity(value);
  };

  return (
    <Stack spacing={"4"}>
      <FormControl isInvalid={isAmtError}>
        <FormLabel htmlFor="amount" color={"black"}>
          Quantity
        </FormLabel>
        <Input
          type={"number"}
          size={"lg"}
          fontSize={"md"}
          min={1}
          max={10000}
          value={quantity}
          onChange={handleQuantityChange}
        />
        <FormErrorMessage>
          <Text color={"red.500"}>Please enter a valid quantity between 1 and 10000.</Text>
        </FormErrorMessage>
      </FormControl>

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
        loadingText={"Minting..."}
        isLoading={isMinting}
        isDisabled={isAmtError || isMinting}
        onClick={handleRemintNft}
      >
        Mint
      </Button>
    </Stack>
  );
};

export default RemintNft;
