import { useMemo } from "react";
import useStoredResource from "./useStoredResource";
import { FilterCallback, Actions } from "./types";
import useActions from "./useActions";
import useGetterActionWithCache from "./useGetterActionWithCache";
import useTransformativeActionsWithCache from "./useTransformativeActionsWithCache";
import useAcquireEffect from "./useAcquireEffect";

interface UseResourceResponse<T extends Actions> {
  actions: T;
  isLoading: boolean;
  error: Error | false;
  data: any;
  isInStore: boolean;
  filterCache: (filterCallback: FilterCallback) => void;
}

const useResource = <T extends Actions>(
  getResourceId: string | (() => string),
  actions: T,
  options: { acquireImmediately?: boolean; ttl?: number } = {}
): UseResourceResponse<T> => {
  const { getResource } = actions;
  const { acquireImmediately = true, ttl = 0 } = options;
  const resourceId = useMemo(
    () =>
      typeof getResourceId === "function" ? getResourceId() : getResourceId,
    [getResourceId]
  );
  const { acquiredDate, data, error, isInStore, isLoading } = useStoredResource(
    resourceId
  );
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
    acquiredDate,
    getResource,
    isInStore,
    isLoading,
    resourceId,
    ttl,
  });
  const cachedActions: T = {
    ...transformativeActionsWithCache,
    getResource: getResourceWithCache,
  } as T;
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
