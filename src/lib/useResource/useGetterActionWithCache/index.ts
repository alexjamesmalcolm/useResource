import { useCallback } from "react";
import useActions from "../useActions";

const useGetterActionWithCache = (
  resourceId: string,
  getResource: () => Promise<any>
) => {
  const { failure, initial, success } = useActions(resourceId);
  const getResourceWithCache: () => void = useCallback(() => {
    initial();
    getResource().then(success).catch(failure);
  }, [failure, getResource, initial, success]);
  return getResourceWithCache;
};

export default useGetterActionWithCache;
