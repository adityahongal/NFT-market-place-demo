// MAIN ROUTER COMPONENT

import React, { lazy, Suspense, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Helmet } from "react-helmet";
import Layout from "../components/layout";
import { Center, Spinner } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import isEmpty from "lodash/isEmpty";

import { setWalletFromPvtKey } from "./../store/slices/wallet";
import { useGetCurrentUserDetails } from "./../api/userService";

const AppRoutes = () => {
  const dispatch = useDispatch();
  const { wallet } = useSelector((state) => state.wallet);
  const { mutate } = useGetCurrentUserDetails();

  useEffect(() => {
    if (isEmpty(wallet)) {
      const delta = localStorage.getItem("delta");
      const alpha = localStorage.getItem("alpha");
      const beta = localStorage.getItem("beta");
      if (delta && alpha && beta) {
        const pvtKey = `${delta}${alpha}${beta}`;
        dispatch(
          setWalletFromPvtKey({
            mutate,
            pvtKey,
          })
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, wallet]);
  return (
    <Routes>
      {publicRoutes.map((route, index) => {
        const { pageTitle, path, Component } = route;
        return (
          <Route
            key={index}
            path={path}
            element={
              <>
                <Helmet>
                  <title>{`${pageTitle && `${pageTitle} - `}NFT`}</title>
                </Helmet>
                <Layout>
                  <Suspense fallback={
                    <Center h={window.innerHeight} w={"full"} flex={1}>
                      <Spinner 
                      thickness="4px"
                      speed="0.60s"
                      emptyColor="gray.200"
                      color="red.700"
                      size="xl"
                      />
                    </Center>
                  }>
                    <Component />
                  </Suspense>
                </Layout>
              </>
            }
          />
        );
      })}
    </Routes>
  );
};

const publicRoutes = [
  {
    path: "/",
    pageTitle: "",
    Component: lazy(() => import("../Pages/Home")),
  },
  {
    path: "/faq",
    pageTitle: "FAQ",
    Component: lazy(() => import("../Pages/FAQ")),
  },
  {
    path: "/connect-wallet",
    Component: lazy(() => import("./../Pages/ConnectWallet")),
    pageTitle: "Connect Wallet",
  },
  {
    path: "/artists",
    Component: lazy(() => import("./../Pages/OurArtists")),
    pageTitle: "Artists",
  },
  {
    path: "/featuredartists",
    pageTitle: "FeaturedArtists",
    Component: lazy(() => import("../Pages/FeaturedArtists")),
  },
  {
    path: "/artists/:artistId",
    Component: lazy(() => import("./../Pages/ArtistProfilePage")),
    pageTitle: "Artist Profile",
  },
  {
    path: "/profile",
    Component: lazy(() => import("./../Pages/Profile")),
    pageTitle: "Profile",
  },
  {
    path: "/nft/:contractAddress/:tokenId",
    Component: lazy(() => import("./../Pages/ArtworkPage")),
    pageTitle: "Artwork",
  },
  {
    path: "/about",
    pageTitle: "About",
    Component: lazy(() => import("../Pages/About")),
  },
  {
    path: "/settings",
    Component: lazy(() => import("./../Pages/Settings")),
    pageTitle: "Settings",
  },
  {
    path: "/transferMatic",
    Component: lazy(() => import("./../Pages/TransferMatic")),
    pageTitle: "Transfer Crypto",
  },
  {
    path: "/mint",
    Component: lazy(() => import("./../Pages/MintArtwork")),
    pageTitle: "Mint Artwork",
  },
  {
    path: "/mint/:imageHash",
    Component: lazy(() => import("./../Pages/MintArtwork")),
    pageTitle: "Mint Artwork",
  },
  {
    path: "/recharge",
    Component: lazy(() => import("./../Pages/Recharge")),
    pageTitle: "Recharge",
  },
  {
    path: "/success",
    Component: lazy(() => import("./../Pages/SuccessPage")),
    pageTitle: "Success",
  },
  {
    path: "/checkout",
    Component: lazy(() => import("../Pages/Checkout")),
    pageTitle: "Checkout",
  },
  {
    path: "/connectedDapps",
    Component: lazy(() => import("./../Pages/ConnectedDapps")),
    pageTitle: "Connect Dapps",
  },
];

export default AppRoutes;
