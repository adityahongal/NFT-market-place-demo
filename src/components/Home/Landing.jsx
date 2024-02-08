import React, { useEffect, useState, memo, useCallback } from "react";
import { Stack, Heading, Text, Flex, Box, Circle } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { Image } from "@chakra-ui/image";
import { useSelector } from "react-redux";
import { Scrollbar, A11y, Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@chakra-ui/react";

import { getCustomGatewayUrl } from "./../../utils/misc";
import { getMetaDataMoralis } from "./../../api/externalService";
import { useGetFeaturedListings } from "./../../api/listingService";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const SliderCard = ({ title, imageSrc }) => {
    const imageUrl = getCustomGatewayUrl(imageSrc) || imageSrc;
  
    return (
      <Box h={"full"} w={"full"} pb={10}>
        <Box h={"full"} w={"full"} pos={"relative"}>
          <Image
            h={"full"}
            w={"full"}
            borderRadius={"xl"}
            src={imageUrl}
            fallbackStrategy="beforeLoadOrError"
            fallback={<Skeleton h={"full"} w={"full"} borderRadius={"xl"} />}
            objectFit={"cover"}
          />
          <Heading pos={"absolute"} bottom={"8"} left={"8"} fontSize={"xl"} color={"white"}>
            {title}
          </Heading>
        </Box>
      </Box>
    );
  };

  const FeaturedArtsSlider = ({ featuredArtWorks = [] }) => {
    const navigate = useNavigate();
  const [featuredListings, setFeaturedListings] = useState([]);

  const formatArtWorksData = (artWorks) => {
    const formattedArtWorks =
      artWorks
        .map((data) => {
          const { metadata } = data;
          if (metadata) {
            const parsedMetadata = JSON.parse(metadata);
            if (!parsedMetadata) return null;
            const { image, name } = parsedMetadata;
            return {
              imageSrc: image,
              title: name,
            };
          } else {
            return null;
          }
        })
        .filter((artWork) => artWork !== null) || [];
    setFeaturedListings(formattedArtWorks);
  };

  const getAllMetadata = useCallback(async () => {
    const nftMetadatas = featuredArtWorks.map(async (nft) => await getMetaDataMoralis(nft.tokenAddress, nft.tokenId));
    const resolvedNftMetadatas = await Promise.all(nftMetadatas);
    formatArtWorksData(resolvedNftMetadatas);
  }, [featuredArtWorks]);

  useEffect(() => {
    // formatArtWorksData(nftMetadatas);
    getAllMetadata();
  }, [getAllMetadata]);

    return (
      <>
        <Stack h={{ base: "lg", lg: "96" }} order={{ base: "2", lg: "1" }}>
          <Swiper
            style={{ height: "inherit", width: "100%", userSelect: "none" }}
            modules={[Scrollbar, A11y, Autoplay]}
            spaceBetween={50}
            slidesPerView={1}
            scrollbar={{ draggable: true }}
            grabCursor
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
          >
            {featuredListings.map(({ title = "", imageSrc = "" }, index) => (
              <SwiperSlide key={index}>
                <SliderCard title={title} imageSrc={imageSrc} />
              </SwiperSlide>
            ))}
          </Swiper>
        </Stack>
      </>
    );
  };

const Landing = () => {
    const navigate = useNavigate();
    // const { headerText = "", subHeaderText = "" } = useSelector(selectHomePage);
    const { data: featuredArtWorks = [] } = useGetFeaturedListings();
  
    return (
      <Stack
        direction={{ base: "column", lg: "row" }}
        py={{ base: "6", lg: "20" }}
        px={{ base: 4, md: 16 }}
        align={"center"}
        bg="background_gradient_1"
        justify={"space-between"}
      >
        <Stack w={{ base: "100%", lg: "50%" }} spacing={6}>
          <Heading color={"gray.900"} fontSize={{ base: "4xl", lg: "6xl" }} textAlign={{ base: "center", lg: "left" }}>
          Our Market makes NFTs Easy for everyone
          </Heading>
          <Text color={"gray.500"} textAlign={{ base: "center", lg: "left" }} fontSize={{ base: "sm", lg: "md" }}>
          🚀 Discover the largest NFT market place, we provide many NFT with the best quality and various variants for you.
          </Text>
          <Flex pt={4} display={{ base: "none", lg: "block" }}>
            <Button
              size={"lg"}
              variant={"solid"}
              fontSize={"md"}
              color={"white"}
              bg={"button_gradient"}
              _hover={{
                bg: "button_gradient_light",
              }}
              _active={{
                bg: "button_gradient_light",
              }}
              onClick={() => navigate("/artists")}
            >
              Explore More NFTs
            </Button>
          </Flex>
        </Stack>
        <Stack w={{ base: "100%", lg: "35%" }} spacing={8}>
          {featuredArtWorks.length > 0 && <FeaturedArtsSlider featuredArtWorks={featuredArtWorks} />}
          <Button
            size={"lg"}
            variant={"solid"}
            fontSize={"md"}
            color={"white"}
            bg={"button_gradient"}
            _hover={{
              bg: "button_gradient_light",
            }}
            _active={{
              bg: "button_gradient_light",
            }}
            order={{ base: 3 }}
            display={{ lg: "none" }}
          >
            Explore NFTs
          </Button>
        </Stack>
      </Stack>
    );
  };

  export default memo(Landing);

  // 