import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Stack, Box, Heading, Link, Text, SimpleGrid } from "@chakra-ui/layout";
import { IconButton } from "@chakra-ui/button";
import { Image } from "@chakra-ui/image";
import { Tooltip } from "@chakra-ui/tooltip";
import { useBoolean, Skeleton, useDisclosure } from "@chakra-ui/react";
import { FaEthereum } from "react-icons/fa";
import { FiCopy, FiShare2 } from "react-icons/fi";
import { Link as RouterLink } from "react-router-dom";
import axios from "axios";

import { useGetNftsBalance } from "./../api/externalService";
import { useGetUserByAddress } from "./../api/userService";
import { useGetUserListings } from "./../api/listingService";
import NFTCard from "../components/NFTcard";
import { ShareArtworkModal } from "./../components/Common";

// import searchIcon from "./../assets/ic_search.svg";
// import sortIcon from "./../assets/ic_sort.svg";
import { isEmpty } from "lodash";

const ArtistProfilePage = () => {
  const { artistId = "" } = useParams();
  const location = useLocation();
  const [isNftLoading, setIsNftLoading] = useBoolean(true);
  const [nftData, setNftData] = useState([]);
  const { data: artistDetails } = useGetUserByAddress({ address: artistId });
  const { data: nftBalances, isLoading } = useGetNftsBalance({
    address: artistId,
    chain: process.env.REACT_APP_MORALIS_CHAIN_NAME,
  });
  const { data: listings } = useGetUserListings({ address: artistId });
  const {
    isOpen: isShareModalOpen,
    onClose: onShareModalClose,
    onOpen: onShareModalOpen,
  } = useDisclosure();

  const checkIsNftListed = async (nftsArr) => {
    const nftData = nftsArr.map(async (nft) => {
      const { token_address, token_id } = nft;
      const result = listings.find(
        (listing) =>
          listing.tokenAddress === token_address &&
          Number(listing.tokenId) === Number(token_id)
      );
      let isListed = false;
      let listingPrice = 0;
      if (result) {
        isListed = true;
        listingPrice = result.price;
      }
      if (isListed) {
        return { ...nft, listingPrice };
      } else {
        return nft;
      }
    });
    Promise.all(nftData).then((data) => {
      setIsNftLoading.off();
      setNftData(data);
    });
  };

  const formattedNftData = (data) => {
    setIsNftLoading.on();
    const formattedData = [];
    data.forEach(async (nft) => {
      const {
        contract_type,
        metadata,
        owner_of,
        token_address,
        token_id,
        token_uri,
      } = nft || {};
      let parsedMetadata = {};
      if (metadata) {
        parsedMetadata = JSON.parse(metadata);
      }
      if (!isEmpty(parsedMetadata)) {
        formattedData.push({
          contract_type,
          owner_of,
          token_address,
          token_id,
          metadata: parsedMetadata,
        });
      } else {
        const response = await axios.get(token_uri);
        const data = response.data;
        if (data && Object.keys(data).length > 0) {
          formattedData.push({
            contract_type,
            owner_of,
            token_address,
            token_id,
            metadata: data,
          });
        }
      }
    });
    checkIsNftListed(formattedData);
  };

  useEffect(() => {
    if (artistId && !isEmpty(nftBalances)) {
      const { result = [] } = nftBalances || {};
      formattedNftData(result);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artistId, isLoading, nftBalances, listings]);

  return (
    <Box w={"full"} flex={1}>
      {isShareModalOpen && (
        <ShareArtworkModal
          isOpen={isShareModalOpen}
          onClose={onShareModalClose}
          shareUrl={`${window?.location?.href}`}
          captionText={"Checkout this Profile on Miko NFT!!! 🎉"}
          copyUrl={
            `${window?.location?.host || ""}${location.pathname.slice(
              0,
              5
            )}... ${location.pathname.slice(-6)}` || ""
          }
        />
      )}
      <Box h={"30vh"}>
        <Image
          src={(artistDetails && artistDetails?.background_image) || ""}
          fallbackSrc={
            "https://images.unsplash.com/photo-1642370324100-324b21fab3a9?w=500"
          }
          h={"full"}
          w={"full"}
          objectFit={"cover"}
        />
      </Box>
      <Box
        pos={"relative"}
        px={{ base: 4, md: 16 }}
        bg={"background_gradient_1"}
      >
        <Box
          borderRadius={"full"}
          h={"28"}
          w={"28"}
          border={"5px solid #FFFFFF"}
          pos={"absolute"}
          top={"-14"}
          bg={"white"}
        >
          <Image
            src={(artistDetails && artistDetails?.avatar) || ""}
            fallbackSrc={`https://api.dicebear.com/7.x/identicon/svg?seed=abc`}
            h={"full"}
            w={"full"}
            borderRadius={"full"}
            objectFit={"cover"}
          />
        </Box>
        <Stack py={20} spacing={6}>
          <Stack direction={"row"} justify={"space-between"}>
            <Stack>
              <Heading fontSize={"2xl"}>
                {(artistDetails && artistDetails.name) || ""}
              </Heading>
              <Stack direction={"row"} align={"center"}>
                <FaEthereum />
                <Link color={"blue.400"} fontWeight={600}>
                  {`${artistId.slice(0, 6)}...${artistId.slice(-4)}`}
                </Link>
                <Tooltip
                  borderRadius={"lg"}
                  bg={"#484848"}
                  hasArrow
                  label={
                    <Stack py={2} px={"1"}>
                      <Heading as={"h6"} fontSize={"md"} color={"white"}>
                        Copy Address
                      </Heading>
                      <Text fontSize={"sm"} fontWeight={400}>
                        Copy your addresss to receive artwork NFTs.
                      </Text>
                    </Stack>
                  }
                >
                  <Box
                    cursor={"pointer"}
                    onClick={() => {
                      if (navigator) {
                        navigator.clipboard.writeText(artistId);
                      }
                    }}
                  >
                    <FiCopy />
                  </Box>
                </Tooltip>
              </Stack>
            </Stack>
            <Stack direction={"row"} spacing={4}>
              <IconButton
                icon={<FiShare2 />}
                borderRadius={"full"}
                bg={"transparent"}
                size={"sm"}
                _hover={{
                  bg: "button_gradient",
                  color: "white",
                }}
                onClick={onShareModalOpen}
              />
            </Stack>
          </Stack>
          <Stack
            direction={"row"}
            justify={"space-between"}
            align={"center"}
            bg={"white"}
            p={4}
            borderRadius={"xl"}
          >
            <Text fontWeight={"700"}>{`Collected (${nftData.length})`}</Text>
          </Stack>
          {!isNftLoading && nftData.length === 0 && (
            <Stack>
              <Text>Looks Like you do not have any NFTs</Text>
            </Stack>
          )}
          <SimpleGrid
            columns={{ base: "2", lg: "3" }}
            spacing={{ base: "3", lg: "10" }}
          >
            {isNftLoading
              ? [...Array(6)].map((_, index) => (
                  <Skeleton key={index} h="80" borderRadius={"xl"} />
                ))
              : nftData.map((nft, index) => {
                  const {
                    metadata = {},
                    token_address,
                    token_id,
                    listingPrice,
                  } = nft;
                  const { name = "", description = "", image = "" } = metadata;
                  return (
                    <RouterLink
                      key={index}
                      to={`/nft/${token_address}/${token_id}`}
                    >
                      <NFTCard
                        key={index}
                        name={name}
                        description={description}
                        image={image}
                        showPrice={listingPrice ? true : false}
                        price={listingPrice}
                      />
                    </RouterLink>
                  );
                })}
          </SimpleGrid>
        </Stack>
      </Box>
    </Box>
  );
};

export default ArtistProfilePage;
