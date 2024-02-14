import { useQuery, useMutation } from "@tanstack/react-query";
import api from "./index";

import { queryClient } from "./../App";

export const useGetFeaturedListings = (page = 0, size = 10) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["get-featured-listings", page],
    queryFn: () => api.get(`/getFeaturedListings?size=${size}&page=${page}`),
    keepPreviousData: true,
  });
  return { data: data?.data?.results?.Listings || [], isLoading, isError };
};

export const useGetUserListings = ({ address = "", page = 0, size = 100 }) => {
  const { data } = useQuery({
    queryKey: ["get-user-listings", page],
    queryFn: () =>
      api.get(`/getListingsByAccount/${address}?size=${size}&page=${page}`),
    keepPreviousData: true,
  });

  return {
    data: data?.data?.results?.Listings || [],
  };
};

export const useGetListingById = ({ tokenId = "", tokenAddress = "" }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["get-listing-by-id", tokenId, tokenAddress],
    queryFn: () => api.get(`/getListing/${String(tokenId)}/${tokenAddress}`),
  });

  return { data: data?.data?.Listing || {}, isLoading };
};

export const useGetMinterAddress = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["get-miner-address"],
    queryFn: () => api.get("/getMinter"),
  });

  return { minterAddress: data?.data?.minter, isLoading, isError };
};

export const useGetRoyaltyAddress = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["get-royalty-address"],
    queryFn: () => api.get("/getRoyaltyReceiver"),
  });

  return { royaltyReceiverAddress: data?.data?.royaltyReceiver, isLoading, isError };
};
