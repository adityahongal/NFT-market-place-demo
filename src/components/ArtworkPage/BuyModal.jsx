import React from "react";
import { Stack, Text, Heading } from "@chakra-ui/layout";
import { Button, IconButton } from "@chakra-ui/button";
import { useBoolean, Image } from "@chakra-ui/react";
import { FiX } from "react-icons/fi";
import { Modal, ModalOverlay, ModalContent, ModalFooter, ModalBody } from "@chakra-ui/modal";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import { buyNFT } from "./../../store/slices/wallet";
import { useGetMarketplaceAddress } from "./../../api/listingService";

const BuyModal = ({ isOpen, onClose, nftDetails, listedDetails }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { wallet } = useSelector((state) => state.wallet);
  const [isLoading, setIsLoading] = useBoolean(false);
  const { marketplaceAddress } = useGetMarketplaceAddress();

  const handleOnConfirm = async () => {
    setIsLoading.on();
    dispatch(
      buyNFT({
        NFT: {
          id: listedDetails.id,
          contract_address: nftDetails.token_address,
          tokenId: nftDetails.token_id,
          token_standard: nftDetails.contract_type,
          price: listedDetails.price,
          extras: {
            name: nftDetails.metadata.name,
            image_url: nftDetails.metadata.image,
            seller: listedDetails.seller,
          },
        },
        wallet,
        navigate,
        originUrl: location.pathname || "/",
        marketplaceAddress,
        handleClose: () => {
          setIsLoading.off();
          onClose();
        },
      })
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <Stack direction={"row"} justify={"space-between"} pt={"4"} px={4}>
          <Stack align={"center"} flex={1} justify={"center"}>
            <Text fontWeight={600}>Complete Checkout</Text>
          </Stack>
          <IconButton
            bg={"button_gradient"}
            size={"xs"}
            color={"white"}
            borderRadius={"full"}
            icon={<FiX />}
            _hover={{ bg: "button_gradient_light" }}
            onClick={onClose}
          />
        </Stack>
        <ModalBody>
          <Stack direction={"row"} p={2} spacing={4} justify={{ base: "center", lg: "start" }}>
            <Image src={nftDetails.metadata.image} h={"28"} w={"28"} borderRadius={"lg"} />
            <Stack justify={"center"}>
              <Heading fontSize={"md"}>{nftDetails.metadata.name}</Heading>
              <Text fontSize={"sm"} color={"gray.500"}>
                {nftDetails.owner_name}
              </Text>
              <Heading fontSize={"xl"}>{`$${listedDetails?.priceInUsd?.toLocaleString()}`}</Heading>
            </Stack>
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
            onClick={handleOnConfirm}
            loadingText={"Please wait..."}
            isLoading={isLoading}
          >
            Checkout Now
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BuyModal;
