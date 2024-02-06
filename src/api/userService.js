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