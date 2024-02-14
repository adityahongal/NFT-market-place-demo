import React from "react";
import { Text } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { chakra } from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";

import { FiExternalLink } from "react-icons/fi";

const NonLoggedInView = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <Text>
        To complete the process, you'll need to either connect or create a{" "}
        <chakra.a
          display={"inline-flex"}
          alignItems={"center"}
          color={"cyan.700"}
          cursor={"pointer"}
          _hover={{ textDecor: "underline" }}
          target={"_blank"}
          href={`${window.location.origin}/what-is-crypto-wallet`}
        >
          wallet.
          <chakra.span display={"inline-block"} ml={1}>
            <FiExternalLink />
          </chakra.span>
        </chakra.a>
      </Text>
      <Button
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
        px={{ lg: "16" }}
        py={{ base: "6" }}
        w={"100%"}
        onClick={() => {
          navigate("/connect-wallet", {
            state: {
              redirectedFrom: location?.pathname || "",
            },
          });
        }}
      >
        Connect Wallet
      </Button>
    </>
  );
};

export default NonLoggedInView;
