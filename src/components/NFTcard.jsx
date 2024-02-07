import React from "react";
import PropTypes from "prop-types";
import { Stack, Box, Heading, Text } from "@chakra-ui/layout";
import { Skeleton } from "@chakra-ui/skeleton";
import { Image } from "@chakra-ui/image";

import { getCustomGatewayUrl } from "./../utils/misc";

import maticLogo from "./../Assets/polygon-matic-logo.svg";

const NFTCard = ({ image, name, description, price, showPrice }) => {
  const nftImageUrl = getCustomGatewayUrl(image) || image;

  return (
    <Stack bg={"white"} borderRadius={"xl"} spacing={"4"} h={"full"}>
      <Box
        h={{ base: "52", lg: "80" }}
        px={{ lg: 4 }}
        pt={{ lg: 4 }}
        borderTopRadius={"xl"}
        borderBottomRadius={{ base: "none", lg: "xl" }}
      >
        <Image
          src={nftImageUrl}
          loading={"lazy"}
          fallback={<Skeleton height="full" width="full" />}
          fallbackStrategy={"beforeLoadOrError"}
          h={"full"}
          w={"full"}
          objectFit={"cover"}
          borderTopRadius={"xl"}
        />
      </Box>
      <Stack px={{ base: 2, lg: 4 }} pb={{ base: 2, lg: 4 }} spacing={"2"}>
        <Stack
          direction={{ base: "column", lg: "row" }}
          justify={{ base: showPrice ? "flex-start" : "center", lg: showPrice ? "space-between" : "center" }}
          align={{ base: "start", lg: "center" }}
          order={{ base: 2, lg: 1 }}
          spacing={{ base: 1, lg: 2 }}
        >
          <Heading fontSize={{ base: "sm", lg: "md" }}>{name}</Heading>
          {showPrice && (
            <Stack direction={"row"} align={"center"} fontSize={{ base: "sm", lg: "md" }}>
              <Image src={maticLogo} h={5} w={5} />
              <Text>{Number(price).toFixed(4)}</Text>
            </Stack>
          )}
        </Stack>
        {description && (
          <Text
            order={{ base: 1, lg: 2 }}
            fontSize={{ base: "xs", lg: "sm" }}
            pb={{ base: "2", lg: "0" }}
            color={"gray.500"}
            textAlign={{ base: "left", lg: showPrice ? "left" : "center" }}
          >
            {`${description?.slice(0, 20)} ${description?.length > 20 ? "..." : ""}`}
          </Text>
        )}
      </Stack>
    </Stack>
  );
};

NFTCard.defaultProps = {
  image: "https://images.unsplash.com/photo-1659034637688-5f67d1c6b8e7?w=500",
  name: "Minion Silhouette",
  description: "Silhouette Drops",
  price: "0.028",
  showPrice: true,
};

NFTCard.propTypes = {
  image: PropTypes.string,
  name: PropTypes.string,
  description: PropTypes.string,
  price: PropTypes.string,
  showPrice: PropTypes.bool,
};

export default React.memo(NFTCard);
