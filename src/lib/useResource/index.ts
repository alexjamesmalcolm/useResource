import { useMemo } from "react";
import useStoredResource from "./useStoredResource";
import { FilterCallback, TtlCallback, Actions } from "./types";
import useActions from "./useActions";
import useGetterActionWithCache from "./useGetterActionWithCache";
import useTransformativeActionsWithCache from "./useTransformativeActionsWithCache";
import useAcquireEffect from "./useAcquireEffect";

interface UseResourceResponse<T, A extends Actions<T>> {
  actions: A;
  isLoading: boolean;
  error: Error | false;
  data: T;
  isInStore: boolean;
  filterCache: (filterCallback: FilterCallback) => void;
}

const useResource = <T, A extends Actions<T>>(
  getResourceId: string | (() => string),
  actions: A,
  options: { acquireImmediately?: boolean; ttl?: number | TtlCallback } = {}
): UseResourceResponse<T, A> => {
  const { getResource } = actions;
  const { acquireImmediately = true, ttl = 0 } = options;
  const resourceId = useMemo(
    () =>
      typeof getResourceId === "function" ? getResourceId() : getResourceId,
    [getResourceId]
  );
  const { data, error, isInStore, isLoading } = useStoredResource(resourceId);
  const { filterCache } = useActions(resourceId);
  const getResourceWithCache = useGetterActionWithCache(
    resourceId,
    getResource
  );
  const transformativeActionsWithCache = useTransformativeActionsWithCache(
    resourceId,
    actions
  );
  useAcquireEffect({
    acquireImmediately,
    getResource,
    resourceId,
    ttl,
  });
  const cachedActions: A = {
    ...transformativeActionsWithCache,
    getResource: getResourceWithCache,
  } as A;
  return {
    actions: cachedActions,
    isLoading,
    error,
    data,
    isInStore,
    filterCache,
  };
};

export default useResource;
