import React, { useEffect, useState } from "react";
import { Stack, Box } from "@chakra-ui/layout";
import { useBoolean, Skeleton, Heading, Spinner } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";
import WertWidget from "@wert-io/widget-initializer";
import { useGetNativeBalance } from "../api/externalService";
import { ethers } from "ethers";

const Recharge = () => {
  const { state = { redirectedFrom: "", rechargeAmt: 0 } } = useLocation();
  const navigate = useNavigate();
  const [visibility, setVisibility] = useState("hidden");
  const [isModuleLoading, setIsModuleLoading] = useBoolean(true);
  const [isTimerRunning, setIsTimerRunning] = useBoolean(true);
  const { wallet: { address: walletAddress = "" } = {} } = useSelector(
    (state) => state.wallet
  );
  const { redirectedFrom = "", rechargeAmt = 0 } = state || {
    redirectedFrom: "",
    rechargeAmt: 0,
  };
  const { getNativeBalance } = useGetNativeBalance();

  const handleSucessFullRecharge = async () => {
    try {
      const { data: balanceResponse } = await getNativeBalance({
        chain: process.env.REACT_APP_MORALIS_CHAIN_NAME,
        address: walletAddress,
      });

      const { balance } = balanceResponse;
      const currentUserMaticBalance = ethers.utils.formatEther(balance);
      const purchaseData = JSON.parse(
        window.localStorage.getItem("wert_purchase_data")
      );
      if (currentUserMaticBalance >= purchaseData?.purchase_amount) {
        window.localStorage.removeItem("wert_purchase_data");

        navigate(redirectedFrom || "/", {
          state: {
            rechargeRedirect: true,
          },
        });
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (purchaseData?.purchase_amount) {
          return await handleSucessFullRecharge();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (redirectedFrom === "" || rechargeAmt === 0) {
      navigate("/");
    }
  }, [navigate, rechargeAmt, redirectedFrom]);

  useEffect(() => {
    setIsModuleLoading.on();
    const config = {
      partner_id: process.env.REACT_APP_WERT_PARTNER_ID,
      // container_id: "wert-widget",
      click_id: uuidv4(), // unique id of purhase in your system
      height: 600,
      currency: "USD",
      commodity: "MATIC:polygon",
      commodities: "MATIC:polygon",
      currency_amount: rechargeAmt,
      origin: process.env.REACT_APP_WERT_ORIGIN,
      address: walletAddress,
      listeners: {
        loaded: () => {
          setIsModuleLoading.off();
          console.log("loaded");
        },
        "rate-update": async (purchaseData) => {
          window.localStorage.removeItem("wert_purchase_data");
          window.localStorage.setItem(
            "wert_purchase_data",
            JSON.stringify(purchaseData)
          );
        },
        "payment-status": async ({ status = "" }) => {
          console.log(status, "Status");
          if (status && status === "success") {
            await handleSucessFullRecharge();
          }
        },
        close: () => {
          console.log("close");
          navigate(redirectedFrom || "/");
        },
      },
    };
    const wertWidget = new WertWidget(config);

    wertWidget.open();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log({
      isTimerRunning,
    });
    setTimeout(() => {
      setIsTimerRunning.off();
    }, 5000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isTimerRunning && !isModuleLoading) {
      setVisibility("visible");
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }, [isTimerRunning, isModuleLoading]);

  return (
    <Stack
      bg="background_gradient_1"
      py={{ base: "6", lg: "10" }}
      px={{ base: 4, md: 16 }}
      align={"center"}
      spacing={{ base: "6", lg: "10" }}
      w={"full"}
      flex={1}
    >
      {isTimerRunning && (
        <Stack
          height={"70vh"}
          w={{ base: "full", md: "80%", lg: "70%" }}
          justify={"center"}
          align={"center"}
          spacing={"4"}
        >
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color={"brand_red.900"}
            size="xl"
          />
          <Heading textAlign={"center"}>
            You don't have enough balance to complete this transaction. Opening
            recharge module...
          </Heading>
        </Stack>
      )}
      {!isTimerRunning && isModuleLoading && (
        <Skeleton h={"70vh"} w={"full"} borderRadius={"xl"} />
      )}
      <Box visibility={visibility} w={"full"}>
        <Box
          id="wert-widget"
          borderRadius={"xl"}
          minH={"70vh"}
          w={"full"}
        ></Box>
      </Box>
    </Stack>
  );
};

export default Recharge;
