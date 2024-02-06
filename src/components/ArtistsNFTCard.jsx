import React from "react";
import PropTypes from "prop-types";
import { Stack, Text, Box, Flex } from "@chakra-ui/layout";
import { Skeleton, Image } from "@chakra-ui/react";
import { v4 as uuidv4 } from "uuid";

import { getCustomGatewayUrl } from "./../utils/misc";

const Avatar = ({ src, size, ...props }) => {
    const randomString = uuidv4(10);
  
    return (
      <Box h={size} w={size} {...props} borderRadius="full" bg={"white"}>
        <Image
          src={src}
          loading={"lazy"}
          fallbackStrategy={"beforeLoadOrError"}
          fallbackSrc={`https://api.dicebear.com/7.x/identicon/svg?seed=${randomString}`}
          h={"full"}
          w={"full"}
          borderRadius={"full"}
          objectFit={"cover"}
        />
      </Box>
    );
  };

const ArtistsNFTCard = ({ artistName, avatar, nftImage }) => {
    const avaratUrl = getCustomGatewayUrl(avatar) || avatar;
    const nftImageUrl = getCustomGatewayUrl(nftImage) || nftImage;
  
    return (
      <Stack spacing={0}>
        <Box h={"80"} w={"full"} bg={"gray.400"} borderTopRadius={"xl"}>
          <Image
            src={nftImageUrl}
            loading={"lazy"}
            fallbackStrategy={"beforeLoadOrError"}
            fallback={<Skeleton h={"80"} w={"full"} />}
            fall
            h={"full"}
            w={"full"}
            borderTopRadius={"xl"}
            objectFit={"cover"}
          />
        </Box>
        <Flex
          bg={"background_grdient_2"}
          justify={"center"}
          align={"center"}
          pos={"relative"}
          py={"6"}
          borderBottomEndRadius={"xl"}
          borderBottomStartRadius={"xl"}
        >
          <Avatar
            src={avaratUrl}
            pos={"absolute"}
            left={"4"}
            top={"-10"}
            border={"2px solid white"}
            size={"20"}
          />
          <Text fontWeight={"500"}>{artistName}</Text>
        </Flex>
      </Stack>
    );
  };
  
  ArtistsNFTCard.propTypes = {
    artistName: PropTypes.string,
    avatar: PropTypes.string,
    nftImage: PropTypes.string,
  };
  
  ArtistsNFTCard.defaultProps = {
    artistName: "",
    avatar: "",
    nftImage: "",
  };
  
  export default React.memo(ArtistsNFTCard);