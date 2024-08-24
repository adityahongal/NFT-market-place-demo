import axios from "axios";
import { useMutation, useQuery, useQueries } from "@tanstack/react-query";

import api from "./index";

export const useGetNftsBalance = ({
  address,
  chain = process.env.REACT_APP_MORALIS_CHAIN_NAME,
}) => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["getNftsBalance", address, chain],
    queryFn: () =>
      axios.get(`https://deep-index.moralis.io/api/v2/${address}/nft`, {
        params: { chain, format: "decimal" },
        headers: {
          accept: "application/json",
          "X-API-Key": process.env.REACT_APP_MORALIS_API_KEY,
        },
      }),
  });

  return { data: data?.data, isError, isLoading };
};

export const useGetNftMetadata = ({
  tokenAddress,
  tokenId,
  chain = process.env.REACT_APP_MORALIS_CHAIN_NAME,
}) => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["get-nft-metadata", tokenAddress, tokenId],
    queryFn: () => getMetaDataMoralis(tokenAddress, tokenId, chain),
  });

  return { data, isError, isLoading };
};

export const getMetaDataMoralis = async (
  tokenAddress,
  tokenId,
  chain = process.env.REACT_APP_MORALIS_CHAIN_NAME
) => {
  const { data } = await axios.get(
    `https://deep-index.moralis.io/api/v2/nft/${tokenAddress}/${tokenId}`,
    {
      params: { chain, format: "decimal" },
      headers: {
        accept: "application/json",
        "X-API-Key": process.env.REACT_APP_MORALIS_API_KEY,
      },
    }
  );

  return data;
};

export const getMetaDataByTokenUri = async (tokenUri) => {
  const { data } = await axios.get(tokenUri);

  return data;
};

export const useGetNativeBalance = () => {
  const { mutateAsync, data } = useMutation({
    mutationKey:["get-native-balance"],
    mutationFn:({ address, chain = process.env.REACT_APP_MORALIS_CHAIN_NAME }) =>
      axios.get(`https://deep-index.moralis.io/api/v2/${address}/balance`, {
        params: { chain },
        headers: { accept: "application/json", "X-API-Key": process.env.REACT_APP_MORALIS_API_KEY },
      })
});

  return { getNativeBalance: mutateAsync, data: data?.data };
};

export const signSmartContractDataApi = async (body) => {
  const { data } = await api.post(`/getSignedData`, body);

  return data?.signedData || body;
};