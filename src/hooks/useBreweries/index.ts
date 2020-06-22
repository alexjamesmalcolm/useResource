import { useMemo, useCallback } from "react";
import useResource from "../../lib"; // normally from "@alexjamesmalcolm/use-resource";

interface Brewery {
  id: number;
  name: string;
  brewery_type: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  longitude: string;
  latitude: string;
  phone: string;
  website_url: string;
  updated_at: string;
  tag_list: [];
}

const useBreweries = ({
  pageNumber = 1,
  pageSize = 10,
}: {
  pageNumber?: number;
  pageSize?: number;
} = {}) => {
  const resourceId: string = useMemo(
    () => `useBreweries: page ${pageNumber} with ${pageSize} per page`,
    [pageNumber, pageSize]
  );
  const getResource = useCallback(
    () =>
      fetch(
        `https://api.openbrewerydb.org/breweries?page=${pageNumber}&per_page=${pageSize}`
      ).then((response) => response.json()),
    [pageNumber, pageSize]
  );
  const {
    data,
    error,
    filterCache,
    isInStore,
    isLoading,
    actions,
  } = useResource(resourceId, { getResource });
  return { breweries: data as Brewery[], error, isLoading };
};

export default useBreweries;
