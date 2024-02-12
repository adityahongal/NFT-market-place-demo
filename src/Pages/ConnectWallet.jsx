import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Center, Spinner } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import isEmpty from "lodash/isEmpty";

import {
  connectWalletStateSelector,
  resetWalletCreate,
} from "./../store/slices/layout";

import {
  LandingScreen,
  CreatePassword,
  ReEnterRecoverySeed,
  SaveRecoverySeed,
  LoginPassword,
} from "../components/ConnectWallet";
import { SuccessScreen } from "./../components/Common";

const ConnectWallet = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { createWalletStep, existingWalletStep, loginStep } = useSelector(
    connectWalletStateSelector
  );
  const { loading: isWalletLoading, wallet } = useSelector(
    (state) => state.wallet
  );

  const isInitialStep =
    createWalletStep === 0 && existingWalletStep === 0 && loginStep === 0;
  const { state } = location;

  useEffect(() => {
    dispatch(resetWalletCreate());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isEmpty(state) && !isWalletLoading && !isEmpty(wallet)) {
      const { redirectedFrom = "" } = state || {};
      navigate(redirectedFrom);
    }
  }, [isWalletLoading, navigate, state, wallet]);

  const getCreateWalletStep = () => {
    switch (createWalletStep) {
      case 1:
        return <SaveRecoverySeed />;
      case 2:
        return <ReEnterRecoverySeed />;
      case 3:
        return <CreatePassword />;
      case 4:
        return (
          <SuccessScreen
            headingText={"Great! You’ve created your wallet."}
            ctaText={"Show me my NFTs"}
            ctaOnClick={() => {
              navigate(`/profile`);
              dispatch(resetWalletCreate());
            }}
          />
        );
      default:
        return <></>;
    }
  };

  const getExisitingWalletStep = () => {
    switch (existingWalletStep) {
      case 1:
        return <ReEnterRecoverySeed />;
      case 2:
        return <CreatePassword />;
      case 3:
        return (
          <SuccessScreen
            headingText={"Great! You’ve recovered your wallet."}
            ctaText={"Show me my NFTs"}
            ctaOnClick={() => {
              navigate(`/profile`);
              dispatch(resetWalletCreate());
            }}
          />
        );
      default:
        return <></>;
    }
  };

  const getLoginStep = () => {
    switch (loginStep) {
      case 1:
        return <LoginPassword />;
      case 2:
        return (
          <SuccessScreen
            headingText={"Great! You've logged in successfully."}
            ctaText={"Show me my NFTs"}
            ctaOnClick={() => {
              navigate(`/profile`);
              dispatch(resetWalletCreate());
            }}
          />
        );
      default:
        return <></>;
    }
  };

  return (
    <Box bg="background_gradient_1" w={"full"} flex={1}>
      {isWalletLoading ? (
        <Center h={window.innerHeight}>
          <Spinner
            thickness="4px"
            speed="0.60s"
            emptyColor="gray.200"
            color="red.700"
            size="xl"
          />
        </Center>
      ) : (
        <>
          {isInitialStep && <LandingScreen />}
          {getCreateWalletStep()}
          {getExisitingWalletStep()}
          {getLoginStep()}
        </>
      )}
    </Box>
  );
};

export default ConnectWallet;
