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