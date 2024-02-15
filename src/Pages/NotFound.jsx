import React from "react";
import { Stack, Text } from "@chakra-ui/layout";
import { Image } from "@chakra-ui/image";
import { chakra } from "@chakra-ui/react";

import notFoundImage from "./../Assets/404.svg";

const NotFond = () => {
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
      <Image src={notFoundImage} alt="Not Found" h={"80"} />
      <Text>
        <chakra.span bg="button_gradient" bgClip="text" fontWeight={500}>
          Page not found!!!
        </chakra.span>{" "}
        😔
      </Text>
    </Stack>
  );
};

export default NotFond;
