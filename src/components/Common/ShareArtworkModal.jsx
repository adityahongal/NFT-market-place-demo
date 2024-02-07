import React from "react";
import PropTypes from "prop-types";
import { Modal, ModalOverlay, ModalContent, ModalFooter, ModalBody } from "@chakra-ui/modal";
import { Button, IconButton } from "@chakra-ui/button";
import { Stack, Text } from "@chakra-ui/layout";
import { useLocation } from "react-router-dom";
import { useBoolean } from "@chakra-ui/react";
import { FiX, FiCopy } from "react-icons/fi";
import { FaFacebookF, FaTwitter } from "react-icons/fa";
import { FacebookShareButton, TwitterShareButton } from "react-share";

const ShareArtworkModal = ({ isOpen, onClose, shareUrl, captionText, copyUrl }) => {
  const location = useLocation();
  const [isCopied, setIsCopied] = useBoolean(false);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <Stack
          direction={"row"}
          justify={"space-between"}
          py={"4"}
          mx={4}
          borderBottom={"1px solid"}
          borderColor={"gray.200"}
        >
          <Stack align={"center"} flex={1} justify={"center"}>
            <Text fontWeight={600}>Share</Text>
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
          <Stack p={2} spacing={4} justify={{ base: "center", lg: "start" }}>
            <Text textAlign={"center"}>Share this link to:</Text>
            <Stack direction={"row"} justify={"center"} spacing={"8"}>
              <FacebookShareButton url={shareUrl} quote={captionText}>
                <Stack h={"10"} w={"10"} bg={"#2A70F9"} borderRadius={"full"} justify={"center"} align={"center"}>
                  <FaFacebookF color="white" size={"1.5rem"} />
                </Stack>
              </FacebookShareButton>
              <TwitterShareButton url={shareUrl} title={captionText}>
                <Stack h={"10"} w={"10"} bg={"#1E98E6"} borderRadius={"full"} justify={"center"} align={"center"}>
                  <FaTwitter color="white" size={"1.5rem"} />
                </Stack>
              </TwitterShareButton>
            </Stack>
            <Text textAlign={"center"}>Or copy link:</Text>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button
            variant={"outline"}
            border={"1px solid"}
            borderColor={"gray.200"}
            p={4}
            w={"full"}
            fontWeight={"400"}
            onClick={() => {
              if (navigator && window) {
                navigator.clipboard.writeText(shareUrl);
                setIsCopied.on();
                setTimeout(() => {
                  setIsCopied.off();
                }, 2000);
              }
            }}
          >
            <Stack w={"full"} direction={"row"} borderRadius={"lg"} justify={isCopied ? "center" : "space-between"}>
              {isCopied ? (
                <Text>Copied!</Text>
              ) : (
                <>
                  <Text fontSize={{ base: "sm" }} overflow={"hidden"}>
                    {copyUrl}
                  </Text>
                  <FiCopy />
                </>
              )}
            </Stack>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

ShareArtworkModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  shareUrl: PropTypes.string,
  captionText: PropTypes.string,
  copyUrl: PropTypes.string,
};

ShareArtworkModal.defaultProps = {
  isOpen: false,
  onClose: () => {},
  shareUrl: "",
  captionText: "",
  copyUrl: "",
};

export default ShareArtworkModal;
