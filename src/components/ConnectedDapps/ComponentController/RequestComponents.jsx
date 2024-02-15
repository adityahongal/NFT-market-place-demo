import React, { useEffect, useState } from "react";
import { Stack, Heading, Text } from "@chakra-ui/layout";
import { Avatar, chakra } from "@chakra-ui/react";
import { Button } from "@chakra-ui/button";
import { useDispatch, useSelector } from "react-redux";
import isEmpty from "lodash/isEmpty";
import ReactJson from "react-json-view";

import { fromHexToUTf8, fromHexToDecimal } from "./../../../utils/convert";
import {
  approveRequest,
  rejectRequest,
  handlePersonalSign,
  handleETHSign,
  handleSignTypedData,
  handleETHSignTransaction,
  handleSendETHTransaction,
} from "../../../store/slices/wallet";

const SessionRequest = ({ obj }) => {
  const dispatch = useDispatch();
  const { icons = [], name = "", description = "", url = "" } = obj?.params[0]?.peerMeta || {};
  const { connector, wallet = {} } = useSelector((state) => state.wallet);
  const { address = "" } = wallet;

  const handleApproveRequest = (req) => {
    if (connector && address) dispatch(approveRequest(connector, address, req));
  };

  const handleRejectRequest = (req) => {
    if (connector && address) dispatch(rejectRequest(connector, req));
  };

  console.log({ obj });

  return (
    <Stack w={{ base: "full", lg: "50%" }} align={"center"} spacing={"10"}>
      <Stack w={"full"} align={"center"}>
        {icons.length > 0 && <Avatar size="2xl" src={icons[0]} />}
        {name && <Heading fontSize={"md"}>{name}</Heading>}
        {url && <Text>{url}</Text>}
        {description && (
          <Text textAlign={"center"} color={"gray.600"}>
            {description}
          </Text>
        )}
      </Stack>
      (
      {obj && (
        <Stack direction={"row"} w={{ base: "full", md: "80%" }} justify={"center"} spacing={10}>
          <Button
            bg={"button_gradient"}
            color={"white"}
            size={"md"}
            _hover={{
              bg: "button_gradient_light",
            }}
            _active={{
              bg: "button_gradient_light",
            }}
            flex={1}
            onClick={() => handleApproveRequest(obj)}
          >
            Accept
          </Button>
          <Button
            variant={"outline"}
            borderColor={"brand_red.500"}
            _hover={{
              bg: "brand_pink.100",
            }}
            size={"md"}
            _active={{
              bg: "button_gradient_light",
            }}
            flex={1}
            onClick={() => handleRejectRequest(obj)}
          >
            <Text bg="button_gradient" bgClip="text">
              Reject
            </Text>
          </Button>
        </Stack>
      )}
      )
    </Stack>
  );
};

