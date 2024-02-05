import axios from "axios";
import { useMutation, useQuery, useQueries } from "@tanstack/react-query";

import api from "./index";

export const getMetaDataMoralis = async (tokenAddress, tokenId, chain = process.env.REACT_APP_MORALIS_CHAIN_NAME) => {
    const { data } = await axios.get(`https://deep-index.moralis.io/api/v2/nft/${tokenAddress}/${tokenId}`, {
      params: { chain, format: "decimal" },
      headers: { accept: "application/json", "X-API-Key": process.env.REACT_APP_MORALIS_API_KEY },
    });
  
    return data;
  };