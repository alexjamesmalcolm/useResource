import { useCallback } from "react";
import useActions from "../useActions";

type GetResource<T> = () => Promise<T>;

const useGetterActionWithCache = <T>(
  resourceId: string,
  getResource: GetResource<T>
): (() => Promise<T | void>) => {
  const { failure, initial, success } = useActions<T>(resourceId);
  const getResourceWithCache = useCallback(() => {
    initial();
    return getResource().then(success).catch(failure);
  }, [failure, getResource, initial, success]);
  return getResourceWithCache;
};

export default useGetterActionWithCache;
