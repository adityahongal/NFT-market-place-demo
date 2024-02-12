import React, { useEffect, useState } from "react";
import { Stack, Box, Heading, Link, Text, SimpleGrid } from "@chakra-ui/layout";
import { IconButton } from "@chakra-ui/button";
import { Image } from "@chakra-ui/image";
import { Tooltip } from "@chakra-ui/tooltip";
import { useBoolean, Skeleton, useDisclosure } from "@chakra-ui/react";
import { FaEthereum } from "react-icons/fa";
import { FiCopy, FiShare2, FiEdit2, FiEdit3 } from "react-icons/fi";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import isEmpty from "lodash/isEmpty";
import axios from "axios";

import { ShareArtworkModal } from "./../components/Common";
import { UploadImageModal, EditNameModal } from "./../components/Settings";
import { useGetNftsBalance } from "./../api/externalService";
import { userStateSelector } from "./../store/slices/user";
import NFTCard from "../components/NFTcard";

const Profile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [imageUploadContext, setImageUploadContext] = useState("");
  const [isNftLoading, setIsNftLoading] = useBoolean(true);
  const {
    isOpen: isShareModalOpen,
    onClose: onShareModalClose,
    onOpen: onShareModalOpen,
  } = useDisclosure();
  const [nftData, setNftData] = useState([]);
  const {
    isOpen: isUploadImageModalOpen,
    onClose: onUploadImageModalClose,
    onOpen: onUploadImageModalOpen,
  } = useDisclosure();
  const {
    isOpen: isEditNameModalOpen,
    onClose: onEditNameModalClose,
    onOpen: onEditNameModalOpen,
  } = useDisclosure();
  const {
    wallet = {},
    loggedIn,
    loading: isWalletLoading,
  } = useSelector((state) => state.wallet);
  const { address = "" } = wallet;
  const { data: nftBalances, isLoading } = useGetNftsBalance({
    address: address,
    chain: process.env.REACT_APP_MORALIS_CHAIN_NAME,
  });

  const userDetails = useSelector(userStateSelector);

  const formattedNftData = async (data) => {
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
    setIsNftLoading.off();
    setNftData(formattedData);
  };

  useEffect(() => {
    if (address && !isEmpty(nftBalances)) {
      const { result = [] } = nftBalances || {};
      formattedNftData(result);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, isLoading, nftBalances]);

  useEffect(() => {
    if (!isWalletLoading && !loggedIn)
      navigate("/connect-wallet", {
        state: {
          redirectedFrom: location?.pathname || "",
        },
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWalletLoading]);

  const shareUrl = `${window?.location?.origin}/artists/${address}`;
  const pathname = `artists/${address}`;
  const copyUrl = `${window?.location?.host}/${pathname.slice(
    0,
    5
  )}...${pathname.slice(-6)}`;

  return (
    <Box w={"full"} flex={1}>
      {!isWalletLoading && (
        <Box>
          {isUploadImageModalOpen && (
            <UploadImageModal
              isOpen={isUploadImageModalOpen}
              onClose={onUploadImageModalClose}
              context={imageUploadContext}
            />
          )}
          {isEditNameModalOpen && (
            <EditNameModal
              isOpen={isEditNameModalOpen}
              onClose={onEditNameModalClose}
            />
          )}
          {isShareModalOpen && (
            <ShareArtworkModal
              isOpen={isShareModalOpen}
              onClose={onShareModalClose}
              shareUrl={shareUrl || ""}
              captionText={"Checkout this Profile on Miko NFT!!! 🎉"}
              copyUrl={copyUrl || ""}
            />
          )}
          <Box
            h={"30vh"}
            borderTopRadius={"xl"}
            pos={"relative"}
            cursor={"pointer"}
          >
            <Image
              src={userDetails?.background_image || ""}
              fallbackStrategy={"beforeLoadOrError"}
              fallbackSrc={
                "https://images.unsplash.com/photo-1642370324100-324b21fab3a9?w=500"
              }
              h={"full"}
              w={"full"}
              objectFit={"cover"}
            />
            <Stack
              pos={"absolute"}
              top={0}
              left={0}
              bg={"black"}
              h={"30vh"}
              w={"full"}
              opacity={0}
              borderTopRadius={"xl"}
              _hover={{ opacity: 0.9 }}
              transition={"all 0.2s linear"}
              justify={"center"}
              align={"center"}
              onClick={() => {
                setImageUploadContext("cover");
                onUploadImageModalOpen();
              }}
            >
              <Stack direction={"row"} color={"white"} align={"center"}>
                <FiEdit2 /> <Text>Edit</Text>
              </Stack>
            </Stack>
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
                src={userDetails?.avatar || ""}
                fallbackStrategy={"beforeLoadOrError"}
                fallbackSrc={`https://api.dicebear.com/7.x/identicon/svg?seed=${wallet?.address}`}
                h={"full"}
                w={"full"}
                borderRadius={"full"}
                objectFit={"cover"}
              />
            </Box>
            <Stack
              borderRadius={"full"}
              h={"28"}
              w={"28"}
              border={"5px solid #FFFFFF"}
              pos={"absolute"}
              top={"-14"}
              bg={"black"}
              opacity={0}
              _hover={{ opacity: 0.9 }}
              transition={"all 0.2s linear"}
              cursor={"pointer"}
              justify={"center"}
              align={"center"}
              onClick={() => {
                setImageUploadContext("avatar");
                onUploadImageModalOpen();
              }}
            >
              <Stack
                direction={"row"}
                color={"white"}
                align={"center"}
                fontSize={"sm"}
              >
                <FiEdit2 /> <Text fontSize={"sm"}>Edit</Text>
              </Stack>
            </Stack>
            <Stack py={20} spacing={6}>
              <Stack direction={"row"} justify={"space-between"}>
                <Stack>
                  <Stack justify={"start"} align={"center"} direction={"row"}>
                    <Heading fontSize={"2xl"}>
                      {userDetails?.name || ""}
                    </Heading>
                    <Tooltip label={"Edit Name and bio"} hasArrow>
                      <IconButton
                        icon={<FiEdit3 />}
                        borderRadius={"full"}
                        size={"xs"}
                        variant={"ghost"}
                        onClick={onEditNameModalOpen}
                      />
                    </Tooltip>
                  </Stack>
                  <Stack direction={"row"} align={"center"}>
                    <FaEthereum />
                    <Link
                      color={"blue.400"}
                      fontWeight={600}
                      href={`https://${process.env.REACT_APP_POLYSCAN_URL}/address/${address}`}
                      target={"_blank"}
                    >
                      {`${address.slice(0, 6)}...${address.slice(-4)}`}
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
                            navigator.clipboard.writeText(address);
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
                <Text
                  fontWeight={"700"}
                >{`Collected (${nftData.length})`}</Text>
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
                      const { metadata = {}, token_address, token_id } = nft;
                      const {
                        name = "",
                        description = "",
                        image = "",
                      } = metadata;
                      return (
                        <>
                          <RouterLink
                            key={index}
                            to={`/nft/${token_address}/${token_id}`}
                          >
                            <NFTCard
                              key={index}
                              name={name}
                              description={description}
                              image={image}
                              showPrice={false}
                            />
                          </RouterLink>
                        </>
                      );
                    })}
              </SimpleGrid>
            </Stack>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Profile;
