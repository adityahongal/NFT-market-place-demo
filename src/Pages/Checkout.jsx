import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Box, Stack, useBreakpointValue } from "@chakra-ui/react";
import WertWidget from "@wert-io/widget-initializer";
import isEmpty from "lodash/isEmpty";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [wertOptions, setWertOptions] = useState({});
  const { state } = location || {};
  const offSet = useBreakpointValue({ base: 10, md: 100 });

  useEffect(() => {
    if (!isEmpty(state)) {
      const { NFT = {}, signedData, sc_address, sc_input_data } = state;
      const { extras = {} } = NFT;
      console.log(signedData);
      const options = {
        partner_id: process.env.REACT_APP_WERT_PARTNER_ID,
        // container_id: "wert-widget",
        click_id: uuidv4(), // unique id of purhase in your system
        origin: process.env.REACT_APP_WERT_ORIGIN, // this option needed only for this example to work
        width: window.innerWidth - offSet,
        height: window.innerHeight - 100,
        listeners: {
          loaded: () => console.log("loaded"),
          "payment-status": ({ status }) => {
            console.log(status);
            if (status && status === "success") {
              navigate("/profile", { replace: true });
            }
          },
        },
        extra: {
          item_info: {
            ...extras,
          },
        },
      };
      const wertWidget = new WertWidget({
        ...signedData,
        ...options,
      });
      setWertOptions({
        ...signedData,
        ...options,
      });

      wertWidget.open();
    } else {
      navigate("/not-found", { replace: true });
    }
  }, []);

  return (
    <Stack
      bg="background_gradient_1"
      py={{ base: "6", lg: "10" }}
      px={{ base: 0, md: 16 }}
      align={"center"}
      spacing={{ base: "6", lg: "10" }}
      w={"full"}
      flex={1}
    >
      <Box id="wert-widget"></Box>
    </Stack>
  );
};

export default Checkout;
