import React from "react";
import { Stack, Heading, Text, Box } from "@chakra-ui/layout";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
} from "@chakra-ui/accordion";
import { chakra } from "@chakra-ui/react";
import { BsPlusLg } from "react-icons/bs";

const AccordionIcon = ({ isExpanded = false }) => {
    const rotate = isExpanded ? "45deg" : "0deg";
  
    return (
      <chakra.div
        color={"gray.400"}
        transform={`rotate(${rotate})`}
        transition={"all 0.2s linear"}
      >
        <BsPlusLg />
      </chakra.div>
    );
  };

const FAQ = () => {
    
  
    return (
        <Stack
      bg="background_gradient_1"
      align={{ base: "flex-start", lg: "center" }}
      py={{ base: "6", lg: "10" }}
      spacing={{ base: "4", lg: "8" }}
      px={{ base: 4, md: 16 }}
      w={"full"}
      flex={1}
    >
      <Heading as="h1" color={"gray.800"}>
        FAQ
      </Heading>
      <Box
        w={{ base: "100%", lg: "50%" }}
        bg={"white"}
        p={{ base: "4", lg: "6" }}
        my={"8"}
        borderRadius={"xl"}
      >
        <Accordion allowToggle display={"flex"} flexDir={"column"} gap={"6"}>
          
            <AccordionItem
            //   key={index}
              border={"1px solid #E9E0E5"}
              borderRadius={"lg"}
            >
              {({ isExpanded }) => (
                <>
                  <h2>
                    <AccordionButton>
                      <Box flex="1" textAlign="left" color={"red.700"}>
                        <Text bg="button_gradient" bgClip="text">
                          What is the Wallet ?
                        </Text>
                      </Box>
                      <AccordionIcon isExpanded={isExpanded} />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                  Crypto wallets keep your private keys – the passwords that give you access to your cryptocurrencies – safe and accessible, allowing you to send and receive cryptocurrencies like Bitcoin and Ethereum. They come in many forms, from hardware wallets like Ledger (which looks like a USB stick) to mobile apps like miko Wallet, which makes using crypto as easy as shopping with a credit card online.
                    </AccordionPanel>
                </>
              )}
            </AccordionItem>
        
        </Accordion>
      </Box>
    </Stack>
    );
};

export default FAQ;