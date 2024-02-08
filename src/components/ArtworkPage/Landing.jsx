import React, { useEffect, useState } from "react";
import { Box, Stack, Heading, Text, Link } from "@chakra-ui/layout";
import { chakra, useDisclosure } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useGetListingById } from "./../../api/listingService";
import getMaticPrice from "./../../utils/getMaticPrice";
import { convertMaticToUsd } from "./../../utils/misc";

const Landing = ({ nftDetails }) => {
  const { contractAddress = "", tokenId = "" } = useParams();
  const [listedDetails, setListedDetails] = useState({});
  const [isListed, setIsListed] = useState(false);
  const [isDetailsFetching, setIsDetailsFetching] = useState(true);
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

  return (
    <>
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
              <chakra.span
                fontSize={"sm"}
                fontWeight={"400"}
                color={"gray.500"}
              >
                {`($${listedDetails.priceInUsd.toLocaleString()})`}
              </chakra.span>
            </Heading>
          </Stack>
        </Stack>
      )}
      <Stack
        border={"1px solid"}
        borderColor={"gray.200"}
        borderRadius={"xl"}
        p={6}
      >
        <Heading fontSize={"md"}>Description</Heading>
        <Text fontSize={"sm"} color={"gray.500"}>
          {nftDetails.metadata.description}
        </Text>
      </Stack>
      <Box pb={3}>
        <Stack
          border={"1px solid"}
          borderColor={"gray.200"}
          borderRadius={"xl"}
          p={6}
          spacing={"6"}
        >
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
            <Link
              href={`https://${process.env.REACT_APP_POLYSCAN_URL}/address/${nftDetails.token_address}`}
              color={"blue.500"}
            >
              {`${nftDetails.token_address.slice(
                0,
                6
              )}...${nftDetails.token_address.slice(-4)}`}
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
            <Text>{`${nftDetails.token_id.slice(0, 5)} ${
              nftDetails.token_id.length > 5 ? "..." : ""
            }`}</Text>
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
        <Stack
          border={"1px solid"}
          borderColor={"gray.200"}
          borderRadius={"xl"}
          p={6}
        >
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
