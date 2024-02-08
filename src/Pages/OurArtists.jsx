import React, { useState, useEffect } from "react";
import {
  Stack,
  Heading,
  SimpleGrid,
  Flex,
  Text,
  Center,
} from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import { FaChevronRight } from "react-icons/fa";
import { Link, useSearchParams, useNavigate } from "react-router-dom";

import { useGetAllArtists } from "../api/userService";
import ArtistsNFTCard from "../components/ArtistsNFTCard";

const Pagination = ({ currentPage, totalPages }) => {
    const [pageCount, setPageCount] = useState([]);
  
    const generateCountArray = () => {
      const countArray = [];
      for (let i = 1; i <= totalPages; i++) {
        if (i < 4) countArray.push(i);
        else break;
      }
      if (totalPages > 4) {
        countArray.push("...");
        countArray.push(totalPages);
      }
      return countArray;
    };
  
    useEffect(() => {
      setPageCount(generateCountArray());
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, totalPages]);
  
    return (
      <Flex justify={"center"} pt={8}>
        <Stack direction={"row"}>
          {totalPages > 1 &&
            pageCount.map((page, index) => {
              const isCurrentPage = index + 1 === Number(currentPage);
              const bgColor = isCurrentPage ? "button_gradient" : "transparent";
              const textColor = isCurrentPage ? "white" : "black";
              const borderColor = isCurrentPage ? "transparent" : "black";
              const cursorStyle =
                isCurrentPage || page === "..." ? "default" : "pointer";
              const hoverStyles = isCurrentPage
                ? {}
                : page !== "..." && { bg: "brand_pink.100" };
  
              return (
                <a
                  href={
                    page !== "..." && page !== 1
                      ? `/artists?page=${Number(page)}`
                      : `/artists`
                  }
                >
                  <Flex
                    bg={bgColor}
                    h={"10"}
                    w={"10"}
                    justify={"center"}
                    align={"center"}
                    borderRadius={"xl"}
                    border={"1px solid"}
                    borderColor={borderColor}
                    cursor={cursorStyle}
                    _hover={hoverStyles}
                  >
                    <Text color={textColor} fontWeight={700}>
                      {page}
                    </Text>
                  </Flex>
                </a>
              );
            })}
          {totalPages > 1 && currentPage !== totalPages && (
            <a href={`/artists?page=${Number(currentPage) + 1}`}>
              <Flex
                bg={"button_gradient"}
                h={"10"}
                w={"10"}
                justify={"center"}
                align={"center"}
                borderRadius={"xl"}
                border={"1px solid"}
                borderColor={"transparent"}
                cursor={"pointer"}
              >
                <Text color={"white"}>
                  <FaChevronRight />
                </Text>
              </Flex>
            </a>
          )}
        </Stack>
      </Flex>
    );
  };

const OurArtists = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentPage = searchParams.get("page") || 1;
  const [artistDetails, setArtistDetails] = useState([]);
  const { data, isLoading } = useGetAllArtists(currentPage - 1);

  useEffect(() => {
    if (data) {
      const { Accounts = [], totalPages = 1 } = data;
      if (currentPage > totalPages) navigate(`/artists`);
      setArtistDetails(Accounts);
    }
  }, [currentPage, data, navigate]);

    return (
        <Stack
      bg="background_gradient_1"
      py={{ base: "6", lg: "10" }}
      px={{ base: 4, md: 16 }}
      spacing={{ base: "6", lg: "10" }}
      w={"full"}
      flex={1}
    >
      <Stack
        direction={{ base: "column", lg: "row" }}
        justify={"space-between"}
      >
        <Heading textAlign={{ base: "center", lg: "left" }}>
          Explore Our Market Artists
        </Heading>
      </Stack>
      {isLoading ? (
        <Center py={50}>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="brand_red.500"
            size="xl"
          />
        </Center>
      ) : (
        <>
          <SimpleGrid columns={{ base: "1", md: "2", lg: "3" }} spacing={16}>
            {artistDetails.map((artist, index) => (
              <Link to={`/artists/${artist.address}`}>
                <ArtistsNFTCard
                  key={index}
                  artistName={artist.name}
                  avatar={artist.avatar}
                  nftImage={artist.background_image}
                />
              </Link>
            ))}
          </SimpleGrid>
          <Pagination
            currentPage={Number(currentPage)}
            totalPages={Number(data?.totalPages || 1)}
          />
        </>
      )}
    </Stack>
    );
};

export default OurArtists;