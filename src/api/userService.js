import { useMutation, useQuery } from "@tanstack/react-query";
import api from "./index";

export const useGetAllFeaturedArtists = (page = 0, size = 6) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["get-all-featured-artists", page],
    queryFn: () => api.get(`/getAllFeaturedAccounts?size=${size}&page=${page}`),
    keepPreviousData: true,
  });

  return { data: data?.data?.results, isLoading, isError };
};

export const useGetUserByAddress = ({ address: walletAddress }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["get-user-by-address", walletAddress],
    queryFn: () => api.get(`/getAccount/${walletAddress}`),
  });

  return { data: data?.data?.account, isLoading, isError };
};

export const useGetUserByAddressDelay = () => {
  const { mutateAsync } = useMutation(["get-user-by-address"], ({ address }) =>
    api.get(`/getAccount/${address}`)
  );

  return { mutateAsync };
};
