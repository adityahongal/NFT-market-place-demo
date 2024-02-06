import React, { useRef, useEffect, useState } from "react";
import { Stack, Heading, Box } from "@chakra-ui/layout";
import { Scrollbar, A11y, Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";

import { useGetAllFeaturedArtists } from "./../../api/userService";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import ArtistsNFTCard from "../ArtistsNFTCard";

const FeaturedArtists = () => {
    const scrollBarRef = useRef(null);
    const [featuredArtists, setFeaturedArtists] = useState([]);
    const { data, isLoading } = useGetAllFeaturedArtists(0, 10);
  
    useEffect(() => {
      if (data) {
        const { Accounts = [] } = data;
        setFeaturedArtists(Accounts);
      }
    }, [data]);
  
    const isCenteredSlidesForDesktop = featuredArtists.length <= 1;
  
    return (
      <>
        {isLoading || featuredArtists.length === 0 ? (
          <></>
        ) : (
          <Stack
            py={{ base: "6", lg: "20" }}
            px={{ base: 4, md: 16 }}
            bg="background_gradient_1"
            align={"center"}
            spacing={{ base: "4", lg: "8" }}
          >
            <Heading color={"gray.900"} fontSize={{ base: "2xl", lg: "4xl" }} textAlign={{ base: "center", lg: "left" }}>
              Featured Artists
            </Heading>
            <Swiper
              style={{ height: "inherit", width: "100%", userSelect: "none" }}
              modules={[Scrollbar, A11y, Autoplay]}
              spaceBetween={50}
              scrollbar={{ draggable: true, el: scrollBarRef.current }}
              grabCursor
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              breakpoints={{
                650: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 20,
                  centeredSlides: isCenteredSlidesForDesktop,
                },
              }}
            >
              {featuredArtists.map((artist, index) => (
                <SwiperSlide key={index}>
                  <Link to={`/artists/${artist.address}`}>
                    <Box cursor={"pointer"}>
                      <ArtistsNFTCard
                        artistName={artist.name}
                        avatar={artist.avatar}
                        nftImage={artist.background_image}
                      />
                    </Box>
                  </Link>
                </SwiperSlide>
              ))}
  
              <Stack w="full" align={"center"} mt={"10"}>
                <Box w={{ base: "100%", md: "40%" }}>
                  <div
                    ref={scrollBarRef}
                    style={{
                      height: "4px",
                      background: "#DFDFDF",
                    }}
                  />
                </Box>
              </Stack>
            </Swiper>
          </Stack>
        )}
      </>
    );
  };
  
  export default FeaturedArtists;
  