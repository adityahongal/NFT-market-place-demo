import React, { useState } from "react";
import { Stack, Heading } from "@chakra-ui/layout";
import { Image } from "@chakra-ui/image";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  LoggedInView,
  NonLoggedInView,
  UploadImageView,
} from "../components/MintArtWork";

import placeHolderImage from "../Assets/placeholder-image.png";

const MintArtwork = () => {
  const { loggedIn } = useSelector((state) => state.wallet);
  const remoteMintHeaderText = "Upload the artwork's image to start minting!";
   const localMintHeaderText = "You’re just one step away from minting your artwork!";
   const subHeaderText = "Mint Artwork";
  const { imageHash = "" } = useParams();
  const [localImage, setLocalImage] = useState(placeHolderImage);

  return (
    <Stack
      bg="background_gradient_1"
      py={{ base: "6", lg: "10" }}
      px={{ base: 4, md: 16 }}
      spacing={{ base: "6", lg: "10" }}
      align={"center"}
      w={"full"}
      flex={1}
    >
      <Heading
        textAlign={{ base: "center" }}
        w={{ base: "full", lg: "40%" }}
        fontSize={{ base: "2xl", lg: "4xl" }}
      >
        {imageHash ? remoteMintHeaderText : localMintHeaderText}
      </Heading>
      <Stack
        bg={"white"}
        p={{ base: 4, lg: 8 }}
        borderRadius={"xl"}
        direction={{ base: "column", lg: "row" }}
        w={{ base: "full", lg: "65%" }}
        spacing={10}
        align={imageHash && "center"}
      >
        <Image
          src={imageHash ? `https://ipfs.io/ipfs/${imageHash}` : localImage}
          borderRadius={"xl"}
          w={"80"}
          maxH={"60vh"}
          loading="eager"
        />
        <Stack justify={"center"} spacing={6} w={"full"}>
          <Heading fontSize={"xl"}>{subHeaderText}</Heading>
          {loggedIn ? (
            imageHash ? (
              <LoggedInView />
            ) : (
              <UploadImageView setLocalImage={setLocalImage} />
            )
          ) : (
            <NonLoggedInView />
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default MintArtwork;
