import React, { useState, useEffect } from "react";
import { Stack, Text } from "@chakra-ui/layout";
import { Button, IconButton } from "@chakra-ui/button";
import { useBoolean, Input, Textarea } from "@chakra-ui/react";
import { FiX } from "react-icons/fi";
import { Modal, ModalOverlay, ModalContent, ModalFooter, ModalBody } from "@chakra-ui/modal";
import { useSelector } from "react-redux";
import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/form-control";

import { userStateSelector } from "./../../store/slices/user";
import { useUpdateUserDetails } from "./../../api/userService";

const EditNameModal = ({ isOpen, onClose }) => {
  const { mutate: updateUser } = useUpdateUserDetails();
  const userDetails = useSelector(userStateSelector);
  const [isLoading, setIsLoading] = useBoolean(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    setName(userDetails?.name || "");
    setBio(userDetails?.bio || "");
  }, [userDetails?.name, userDetails?.bio]);

  const handleOnConfirm = async () => {
    try {
      setIsLoading.on();
      updateUser({ id:userDetails.id,
        name, bio, address: userDetails.address });
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
            <Text fontWeight={600}>Upload Details</Text>
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
          <Stack>
            <FormControl isInvalid={name === ""}>
              <FormLabel htmlFor="name">Name</FormLabel>
              <Input id="name" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
              <FormErrorMessage>Name should not be empty</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={bio === ""}>
              <FormLabel htmlFor="bio">Bio</FormLabel>
              <Textarea id="bio" placeholder="Bio" value={bio} onChange={(e) => setBio(e.target.value)} />
              <FormErrorMessage>Bio should not be empty</FormErrorMessage>
            </FormControl>
          </Stack>
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
            disabled={
              isLoading || (name === "" && bio === "") || (name === userDetails?.name && bio === userDetails?.bio)
            }
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

export default EditNameModal;
