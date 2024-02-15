import React from "react";
import PropTypes from "prop-types";
import { Box } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const CustomToastWithLink = ({ href, text }) => {
  return (
    <Box>
      <Link to={href}>{text}</Link>
    </Box>
  );
};

CustomToastWithLink.propTypes = {
  href: PropTypes.string,
  text: PropTypes.string,
};

CustomToastWithLink.defaultProps = {
  href: "/",
  text: "",
};

export default CustomToastWithLink;
