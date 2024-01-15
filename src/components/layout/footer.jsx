import React from "react";
import { Box, useColorModeValue } from '@chakra-ui/react';

const Footer = () => {
    return (
        <Box 
            bg={useColorModeValue("brand_pink.100","gray.900")}
            color={useColorModeValue("gray.700","gray.200")}
            pt={{ base: 10, md: 16}}
            pb={{ base: 10, md: 8}}
            px={{ base: 4, md:16}}
        >
        

        </Box>
    )
};

export default Footer;