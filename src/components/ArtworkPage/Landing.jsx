import React, { useEffect, useState } from "react";
import { chakra, useDisclosure } from "@chakra-ui/react";
import { Box, Stack, Heading, Text, Link } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import getMaticPrice from "./../../utils/getMaticPrice";
import { convertMaticToUsd } from "./../../utils/misc";
import { setGiftNftStep, setSellNftStep, setRemintNftStep } from "./../../store/slices/layout";
import { useGetListingById } from "./../../api/listingService";
import CancelListingModal from "./CancelListingModal";
import EditPriceModal from "./EditPriceModal";
import BuyModal from "./BuyModal";

const Landing = ({ nftDetails }) => {
  const dispatch = useDispatch();
  const { contractAddress = "", tokenId = "" } = useParams();
  const { wallet = {} } = useSelector((state) => state.wallet);
  const [listedDetails, setListedDetails] = useState({});
  const [isListed, setIsListed] = useState(false);
  const [isDetailsFetching, setIsDetailsFetching] = useState(true);
  const {
    isOpen: isCancelListingModalOpen,
    onOpen: onCancelListingModalOpen,
    onClose: onCancelListingModalClose,
  } = useDisclosure();
  const {
    isOpen: isEditPriceModalOpen,
    onOpen: onEditPriceModalOpen,
    onClose: onEditPriceModalClose,
  } = useDisclosure();
  const { isOpen: isBuyModalOpen, onOpen: onBuyModalOpen, onClose: onBuyModalClose } = useDisclosure();

  const { address: walletAddress = "" } = wallet || {};

  const { data: listingData, isLoading: isListingLoading } = useGetListingById({
    tokenAddress: contractAddress,
    tokenId,
  });

  const fetchAllListedNfts = async () => {
    setIsDetailsFetching(true);

    if (listingData) {
      if (listingData.status === "active") {
        const maticInUsd = await getMaticPrice();
        const priceInUsd = convertMaticToUsd(listingData.price, maticInUsd);
        setListedDetails({ ...listingData, priceInUsd });
        setIsListed(true);
      }
    }
    setIsDetailsFetching(false);
  };

  useEffect(() => {
    fetchAllListedNfts();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress, listingData]);

  const getActionButtons = () => {
    let Component = "";

    if (!isListingLoading && !isDetailsFetching && walletAddress) {
      if (isListed) {
        if (walletAddress.toLowerCase() === listedDetails.seller.toLowerCase()) {
          Component = (
            <Stack py={3} spacing={4} direction={{ base: "column", lg: "row" }}>
              <Button
                variant={"outline"}
                borderColor={"brand_red.500"}
                size={"lg"}
                fontSize={"md"}
                _hover={{
                  bg: "brand_pink.100",
                }}
                w={"full"}
                onClick={onCancelListingModalOpen}
              >
                <Text bg="button_gradient" bgClip="text">
                  Cancel Listing
                </Text>
              </Button>
              <Button
                variant={"outline"}
                borderColor={"brand_red.500"}
                size={"lg"}
                fontSize={"md"}
                _hover={{
                  bg: "brand_pink.100",
                }}
                w={"full"}
                onClick={onEditPriceModalOpen}
              >
                <Text bg="button_gradient" bgClip="text">
                  Edit Price
                </Text>
              </Button>
            </Stack>
          );
        } else {
          Component = (
            <Stack py={3}>
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
                onClick={onBuyModalOpen}
              >
                Buy
              </Button>
            </Stack>
          );
        }
      } else if (walletAddress.toLowerCase() === nftDetails.owner_of.toLowerCase()) {
        Component = (
          <Stack py={3} spacing={4}>
            <Stack spacing={4} direction={{ base: "column", md: "row" }} w={"full"}>
              <Button
                color={"white"}
                bg={"button_gradient"}
                size={"lg"}
                fontSize={"md"}
                w={"full"}
                _hover={{
                  bg: "button_gradient_light",
                }}
                _active={{
                  bg: "button_gradient_light",
                }}
                onClick={() => {
                  dispatch(setGiftNftStep(1));
                }}
              >
                Gift
              </Button>
              <Button
                variant={"outline"}
                borderColor={"brand_red.500"}
                size={"lg"}
                fontSize={"md"}
                w={"full"}
                _hover={{
                  bg: "brand_pink.100",
                }}
                onClick={() => {
                  dispatch(setSellNftStep(1));
                }}
              >
                <Text bg="button_gradient" bgClip="text">
                  Sell
                </Text>
              </Button>
            </Stack>
            {nftDetails?.contract_type === "ERC1155" && (
              <Button
                variant={"outline"}
                borderColor={"brand_red.500"}
                size={"lg"}
                fontSize={"md"}
                w={"full"}
                _hover={{
                  bg: "brand_pink.100",
                }}
                onClick={() => {
                  dispatch(setRemintNftStep(1));
                }}
              >
                <Text bg="button_gradient" bgClip="text">
                  Mint More
                </Text>
              </Button>
            )}
          </Stack>
        );
      }
    }

    return Component;
  };

  return (
    <>
      {isCancelListingModalOpen && (
        <CancelListingModal
          isOpen={isCancelListingModalOpen}
          nftDetails={{ ...nftDetails, id: listedDetails.id, seller: listedDetails.seller }}
          onClose={onCancelListingModalClose}
        />
      )}
      {isEditPriceModalOpen && (
        <EditPriceModal
          isOpen={isEditPriceModalOpen}
          nftDetails={{ ...nftDetails, id: listedDetails.id, seller: listedDetails.seller }}
          onClose={onEditPriceModalClose}
        />
      )}
      {isBuyModalOpen && (
        <BuyModal
          isOpen={isBuyModalOpen}
          nftDetails={nftDetails}
          listedDetails={listedDetails}
          onClose={onBuyModalClose}
        />
      )}
      {!isListingLoading && isListed && (
        <Stack
          direction={{ base: "column", lg: "row" }}
          justify={"space-between"}
          align={{ base: "flex-start", lg: "center" }}
          pt={4}
        >
          <Heading fontSize={"sm"}>Last price</Heading>
          <Stack direction={"row"}>
            <Heading fontSize={"xl"}>
              {`${Number(listedDetails.price).toFixed(4)} MATIC `}
              <chakra.span fontSize={"sm"} fontWeight={"400"} color={"gray.500"}>
                {`($${listedDetails.priceInUsd.toLocaleString()})`}
              </chakra.span>
            </Heading>
          </Stack>
        </Stack>
      )}

      {getActionButtons()}

      <Stack border={"1px solid"} borderColor={"gray.200"} borderRadius={"xl"} p={6}>
        <Heading fontSize={"md"}>Description</Heading>
        <Text fontSize={"sm"} color={"gray.500"}>
          {nftDetails.metadata.description}
        </Text>
      </Stack>
      {/* <Box w={"full"} py={3}>
            <Button
              variant={"outline"}
              borderColor={"brand_red.500"}
              size={"lg"}
              fontSize={"md"}
              w={"full"}
              _hover={{
                bg: "brand_pink.100",
              }}
            >
              <Text bg="button_gradient" bgClip="text">
                Edit
              </Text>
            </Button>
          </Box> */}
      <Box pb={3}>
        <Stack border={"1px solid"} borderColor={"gray.200"} borderRadius={"xl"} p={6} spacing={"6"}>
          <Heading fontSize={"md"}>Property</Heading>
          <Stack
            direction={"row"}
            justify={"space-between"}
            fontSize={"sm"}
            borderBottom={"1px solid"}
            borderColor={"gray.400"}
            pb={3}
          >
            <Text>Contact Address</Text>
            <Link href={`https://${process.env.REACT_APP_POLYSCAN_URL}/address/${nftDetails.token_address}`} color={"blue.500"}>
              {`${nftDetails.token_address.slice(0, 6)}...${nftDetails.token_address.slice(-4)}`}
            </Link>
          </Stack>
          <Stack
            direction={"row"}
            justify={"space-between"}
            fontSize={"sm"}
            borderBottom={"1px solid"}
            borderColor={"gray.400"}
            pb={3}
          >
            <Text>Token ID</Text>
            <Text>{`${nftDetails.token_id.slice(0, 5)} ${nftDetails.token_id.length > 5 ? "..." : ""}`}</Text>
          </Stack>
          <Stack
            direction={"row"}
            justify={"space-between"}
            fontSize={"sm"}
            borderBottom={"1px solid"}
            borderColor={"gray.400"}
            pb={3}
          >
            <Text>Token Standard</Text>
            <Text>{nftDetails.contract_type}</Text>
          </Stack>
          {nftDetails?.contract_type === "ERC1155" && (
            <Stack
              direction={"row"}
              justify={"space-between"}
              fontSize={"sm"}
              borderBottom={"1px solid"}
              borderColor={"gray.400"}
              pb={3}
            >
              <Text>Quantity</Text>
              <Text>{nftDetails.amount}</Text>
            </Stack>
          )}
          <Stack
            direction={"row"}
            justify={"space-between"}
            fontSize={"sm"}
            borderBottom={"1px solid"}
            borderColor={"gray.400"}
            pb={3}
          >
            <Text>Blockchain</Text>
            <Text>Polygon</Text>
          </Stack>
          <Stack direction={"row"} justify={"space-between"} fontSize={"sm"}>
            <Text>Creator Fees</Text>
            <Text>2.5%</Text>
          </Stack>
        </Stack>
      </Box>
      {nftDetails.owner_bio && (
        <Stack border={"1px solid"} borderColor={"gray.200"} borderRadius={"xl"} p={6}>
          <Heading fontSize={"md"}>About creator</Heading>
          <Text fontSize={"sm"} color={"gray.500"}>
            {nftDetails.owner_bio}
          </Text>
        </Stack>
      )}
    </>
  );
};

export default Landing;
