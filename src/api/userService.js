import { useMutation, useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import api from "./index";

import { setUser, updateUser } from "./../store/slices/user";

export const useCreateUser = () => {
  const dispatch = useDispatch();

  const { mutate, isLoading, isError } = useMutation(["create-user"], (body) => api.post("/signup", body), {
    onSuccess: ({ data }) => {
      const { account } = data;
      dispatch(setUser(account));
    },
    onError: (error) => {
      console.log({ error });
    },
  });

  return { mutate, isLoading, isError };
};

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

export const useGetAllArtists = (page = 0, size = 6) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["get-all-artists", page],
    queryFn: () => api.get(`/getAllAccounts?size=${size}&page=${page}`),
    keepPreviousData: true,
  });

  return { data: data?.data?.results, isLoading, isError };
};