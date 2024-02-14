import React from "react";
import { Stack, Text } from "@chakra-ui/layout";
import { Button, IconButton } from "@chakra-ui/button";
import { useBoolean } from "@chakra-ui/react";
import { FiX } from "react-icons/fi";
import { Modal, ModalOverlay, ModalContent, ModalFooter, ModalBody } from "@chakra-ui/modal";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import { CancelNFTSaleListing } from "./../../store/slices/wallet";
import { selectMiscData } from "./../../store/slices/contentful";
import { useDeleteListing, useGetMarketplaceAddress } from "./../../api/listingService";
import { useGetNativeBalance } from "./../../api/externalService";

const CancelListingModal = ({ isOpen, onClose, nftDetails }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { wallet } = useSelector((state) => state.wallet);
  const delistArtworkSuccessText = "Artwork De-listed successfully";
  const [isLoading, setIsLoading] = useBoolean(false);
  const { marketplaceAddress } = useGetMarketplaceAddress();
  const { getNativeBalance } = useGetNativeBalance();
  const { mutate: deleteListing } = useDeleteListing({
    handleOnFinish: () => {
      setIsLoading.off();
      navigate("/success", {
        state: {
          headerText: delistArtworkSuccessText,
          redirectTo: "/profile",
          timeout: 2500,
        },
      });
      onClose();
    },
    tokenAddress: nftDetails.token_address,
    tokenId: nftDetails.token_id,
  });

  const handleOnConfirm = async () => {
    setIsLoading.on();
    dispatch(
      CancelNFTSaleListing({
        NFT: {
          id: nftDetails.id,
          contract_address: nftDetails.token_address,
          tokenId: nftDetails.token_id,
          token_standard: nftDetails.contract_type,
          seller: nftDetails.seller,
        },
        wallet,
        navigate,
        originUrl: location.pathname || "/",
        marketplaceAddress,
        deleteListing,
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
            <Text fontWeight={600}>Cancel Listing</Text>
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
          <Stack direction={"row"} p={2} spacing={4} justify={{ base: "center", lg: "start" }}>
            <Text textAlign={"center"}>Are you sure you want to cancel your artwork from the listings?</Text>
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
            isLoading={isLoading}
            loadingText={"De-listing artwork..."}
            onClick={handleOnConfirm}
          >
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CancelListingModal;
