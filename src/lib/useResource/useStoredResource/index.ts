import { useSelector } from "react-redux";

interface RetrievedResource {
  isLoading: boolean;
  isInStore: boolean;
  data: any;
  error: Error | false;
  acquiredDate?: Date;
}

const useStoredResource = (resourceId: string) => {
  const {
    data,
    isLoading,
    error,
    isInStore = true,
    acquiredDate,
  } = useSelector(
    (state: any): RetrievedResource => {
      const { resourceHashTable } = state.useResource;
      const requestData = resourceHashTable[resourceId];
      const defaultData = {
        data: null,
        isLoading: false,
        error: false,
        isInStore: false,
      };
      return requestData || defaultData;
    }
  );
  return { data, isLoading, error, isInStore, acquiredDate };
};

export default useStoredResource;
