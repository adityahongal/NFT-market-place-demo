import React, { useState } from "react";
import PropTypes from "prop-types";
import { Stack, Text } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { useBoolean } from "@chakra-ui/react";
import ImageUploading from "react-images-uploading";
import { useNavigate } from "react-router-dom";

import IPFS from "./../../utils/InfuraIPFSConnector";

const UploadImageView = ({ setLocalImage }) => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useBoolean(false);
  const navigate = useNavigate();

  const onChange = (imageList, addUpdateIndex) => {
    console.log(imageList, addUpdateIndex);
    const image = imageList[imageList.length - 1];
    setLocalImage(image.data_url);
    setImages([image]);
  };

  const handleOnConfirm = async () => {
    try {
      setIsLoading.on();
      const base64Response = await fetch(images[0].data_url);
      const blob = await base64Response.blob();
      const file = await blob.arrayBuffer();
      const imageres = await IPFS.add(file, { pin: true });
      if (imageres.path) navigate(`/mint/${imageres.path}`);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading.off();
    }
  };

  return (
    <Stack h={"100%"}>
      <ImageUploading value={images} onChange={onChange} maxNumber={1} dataURLKey="data_url" multiple={false}>
        {({ imageList, onImageUpload, onImageRemoveAll, onImageUpdate, onImageRemove, isDragging, dragProps }) => (
          <Stack align={"center"} h={"full"} flex={1}>
            <Button
              variant={"outline"}
              w={"full"}
              h={"full"}
              border={"2px dashed"}
              borderRadius={"lg"}
              borderColor={isDragging ? "red.600" : "red.300"}
              onClick={imageList.length > 1 ? onImageUpload : onImageUpdate}
              {...dragProps}
            >
              <Text fontWeight={400}>Click or Drop your artwork here</Text>
            </Button>
          </Stack>
        )}
      </ImageUploading>
      <Stack pt={4}>
        <Button
          w={"full"}
          color={"white"}
          bg={"button_gradient"}
          size={"lg"}
          fontSize={"md"}
          _hover={{
            bg: "button_gradient_light",
          }}
          _active={{
            bg: "button_gradient_light",
          }}
          disabled={isLoading || images.length === 0}
          loadingText={"Uploading..."}
          isLoading={isLoading}
          onClick={handleOnConfirm}
        >
          Upload Artwork
        </Button>
      </Stack>
    </Stack>
  );
};

UploadImageView.propTypes = {
  setLocalImage: PropTypes.func,
};

export default UploadImageView;
