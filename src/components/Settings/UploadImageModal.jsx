import React, { useState } from "react";
import { Stack, Text } from "@chakra-ui/layout";
import { Button, IconButton } from "@chakra-ui/button";
import { useBoolean } from "@chakra-ui/react";
import { FiX } from "react-icons/fi";
import { Modal, ModalOverlay, ModalContent, ModalFooter, ModalBody } from "@chakra-ui/modal";
import { useSelector } from "react-redux";
import ImageUploading from "react-images-uploading";

import { userStateSelector } from "./../../store/slices/user";
import { useUpdateUserDetails } from "./../../api/userService";
import IPFS from "./../../utils/InfuraIPFSConnector";

const UploadImageModal = ({ isOpen, onClose, context }) => {
  const { mutate: updateUser } = useUpdateUserDetails();
  const userDetails = useSelector(userStateSelector);
  const [isLoading, setIsLoading] = useBoolean(false);
  const [images, setImages] = useState([]);

  const onChange = (imageList, addUpdateIndex) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };

  const handleOnConfirm = async () => {
    try {
      setIsLoading.on();
      const base64Response = await fetch(images[0].data_url);
      const blob = await base64Response.blob();
      const file = await blob.arrayBuffer();
      const imageres = await IPFS.add(file, { pin: true });
      const imagePath = "https://miko.infura-ipfs.io/ipfs/" + imageres.path;

      if (context === "avatar") {
        updateUser({ id:userDetails.id, avatar: imagePath, address: userDetails.address });
      } else if (context === "cover") {
        updateUser({ id:userDetails.id, background_image: imagePath, address: userDetails.address });
      }

      console.log({
        imagePath,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading.off();
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <Stack direction={"row"} justify={"space-between"} pt={"4"} px={4}>
          <Stack align={"center"} flex={1} justify={"center"}>
            <Text fontWeight={600}>Upload Image</Text>
          </Stack>
          <IconButton
            bg={"button_gradient"}
            size={"xs"}
            color={"white"}
            borderRadius={"full"}
            icon={<FiX />}
            _hover={{ bg: "button_gradient_light" }}
            onClick={onClose}
          />
        </Stack>
        <ModalBody>
          <ImageUploading value={images} onChange={onChange} maxNumber={1} dataURLKey="data_url">
            {({ imageList, onImageUpload, onImageRemoveAll, onImageUpdate, onImageRemove, isDragging, dragProps }) => (
              // write your building UI
              <Stack align={"center"} mt={"4"}>
                {imageList.length === 0 && (
                  <Button
                    variant={"outline"}
                    w={"full"}
                    h={"32"}
                    border={"2px dashed"}
                    borderRadius={"lg"}
                    borderColor={isDragging ? "red.600" : "red.300"}
                    onClick={onImageUpload}
                    {...dragProps}
                  >
                    <Text fontWeight={400}>Click or Drop here</Text>
                  </Button>
                )}

                {imageList.map((image, index) => (
                  <div key={index} className="image-item">
                    <img src={image["data_url"]} alt="" width="100" />
                  </div>
                ))}
              </Stack>
            )}
          </ImageUploading>
        </ModalBody>

        <ModalFooter>
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
            loadingText={"Updating..."}
            isLoading={isLoading}
            onClick={handleOnConfirm}
          >
            Update
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UploadImageModal;
