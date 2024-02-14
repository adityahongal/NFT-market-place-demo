import React, { useEffect } from "react";
import { Stack, Text } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { Input, Textarea, useBoolean } from "@chakra-ui/react";
import { useParams, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { FormControl, FormErrorMessage } from "@chakra-ui/form-control";
import { useSelector, useDispatch } from "react-redux";

import { mint721Artwork, mint1155Artwork } from "../../store/slices/wallet";
import { userStateSelector } from "../../store/slices/user";

import { setMintData, resetMintData, mintDataSelector } from "../../store/slices/layout";
import { isEmpty } from "lodash";

import { useGetMinterAddress, useGetRoyaltyAddress } from "./../../api/listingService";
import { useUpdateUserDetails } from "./../../api/userService";
import { useGetNativeBalance } from "./../../api/externalService";

const LoggedInView = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const miko_id = searchParams.get("miko_id") || "";
  const { imageHash = "" } = useParams();
  const [isMinting, setIsMinting] = useBoolean(false);
  const { wallet } = useSelector((state) => state.wallet);
  const userDetails = useSelector(userStateSelector);
  const { getNativeBalance } = useGetNativeBalance();
  const {
    quantity: artworkQuantity,
    name: artworkName,
    description: artworkDescription,
  } = useSelector(mintDataSelector);
  const ctaLoadingText = "Minting";
  const ctaText = "Mint";
  const [isQuantityError, setIsQuantityError] = useBoolean(false);
  const { minterAddress } = useGetMinterAddress();
  const { royaltyReceiverAddress } = useGetRoyaltyAddress();
  const { mutate: updateUserDetails } = useUpdateUserDetails();

  const handleQuantityChange = (e) => {
    const { value } = e.target;
    if (value > 0 && value <= 10000) {
      setIsQuantityError.off();
    } else {
      setIsQuantityError.on();
    }
    dispatch(setMintData({ quantity: value }));
  };

  const handleMint = () => {
    setIsMinting.on();
    const artworkPayload = {
      name: artworkName,
      description: artworkDescription,
      image: `https://ipfs.io/ipfs/${imageHash}`,
    };

    const commonPayload = {
      artwork: artworkPayload,
      wallet,
      originUrl: location.pathname || "",
      navigate,
      userDetails,
      miko_id,
      minterAddress,
      royaltyReceiverAddress,
      getNativeBalance,
      updateUserDetails,
      onSuccess: async() => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsMinting.off();
        navigate("/success", {
          state: {
            headerText: "Artwork minted successfully!",
            shouldRedirect: false,
            ctaText: "Show me my NFTs",
            redirectTo: "/profile",
          },
        });
      },
    };

    if (artworkQuantity > 1) {
      dispatch(
        mint1155Artwork({
          ...commonPayload,
          quantity: artworkQuantity,
        })
      );
    } else {
      dispatch(
        mint721Artwork({
          ...commonPayload,
        })
      );
    }
  };

  useEffect(() => {
    const state = location?.state || {};
    if (!isEmpty(state)) {
      const { rechargeRedirect = false } = state;
      if (!rechargeRedirect) {
        dispatch(resetMintData());
      }
    } else {
      dispatch(resetMintData());
    }
  }, []);

  return (
    <>
      <Stack w={"full"}>
        <Stack>
          <Text fontSize={"sm"} fontWeight={500}>
            Name
          </Text>
          <Input
            placeholder="Name of the artwork"
            _focusVisible={{
              borderColor: "brand_pink.900",
              borderWidth: "2px",
            }}
            value={artworkName}
            disabled={isMinting}
            onChange={(e) => dispatch(setMintData({ name: e.target.value }))}
          />
        </Stack>
        <Stack>
          <Text fontSize={"sm"} fontWeight={500}>
            Quantity
          </Text>
          <FormControl isInvalid={isQuantityError} inputMode="numeric">
            <Input
              type="number"
              min={1}
              max={10000}
              placeholder="No. of artworks"
              _focusVisible={{
                borderColor: "brand_pink.900",
                borderWidth: "2px",
              }}
              value={artworkQuantity}
              onChange={handleQuantityChange}
            />
            <FormErrorMessage>Please enter a valid quantity between 1 and 10000.</FormErrorMessage>
          </FormControl>
        </Stack>
        <Stack>
          <Text fontSize={"sm"} fontWeight={500}>
            Description
          </Text>
          <Textarea
            resize={"none"}
            placeholder="Description of the artwork"
            _focusVisible={{
              borderColor: "brand_pink.900",
              borderWidth: "2px",
            }}
            value={artworkDescription}
            disabled={isMinting}
            onChange={(e) => dispatch(setMintData({ description: e.target.value }))}
          />
        </Stack>
      </Stack>
      <Button
        variant={"solid"}
        fontSize={"md"}
        color={"white"}
        bg={"button_gradient"}
        _hover={{
          bg: "button_gradient_light",
        }}
        _active={{
          bg: "button_gradient_light",
        }}
        px={{ lg: "16" }}
        py={{ base: "6" }}
        w={"100%"}
        isDisabled={artworkDescription === "" || artworkName === "" || isQuantityError || isMinting}
        isLoading={isMinting}
        loadingText={ctaLoadingText}
        onClick={handleMint}
      >
        {ctaText}
      </Button>
    </>
  );
};

export default LoggedInView;
