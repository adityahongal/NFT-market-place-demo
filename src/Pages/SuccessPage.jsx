import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import SuccessScreeen from "./../components/Common/SuccessScreen";

const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state = {} } = location;
  console.log({
    location,
  });

  useEffect(() => {
    if (Object.keys(state || {}).length === 0) {
      navigate("/", { replace: true });
    }
  }, [navigate, state]);

  const {
    headerText = "",
    redirectTo = "/",
    timeout = 2500,
    shouldRedirect = true,
    forwardState = {},
    ctaText = "",
  } = state || {};

  const {
    ctaOnClick = () => {
      navigate(redirectTo || "/");
    },
  } = state || {};

  useEffect(() => {
    if (shouldRedirect) {
      setTimeout(() => {
        navigate(redirectTo, { replace: true, state: forwardState });
      }, timeout);
    }
  }, [forwardState, navigate, redirectTo, shouldRedirect, timeout]);

  return <SuccessScreeen headingText={headerText} ctaText={ctaText} ctaOnClick={ctaOnClick} />;
};

export default SuccessPage;
