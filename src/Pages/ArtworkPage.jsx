import React, { useEffect, useState } from "react";
import { useBoolean, Skeleton, useDisclosure, Spinner } from "@chakra-ui/react";
import { Box, Stack, Heading, Text, Center } from "@chakra-ui/layout";
import { Image } from "@chakra-ui/image";
import { IconButton } from "@chakra-ui/button";
import { FiShare2 } from "react-icons/fi";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { ShareArtworkModal } from "./../components/Common";
import {
  useGetNftMetadata,
  getMetaDataByTokenUri,
} from "./../api/externalService";
import { useGetUserByAddressDelay } from "./../api/userService";
import { getCustomGatewayUrl } from "./../utils/misc";
import { Landing } from "../components/ArtworkPage";

const ArtWorkPage = () => {
  const navigate = useNavigate();
  
  const location = useLocation();

  const { contractAddress = "", tokenId = "" } = useParams();
  const { data: nftMeta } = useGetNftMetadata({
    tokenAddress: contractAddress,
    tokenId,
    chain: process.env.REACT_APP_MORALIS_CHAIN_NAME,
  });
  const [isDetailsLoading, setIsDetailsLoading] = useBoolean(true);
  const [nftDetails, setNftDetails] = useState({});
  console.log(nftDetails)

  const {
    isOpen: isShareModalOpen,
    onClose: onShareModalClose,
    onOpen: onShareModalOpen,
  } = useDisclosure();
  const { mutateAsync: getUserDetails } = useGetUserByAddressDelay();

  const getNftDetails = async () => {
    try {
      setIsDetailsLoading.on();
      const { token_uri, metadata = "{}" } = nftMeta;

      let parsedMetadata = {};
      if (metadata) {
        parsedMetadata = JSON.parse(metadata);
      } else {
        const data = await getMetaDataByTokenUri(token_uri);
        parsedMetadata = data;
      }

      if (parsedMetadata && parsedMetadata?.image) {
        parsedMetadata = {
          ...parsedMetadata,
          image: getCustomGatewayUrl(parsedMetadata.image),
        };
      }

      const { data } = await getUserDetails({
        address: nftMeta.owner_of.toLocaleLowerCase(),
      });
      const { account } = data;
      let owner_name = "";
      let owner_bio = "";
      if (account) {
        owner_name = account?.name || "";
        owner_bio = account?.bio || "";
      }

      setNftDetails({
        ...nftMeta,
        owner_name,
        owner_bio,
        metadata: parsedMetadata,
      });
      setIsDetailsLoading.off();
      console.log({
        ...nftMeta,
        owner_name,
        metadata: parsedMetadata,
      });
    } catch (error) {
      navigate("/not-found");
      console.log({ error });
    }
  };

   console.log(isDetailsLoading)
  useEffect(() => {
    if (contractAddress && tokenId && nftMeta) getNftDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractAddress, tokenId, nftMeta]);

  return (
    <Box w={"full"} flex={1}>
      {isShareModalOpen && (
        <ShareArtworkModal
          isOpen={isShareModalOpen}
          onClose={onShareModalClose}
          shareUrl={`${window?.location?.href}`}
          captionText={"Checkout this Artwork on Miko NFT!!! 🎉"}
          copyUrl={
            `${window?.location?.host || ""}${location.pathname.slice(
              0,
              5
            )}... ${location.pathname.slice(-6)}` || ""
          }
        />
      )}
      <Box
        bg="background_gradient_1"
        pt={{ base: "6", lg: "10" }}
        px={{ base: 4, md: 16 }}
      >
        {isDetailsLoading ? (
          <Stack spacing={10} direction={{ base: "column", lg: "row" }}>
            <Skeleton height="96" width={{ base: "full", lg: "50%" }} />
            <Skeleton height="96" width={{ base: "full", lg: "50%" }} />
          </Stack>
        ) : (
          <Stack
            direction={{ base: "column", lg: "row" }}
            bg={"white"}
            px={{ base: 4, lg: 12 }}
            pt={{ base: 4, lg: 12 }}
            pb={4}
            borderTopRadius={"lg"}
            justify={{ lg: "space-between" }}
          >
            <Box
              borderRadius={"xl"}
              h={"70vh"}
              w={"55%"}
              display={{ base: "none", md: "block" }}
            >
              {nftDetails?.metadata?.image ? (
                <Image
                  src={nftDetails.metadata.image || ""}
                  borderRadius={"inherit"}
                  h="full"
                  w="full"
                  objectFit={"cover"}
                  fallback={<Skeleton height="full" width="full" />}
                  fallbackStrategy={"beforeLoadOrError"}
                />
              ) : (
                <Center h={"full"} flexDirection={"column"} gap={"5"}>
                  <Spinner
                    thickness="4px"
                    speed="0.75s"
                    emptyColor="gray.200"
                    color="brand_pink.900"
                    size="xl"
                  />
                  <Text>Blockchain is still syncing the data</Text>
                </Center>
              )}
            </Box>
            <Stack w={{ lg: "40%" }} spacing={4}>
              <Stack direction={"row"} justify={"space-between"}>
                <Heading
                  fontWeight={"600"}
                  fontSize={{ base: "xl", lg: "3xl" }}
                >
                  {nftDetails.metadata.name}
                </Heading>
                <IconButton
                  borderRadius={"full"}
                  icon={<FiShare2 />}
                  color={"white"}
                  bg={"button_gradient"}
                  size={"sm"}
                  _hover={{
                    bg: "button_gradient_light",
                  }}
                  _active={{
                    bg: "button_gradient_light",
                  }}
                  onClick={onShareModalOpen}
                />
              </Stack>
              <Text fontSize={{ base: "sm", lg: "md" }}>
                {nftDetails.owner_name}
              </Text>
              <Box
                borderRadius={"xl"}
                h={"50vh"}
                display={{ base: "block", md: "none" }}
              >
                <Image
                  src={nftDetails.metadata.image}
                  borderRadius={"inherit"}
                  h="full"
                  w="full"
                />
              </Box>
              <Landing nftDetails={nftDetails}/>
            </Stack>
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default ArtWorkPage;
