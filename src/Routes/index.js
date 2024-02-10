// MAIN ROUTER COMPONENT

import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../Pages/Home";
import { Helmet } from "react-helmet";
import Layout from "../components/layout";
import { Center, Spinner } from "@chakra-ui/react";

const AppRoutes = () => {
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
    path: "/nft/:contractAddress/:tokenId",
    Component: lazy(() => import("./../Pages/ArtworkPage")),
    pageTitle: "Artwork",
  },
  {
    path: "/about",
    pageTitle: "About",
    Component: lazy(() => import("../Pages/About")),
  },
];

export default AppRoutes;
