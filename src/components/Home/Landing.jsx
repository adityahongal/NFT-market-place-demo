import React, { useEffect, useState, memo, useCallback } from "react";
import { Stack, Heading, Text, Flex, Box, Circle } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { Image } from "@chakra-ui/image";
import { useSelector } from "react-redux";
// import { Scrollbar, A11y, Autoplay } from "swiper";
// import { Swiper, SwiperSlide } from "swiper/react";
import { FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@chakra-ui/react";


const Landing = () => {
    const navigate = useNavigate();
    // const { headerText = "", subHeaderText = "" } = useSelector(selectHomePage);
    // const { data: featuredArtWorks = [] } = useGetFeaturedListings();
  
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
          NFT Market makes NFTs Easy for everyone
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
          {/* {featuredArtWorks.length > 0 && <FeaturedArtsSlider featuredArtWorks={featuredArtWorks} />} */}
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
            Explore Miko NFTs
          </Button>
        </Stack>
      </Stack>
    );
  };

  export default memo(Landing);