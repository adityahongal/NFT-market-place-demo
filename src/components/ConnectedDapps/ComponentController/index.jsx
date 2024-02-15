import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Stack } from "@chakra-ui/react";

import { rejectActiveRequest } from "./../../../store/slices/wallet";
import {
  PersonalSignRequest,
  EthSignRequest,
  EthSignTypedDataRequest,
  EthSendTransaction,
  EthSignTransaction,
} from "./RequestComponents";

const ComponentController = () => {
  const dispatch = useDispatch();
  const { requests } = useSelector((state) => state.wallet);

  const requestComponents = {
    personal_sign: PersonalSignRequest,
    eth_sign: EthSignRequest,
    eth_signTypedData: EthSignTypedDataRequest,
    eth_signTransaction: EthSignTransaction,
    eth_sendTransaction: EthSendTransaction,
    eth_signTypedData_v4: EthSignTypedDataRequest
  };

  const handleRejectSignMessage = (obj) => {
    dispatch(rejectActiveRequest(null, obj));
  };

  return (
    <Stack spacing={"4"}>
      {requests.map((req) => {
        const { id, params } = req || {};
        const { request } = params || {};
        const { method } = request || {};
        if (requestComponents[method]) {
          const Component = requestComponents[method];
          return (
            <Stack border={"2px solid"} borderColor={"gray.300"} p={4} borderRadius={"xl"}>
              <Component key={id} obj={req} handleRejectSignMessage={handleRejectSignMessage} />
            </Stack>
          );
        } else {
          return <></>;
        }
      })}
    </Stack>
  );
};

export default ComponentController;
