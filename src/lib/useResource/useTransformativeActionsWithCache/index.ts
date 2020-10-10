import { useMemo } from "react";
import useActions from "../useActions";
import { OtherActions } from "../types";
import useGetterActionWithCache from "../useGetterActionWithCache";

const useTransformativeActionsWithCache = <
  T extends unknown,
  A extends OtherActions<T>
>(
  resourceId: string,
  actions: { getResource: () => Promise<T> } & A
) => {
  const { failure, initial, success } = useActions(resourceId);
  const { getResource, ...transformativeActions } = actions;
  const getResourceWithCache = useGetterActionWithCache(
    resourceId,
    getResource
  );
  const transformativeActionsWithCache = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(transformativeActions).map(([key, value]) => [
          key,
          async (...args: any[]) => {
            initial();
            (value(...args) as Promise<T | undefined>)
              .then((data: T | undefined) =>
                data === undefined ? getResourceWithCache() : success(data)
              )
              .catch((error) => {
                failure(error);
                throw error;
              });
          },
        ])
      ),
    [failure, initial, success, getResourceWithCache, transformativeActions]
  );
  return transformativeActionsWithCache;
};

export default useTransformativeActionsWithCache;
