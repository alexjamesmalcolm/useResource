import { useCallback } from "react";
import useActions from "../useActions";

type GetResource<T> = () => Promise<T>;

const useGetterActionWithCache = <T>(
  resourceId: string,
  getResource: GetResource<T>
): (() => Promise<T | void>) => {
  const { failure, initial, success } = useActions<T>(resourceId);
  const getResourceWithCache = useCallback(async () => {
    initial();
    try {
      return success(await getResource());
    } catch (error) {
      return failure(error);
    }
  }, [failure, getResource, initial, success]);
  return getResourceWithCache;
};

export default useGetterActionWithCache;
