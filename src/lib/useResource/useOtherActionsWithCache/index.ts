import { useMemo } from "react";
import useActions from "../useActions";
import { Actions } from "../types";
import useGetterActionWithCache from "../useGetterActionWithCache";

const useOtherActionsWithCache = (resourceId: string, actions: Actions) => {
  const { failure, initial, success } = useActions(resourceId);
  const { getResource, ...otherActions } = actions;
  const getResourceWithCache = useGetterActionWithCache(
    resourceId,
    getResource
  );
  const otherActionsWithCache = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(otherActions).map(([key, value]) => [
          key,
          async (...args: any[]) => {
            initial();
            try {
              const func: Function = value;
              const data = await func(...args);
              if (data === undefined) {
                getResourceWithCache();
              } else {
                success(data);
                return data;
              }
            } catch (error) {
              failure(error);
              throw error;
            }
          },
        ])
      ),
    [failure, initial, success, getResourceWithCache, otherActions]
  );
  return otherActionsWithCache;
};

export default useOtherActionsWithCache;
