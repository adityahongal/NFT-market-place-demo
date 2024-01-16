// MAIN ROUTER COMPONENT

import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../Pages/Home";
import { Helmet } from "react-helmet";
import Layout from "../components/layout";

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
                  <Suspense fallback={<h1>LOADING</h1>}>
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
    path: "/how-it-works",
    pageTitle: "How it Works",
    Component: lazy(() => import("../Pages/HowItWorks")),
  },
  {
    path: "/featuredartists",
    pageTitle: "FeaturedArtists",
    Component: lazy(() => import("../Pages/FeaturedArtists")),
  },
  {
    path: "/about",
    pageTitle: "About",
    Component: lazy(() => import("../Pages/About")),
  },
];

export default AppRoutes;
