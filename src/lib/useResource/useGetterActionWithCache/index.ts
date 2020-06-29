import { useCallback } from "react";
import useActions from "../useActions";

const useGetterActionWithCache = (
  resourceId: string,
  getResource: () => Promise<any>
) => {
  const { failure, initial, success } = useActions(resourceId);
  const getResourceWithCache = useCallback(async () => {
    initial();
    try {
      const data = await getResource();
      success(data);
      return data;
    } catch (error) {
      failure(error);
      throw error;
    }
  }, [failure, initial, success, getResource]);
  return getResourceWithCache;
};

export default useGetterActionWithCache;
