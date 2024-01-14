import React from "react";
import NavBar from "./navbar";
import Footer from "./footer";
import PropTypes from "prop-types";

const Layout = ({ children }) => {
    return(
        <>
        <NavBar/>
        {children}
        <Footer/>
        </>
    )
}

Layout.propTypes = {
    children: PropTypes.node.isRequired,
}

export default Layout