const PersonalSignRequest = ({ obj, handleRejectSignMessage }) => {
  const dispatch = useDispatch();
  const [humanReadableMessage, setHumanReadableMessage] = useState("");
  const { wallet, connector } = useSelector((state) => state.wallet);

  useEffect(() => {
    handleETHMessage(obj);
  }, [obj]);

  const handleETHMessage = (obj) => {
    const decyptedMessage = fromHexToUTf8(obj?.params?.request?.params[0]) || 0;
    setHumanReadableMessage(decyptedMessage);
  };

  const handleApproveRequest = (req) => {
    try {
      dispatch(handlePersonalSign(req, wallet, connector));
    } catch (error) {}
  };

  return (
    <Stack spacing={"10"} align={"center"}>
      <Stack w={"full"}>
        <Text>
          <chakra.span fontWeight={"600"}>Type : </chakra.span>
          {obj?.params?.request?.method}
        </Text>
        {obj?.params?.request?.params.length > 1 && obj?.params?.request?.params[1] && (
          <Text>
            <chakra.span fontWeight={"600"}>Address : </chakra.span>
            {obj?.params?.request?.params[1]}
          </Text>
        )}
        <Text>
          <chakra.span fontWeight={"600"}>Data : </chakra.span>
          {humanReadableMessage}
        </Text>
      </Stack>
      {obj && (
        <Stack direction={"row"} w={{ base: "full", md: "80%" }} justify={"center"} spacing={10}>
          <Button
            bg={"button_gradient"}
            color={"white"}
            size={"md"}
            _hover={{
              bg: "button_gradient_light",
            }}
            _active={{
              bg: "button_gradient_light",
            }}
            flex={1}
            onClick={() => handleApproveRequest(obj)}
          >
            Accept
          </Button>
          <Button
            variant={"outline"}
            borderColor={"brand_red.500"}
            _hover={{
              bg: "brand_pink.100",
            }}
            size={"md"}
            _active={{
              bg: "button_gradient_light",
            }}
            flex={1}
            onClick={() => handleRejectSignMessage(obj)}
          >
            <Text bg="button_gradient" bgClip="text">
              Reject
            </Text>
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

const EthSignRequest = ({ obj, handleRejectSignMessage }) => {
  const dispatch = useDispatch();
  const [humanReadableMessage, setHumanReadableMessage] = useState("");
  const { wallet, connector } = useSelector((state) => state.wallet);

  useEffect(() => {
    handleETHMessage(obj);
  }, [obj]);

  const handleETHMessage = (obj) => {
    const decyptedMessage = fromHexToUTf8(obj?.params?.request?.params[1]) || "";
    setHumanReadableMessage(decyptedMessage);
  };

  const handleApproveRequest = (req) => {
    try {
      dispatch(handleETHSign(obj, wallet, connector));
    } catch (error) {}
  };

  return (
    <Stack spacing={"10"} align={"center"}>
      <Stack w={"full"}>
        <Text>
          <chakra.span fontWeight={"600"}>Type : </chakra.span>
          {obj?.params?.request?.method}
        </Text>
        {obj?.params?.request?.params.length > 1 && obj?.params?.request?.params[1] && (
          <Text>
            <chakra.span fontWeight={"600"}>Address : </chakra.span>
            {obj?.params?.request?.params[0]}
          </Text>
        )}
        <Text>
          <chakra.span fontWeight={"600"}>Data : </chakra.span>
          {humanReadableMessage}
        </Text>
      </Stack>
      {obj && (
        <Stack direction={"row"} w={{ base: "full", md: "80%" }} justify={"center"} spacing={10}>
          <Button
            bg={"button_gradient"}
            color={"white"}
            size={"md"}
            _hover={{
              bg: "button_gradient_light",
            }}
            _active={{
              bg: "button_gradient_light",
            }}
            flex={1}
            onClick={() => handleApproveRequest(obj)}
          >
            Accept
          </Button>
          <Button
            variant={"outline"}
            borderColor={"brand_red.500"}
            _hover={{
              bg: "brand_pink.100",
            }}
            size={"md"}
            _active={{
              bg: "button_gradient_light",
            }}
            flex={1}
            onClick={() => handleRejectSignMessage(obj)}
          >
            <Text bg="button_gradient" bgClip="text">
              Reject
            </Text>
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

const EthSignTypedDataRequest = ({ obj, handleRejectSignMessage }) => {
  const dispatch = useDispatch();
  const [parsedData, setParsedData] = useState({});
  const { wallet = {}, connector } = useSelector((state) => state.wallet);

  const handleDataParse = () => {
    if (obj?.params?.request?.params?.length > 0) {
      const parsed = JSON.parse(obj?.params?.request?.params[1]);

      setParsedData(parsed);
    }
  };

  const handleApproveRequest = (req) => {
    try {
      dispatch(handleSignTypedData(obj, wallet, connector, parsedData));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleDataParse(obj);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [obj]);

  return (
    <Stack spacing={"10"} align={"center"}>
      <Stack w={"full"}>
        <Text>
          <chakra.span fontWeight={"600"}>Type : </chakra.span>
          {obj?.params?.request?.method}
        </Text>
        <Stack>
          <Text fontWeight={"600"}>Params :</Text>
          <Stack h={"80"} overflow={"auto"}>
            <ReactJson src={parsedData} />
          </Stack>
        </Stack>
      </Stack>
      {obj && (
        <Stack direction={"row"} w={{ base: "full", md: "80%" }} justify={"center"} spacing={10}>
          <Button
            bg={"button_gradient"}
            color={"white"}
            size={"md"}
            _hover={{
              bg: "button_gradient_light",
            }}
            _active={{
              bg: "button_gradient_light",
            }}
            flex={1}
            onClick={() => handleApproveRequest(obj)}
          >
            Accept
          </Button>
          <Button
            variant={"outline"}
            borderColor={"brand_red.500"}
            _hover={{
              bg: "brand_pink.100",
            }}
            size={"md"}
            _active={{
              bg: "button_gradient_light",
            }}
            flex={1}
            onClick={() => handleRejectSignMessage(obj)}
          >
            <Text bg="button_gradient" bgClip="text">
              Reject
            </Text>
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

const EthSignTransaction = ({ obj, handleRejectSignMessage }) => {
  const dispatch = useDispatch();
  const [reqParams, setReqParams] = useState({});
  const { wallet = {}, connector } = useSelector((state) => state.wallet);

  const handleApproveRequest = (req) => {
    try {
      dispatch(handleETHSignTransaction(req, wallet, connector));
    } catch (err) {
      console.log(err);
    }
  };

  const formatParmas = (params) => {
    const formattedParams = {
      from: "",
      to: "",
      gasPrice: null,
      gasLimit: null,
      value: null,
      nonce: null,
      data: null,
    };

    if (!isEmpty(params)) {
      formattedParams["from"] = params?.from || "";
      formattedParams["to"] = params?.to || "";
      formattedParams["gasPrice"] = fromHexToDecimal(params?.gasPrice) || 0;
      formattedParams["gasLimit"] = fromHexToDecimal(params?.gasLimit) || 0;
      formattedParams["value"] = fromHexToDecimal(params?.value) || 0;
      formattedParams["nonce"] = fromHexToDecimal(params?.nonce) || null;
      formattedParams["data"] = fromHexToUTf8(params?.data) || "";
    }
    setReqParams(formattedParams);
  };

  useEffect(() => {
    const params = obj?.params?.request?.params?.length > 0 ? obj?.params?.request?.params[0] : {};
    formatParmas(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack spacing={"10"} align={"center"}>
      <Stack w={"full"}>
        <Text>
          <chakra.span fontWeight={"600"}>Type : </chakra.span>
          {obj?.params?.request?.method}
        </Text>
        {reqParams.from && (
          <Text>
            <chakra.span fontWeight={"600"}>From : </chakra.span>
            {reqParams.from}
          </Text>
        )}
        {reqParams.to && (
          <Text>
            <chakra.span fontWeight={"600"}>To : </chakra.span>
            {reqParams.to}
          </Text>
        )}
        <Text>
          <chakra.span fontWeight={"600"}>Gas Price : </chakra.span>
          {reqParams.gasPrice}
        </Text>
        <Text>
          <chakra.span fontWeight={"600"}>Gas : </chakra.span>
          {reqParams.gas}
        </Text>
        {reqParams.nonce && (
          <Text>
            <chakra.span fontWeight={"600"}>Nonce : </chakra.span>
            {reqParams.nonce}
          </Text>
        )}
        <Text>
          <chakra.span fontWeight={"600"}>Value : </chakra.span>
          {reqParams.value}
        </Text>
        {reqParams.data && (
          <Text>
            <chakra.span fontWeight={"600"}>Data : </chakra.span>
            {reqParams.data}
          </Text>
        )}
      </Stack>
      {obj && (
        <Stack direction={"row"} w={{ base: "full", md: "80%" }} justify={"center"} spacing={10}>
          <Button
            bg={"button_gradient"}
            color={"white"}
            size={"md"}
            _hover={{
              bg: "button_gradient_light",
            }}
            _active={{
              bg: "button_gradient_light",
            }}
            flex={1}
            onClick={() => handleApproveRequest(obj)}
          >
            Accept
          </Button>
          <Button
            variant={"outline"}
            borderColor={"brand_red.500"}
            _hover={{
              bg: "brand_pink.100",
            }}
            size={"md"}
            _active={{
              bg: "button_gradient_light",
            }}
            flex={1}
            onClick={() => handleRejectSignMessage(obj)}
          >
            <Text bg="button_gradient" bgClip="text">
              Reject
            </Text>
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

const EthSendTransaction = ({ obj, handleRejectSignMessage }) => {

  const dispatch = useDispatch();
  const [reqParams, setReqParams] = useState({});
  const { wallet = {}, connector } = useSelector((state) => state.wallet);

  const handleApproveRequest = (req) => {
    try {
      dispatch(handleSendETHTransaction(req, wallet, connector));
    } catch (err) {
      console.log(err);
    }
  };

  const formatParmas = (params) => {
    const formattedParams = {
      from: "",
      to: "",
      gasPrice: null,
      gasLimit: null,
      value: null,
      nonce: null,
      data: null,
    };

    if (!isEmpty(params)) {
      formattedParams["from"] = params?.from || "";
      formattedParams["to"] = params?.to || "";
      formattedParams["gasPrice"] = params?.gasPrice ? fromHexToDecimal(params?.gasPrice) : 0;
      formattedParams["gas"] = params?.gasLimit ? fromHexToDecimal(params?.gasLimit) : 0;
      formattedParams["value"] = params?.value ? fromHexToDecimal(params?.value) : 0;
      formattedParams["nonce"] = params?.nonce ? fromHexToDecimal(params?.nonce) : null;
      formattedParams["data"] = params?.data ? fromHexToUTf8(params?.data) : "";
    }
    setReqParams(formattedParams);
  };

  useEffect(() => {
    const params = obj?.params?.request?.params?.length > 0 ? obj?.params?.request?.params[0] : {};
    formatParmas(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack spacing={"10"} align={"center"}>
      <Stack w={"full"}>
        <Text>
          <chakra.span fontWeight={"600"}>Type : </chakra.span>
          {obj?.params?.request?.method}
        </Text>
        {reqParams.from && (
          <Text>
            <chakra.span fontWeight={"600"}>From : </chakra.span>
            {reqParams.from}
          </Text>
        )}
        {reqParams.to && (
          <Text>
            <chakra.span fontWeight={"600"}>To : </chakra.span>
            {reqParams.to}
          </Text>
        )}
        <Text>
          <chakra.span fontWeight={"600"}>Gas Price : </chakra.span>
          {reqParams.gasPrice}
        </Text>
        <Text>
          <chakra.span fontWeight={"600"}>Gas : </chakra.span>
          {reqParams.gas}
        </Text>
        {reqParams.nonce && (
          <Text>
            <chakra.span fontWeight={"600"}>Nonce : </chakra.span>
            {reqParams.nonce}
          </Text>
        )}
        <Text>
          <chakra.span fontWeight={"600"}>Value : </chakra.span>
          {reqParams.value}
        </Text>
        {reqParams.data && (
          <Text>
            <chakra.span fontWeight={"600"}>Data : </chakra.span>
            {reqParams.data}
          </Text>
        )}
      </Stack>
      {obj && (
        <Stack direction={"row"} w={{ base: "full", md: "80%" }} justify={"center"} spacing={10}>
          <Button
            bg={"button_gradient"}
            color={"white"}
            size={"md"}
            _hover={{
              bg: "button_gradient_light",
            }}
            _active={{
              bg: "button_gradient_light",
            }}
            flex={1}
            onClick={() => handleApproveRequest(obj)}
          >
            Accept
          </Button>
          <Button
            variant={"outline"}
            borderColor={"brand_red.500"}
            _hover={{
              bg: "brand_pink.100",
            }}
            size={"md"}
            _active={{
              bg: "button_gradient_light",
            }}
            flex={1}
            onClick={() => handleRejectSignMessage(obj)}
          >
            <Text bg="button_gradient" bgClip="text">
              Reject
            </Text>
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

export {
  SessionRequest,
  PersonalSignRequest,
  EthSignRequest,
  EthSignTypedDataRequest,
  EthSignTransaction,
  EthSendTransaction,
};
