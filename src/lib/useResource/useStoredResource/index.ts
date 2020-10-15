import { useSelector } from "react-redux";
import { Resource } from "../reducer";

interface RetrievedResource extends Resource {
  isInStore: boolean;
}

const useStoredResource = (resourceId: string) => {
  const {
    data,
    isLoading,
    error,
    isInStore = true,
    acquiredDate,
    assignedHookId,
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
  return { data, isLoading, error, isInStore, acquiredDate, assignedHookId };
};

export default useStoredResource;
