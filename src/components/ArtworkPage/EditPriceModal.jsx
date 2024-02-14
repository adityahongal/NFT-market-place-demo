import React, { useState } from "react";
import { Modal, ModalOverlay, ModalContent, ModalFooter, ModalBody } from "@chakra-ui/modal";
import { Button, IconButton } from "@chakra-ui/button";
import { useDispatch, useSelector } from "react-redux";
import { Stack, Text } from "@chakra-ui/layout";
import { useNavigate, useLocation } from "react-router-dom";
import { useBoolean } from "@chakra-ui/react";
import { Input } from "@chakra-ui/input";
import { FiX } from "react-icons/fi";
import { FormControl, FormErrorMessage } from "@chakra-ui/form-control";

import { EditNFTOnSale } from "./../../store/slices/wallet";

import { useUpdateListing, useGetMarketplaceAddress } from "../../api/listingService";
import { useGetNativeBalance } from "../../api/externalService";

const EditPriceModal = ({ isOpen, onClose, nftDetails }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useBoolean(false);
  const [price, setPrice] = useState(1.5);
  const { wallet } = useSelector((state) => state.wallet);
  const priceUpdateSuccessText = "Price Updated Successfully";
  const [isListingPriceError, setIsListingPriceError] = useBoolean(false);
  const { marketplaceAddress } = useGetMarketplaceAddress();
  const { getNativeBalance } = useGetNativeBalance();
  const { mutate: updateListing } = useUpdateListing({
    handleOnFinish: () => {
      setIsLoading.off();
      navigate("/success", {
        state: {
          headerText: priceUpdateSuccessText,
          redirectTo: "/profile",
          timeout: 2500,
        },
      });
      onClose();
    },
    tokenAddress: nftDetails.token_address,
    tokenId: nftDetails.token_id,
  });

  const handleListingPriceChange = (e) => {
    const { value } = e.target;
    const priceInMatic = Number(value);

    if (priceInMatic < 99999999999) {
      setPrice(Number(Number(value).toFixed(4)));
      if (priceInMatic >= 1.5) {
        setIsListingPriceError.off();
      } else {
        setIsListingPriceError.on();
      }
    }
  };

  const handleOnConfirm = async () => {
    setIsLoading.on();
    dispatch(
      EditNFTOnSale({
        NFT: {
          id: nftDetails.id,
          contract_address: nftDetails.token_address,
          tokenId: nftDetails.token_id,
          token_standard: nftDetails.contract_type,
          seller: nftDetails.seller,
        },
        updatedPrice: String(price),
        wallet,
        navigate,
        originUrl: location.pathname || "/",
        marketplaceAddress,
        updateListing,
        getNativeBalance,
      })
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <Stack
          direction={"row"}
          justify={"space-between"}
          py={"4"}
          mx={4}
          borderBottom={"1px solid"}
          borderColor={"gray.200"}
        >
          <Stack align={"center"} flex={1} justify={"center"}>
            <Text fontWeight={600}>Edit Price</Text>
          </Stack>
          <IconButton
            bg={"button_gradient"}
            size={"xs"}
            color={"white"}
            borderRadius={"full"}
            icon={<FiX />}
            _hover={{ bg: "button_gradient_light" }}
            onClick={onClose}
            disabled={isLoading}
          />
        </Stack>
        <ModalBody>
          <Stack p={2} spacing={8} justify={{ base: "center", lg: "start" }}>
            <Text textAlign={"center"}>Change the price of your artwork below.</Text>
            <FormControl isInvalid={isListingPriceError} inputMode="decimal">
              <Stack direction={"row"} borderRadius={"lg"} bg={"#F4F4F4"} spacing={0}>
                <Stack bg={"button_gradient"} borderLeftRadius={"lg"} px={"4"} align={"center"} justify={"center"}>
                  <Text color={"white"}>MATIC</Text>
                </Stack>
                <Input
                  bg={"transparent"}
                  border={"none"}
                  borderLeftRadius={"none"}
                  size={"lg"}
                  textAlign={"right"}
                  type={"number"}
                  min={0}
                  max={999999999999999}
                  _focusVisible={{}}
                  disabled={isLoading}
                  value={price}
                  onChange={handleListingPriceChange}
                />
              </Stack>
              <FormErrorMessage>
                <Text color={"red.500"}>Amount should be greater than or equal to 1.5</Text>
              </FormErrorMessage>
            </FormControl>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button
            w={"full"}
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
            disabled={isLoading || price === 0 || isListingPriceError}
            isLoading={isLoading}
            loadingText={"Updating Price..."}
            onClick={handleOnConfirm}
          >
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditPriceModal;
