import React, { useState, useEffect } from "react";
import { Stack, Heading, Text, StackDivider } from "@chakra-ui/layout";
import { Input } from "@chakra-ui/input";
import { Button, IconButton } from "@chakra-ui/button";
import { Image } from "@chakra-ui/image";
import { useBoolean, useDisclosure } from "@chakra-ui/react";
import { FiX } from "react-icons/fi";
import { Modal, ModalOverlay, ModalContent, ModalFooter, ModalBody } from "@chakra-ui/modal";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { FormControl, FormErrorMessage } from "@chakra-ui/form-control";

import getMaticPrice from "../../utils/getMaticPrice";
import { convertMaticToUsd } from "../../utils/misc";
import { ListNFTForSale } from "./../../store/slices/wallet";
import { setSellNftStep } from "./../../store/slices/layout";
import { useListNftForSale, useGetMarketplaceAddress } from "./../../api/listingService";
import { useGetNativeBalance } from "./../../api/externalService";

const ConfirmationModal = ({ isOpen, onClose, nftDetails, listingPrice, listingPriceInMatic }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isListing, setIsListing] = useBoolean(false);
  const { wallet } = useSelector((state) => state.wallet);
  const { getNativeBalance } = useGetNativeBalance();
  const { marketplaceAddress } = useGetMarketplaceAddress();
  const { mutate: handleNftListing } = useListNftForSale(() => {
    setIsListing.off();
    onClose();
    dispatch(setSellNftStep(2));
  });

  const handleListing = () => {
    setIsListing.on();
    dispatch(
      ListNFTForSale({
        NFT: {
          contract_address: nftDetails.token_address,
          tokenId: nftDetails.token_id,
          token_standard: nftDetails.contract_type,
        },
        listingPrice: String(listingPriceInMatic),
        wallet,
        navigate,
        originUrl: location.pathname || "/",
        handleNftListing,
        getNativeBalance,
        marketplaceAddress,
      })
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <Stack direction={"row"} justify={"space-between"} pt={"4"} px={4}>
          <Stack align={"center"} flex={1} justify={"center"}>
            <Text fontWeight={600}>Complete Listing</Text>
          </Stack>
          <IconButton
            bg={"button_gradient"}
            size={"xs"}
            color={"white"}
            borderRadius={"full"}
            icon={<FiX />}
            _hover={{ bg: "button_gradient_light" }}
            onClick={onClose}
            disabled={isListing}
          />
        </Stack>
        <ModalBody>
          <Stack direction={"row"} p={2} spacing={4} justify={{ base: "center", lg: "start" }}>
            <Image src={nftDetails.metadata.image} h={"28"} w={"28"} borderRadius={"lg"} objectFit={"cover"} />
            <Stack justify={"center"}>
              <Heading fontSize={"md"}>{nftDetails.metadata.name}</Heading>
              <Text fontSize={"sm"} color={"gray.500"}>
                {nftDetails.owner_name}
              </Text>
              <Heading fontSize={"xl"}>{`$${listingPrice.toLocaleString()}`}</Heading>
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
            onClick={handleListing}
            loadingText={"Listing..."}
            isLoading={isListing}
            disabled={!marketplaceAddress || isListing}
          >
            List my artwork
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const SellNft = ({ nftDetails }) => {
  const [currentMaticPrice, setCurrentMaticPrice] = useState(0);
  const [listingPrice, setListingPrice] = useState(1.5);
  const [priceBreakdown, setPriceBreakdown] = useState({
    priceInUsd: 0,
    serviceFee: 0,
    totalPrice: 0,
  });
  const [totalPriceInMatic, setTotalPriceInMatic] = useState("0");
  const [isFetchingPrice, setIsFetchingPrice] = useBoolean(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isListingPriceError, setIsListingPriceError] = useBoolean(false);

  const getMaticPriceUsd = async () => {
    const maticPrice = await getMaticPrice();
    setCurrentMaticPrice(maticPrice);
    handlePriceBreakdown(1.5, maticPrice);
    setIsFetchingPrice.off();
  };

  useEffect(() => {
    getMaticPriceUsd();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePriceBreakdown = (value, maticPrice) => {
    const priceInMatic = Number(value);
    const priceInUsd = convertMaticToUsd(priceInMatic, maticPrice);
    const serviceFeeInMatic = Number(priceInMatic * 0.025).toFixed(15);
    const serviceFee = Number(convertMaticToUsd(serviceFeeInMatic, maticPrice)).toFixed(2);
    console.log({
      priceInUsd,
      serviceFee,
    });
    const totalPrice = Number(Number(priceInUsd) + Number(serviceFee)).toFixed(2);
    const totalPriceMatic = Number(priceInMatic + Number(serviceFeeInMatic)).toFixed(15);

    setTotalPriceInMatic(totalPriceMatic);

    setPriceBreakdown({
      priceInUsd,
      serviceFee,
      totalPrice,
    });
  };

  const handleListingPriceChange = (e) => {
    const { value } = e.target;
    const priceInMatic = Number(value);

    if (priceInMatic < 99999999999) {
      setListingPrice(Number(Number(value).toFixed(4)));
      if (priceInMatic >= 1.5) {
        setIsListingPriceError.off();
        handlePriceBreakdown(value, currentMaticPrice);
      } else {
        setIsListingPriceError.on();
      }
    }
  };

  return (
    <>
      <Stack spacing={4}>
        <Stack>
          <Heading fontSize={"sm"}>Price</Heading>
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
                min={1.5}
                max={999999999999999}
                _focusVisible={{}}
                disabled={isFetchingPrice}
                value={listingPrice}
                onChange={handleListingPriceChange}
              />
            </Stack>
            <FormErrorMessage>
              <Text color={"red.500"}>Amount should be greater than or equal to 1.5</Text>
            </FormErrorMessage>
          </FormControl>
        </Stack>
        <Stack divider={<StackDivider />} spacing={"3"}>
          <Stack direction={"row"} justify={"space-between"} fontSize={"sm"} maxW={"full"} overflow={"hidden"}>
            <Text color={"#606060"}>Price</Text>
            <Text>{`$${priceBreakdown.priceInUsd.toLocaleString()}`}</Text>
          </Stack>
          <Stack direction={"row"} justify={"space-between"} fontSize={"sm"} maxW={"full"} overflow={"hidden"}>
            <Text color={"#606060"}>Royalties (2.5%)</Text>
            <Text>{`$${priceBreakdown.serviceFee.toLocaleString()}`}</Text>
          </Stack>
          <Stack direction={"row"} justify={"space-between"} maxW={"full"} overflow={"hidden"}>
            <Heading fontSize={"lg"}>Total</Heading>
            <Heading fontSize={"lg"}>{`$${priceBreakdown.totalPrice.toLocaleString()}`}</Heading>
          </Stack>
        </Stack>
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
            onOpen();
          }}
          disabled={listingPrice === 0 || isListingPriceError}
        >
          Complete Listing
        </Button>
      </Stack>

      {isOpen && (
        <ConfirmationModal
          isOpen={isOpen}
          onClose={onClose}
          nftDetails={nftDetails}
          listingPrice={priceBreakdown.totalPrice}
          listingPriceInMatic={totalPriceInMatic}
        />
      )}
    </>
  );
};

export default SellNft;
