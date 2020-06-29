import { useEffect, useMemo, useCallback } from "react";
import useStoredResource from "../useStoredResource";
import { FilterCallback } from "./types";
import useActions from "../useActions";

interface UseResourceResponse<T extends Actions> {
  actions: T;
  isLoading: boolean;
  error: Error | false;
  data: any;
  isInStore: boolean;
  filterCache: (filterCallback: FilterCallback) => void;
}

interface Actions {
  getResource: () => Promise<any>;
  [key: string]: (() => Promise<any>) | (() => Promise<void>);
}

const useResource = <T extends Actions>(
  getResourceId: string | (() => string),
  actions: T,
  options: { acquireImmediately?: boolean; ttl?: number } = {}
): UseResourceResponse<T> => {
  const { getResource, ...otherActions } = actions;
  const { acquireImmediately = true, ttl = 0 } = options;
  const resourceId = useMemo(
    () =>
      typeof getResourceId === "function" ? getResourceId() : getResourceId,
    [getResourceId]
  );
  const { acquiredDate, data, error, isInStore, isLoading } = useStoredResource(
    resourceId
  );
  const { failure, initial, success, filterCache } = useActions(resourceId);
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
  const otherActionsWithCache = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(otherActions).map(([key, value]) => [
          key,
          async (...args: any[]) => {
            initial();
            try {
              const data = await value(...args);
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
  useEffect(() => {
    if (!isLoading && !isInStore && acquireImmediately) {
      getResourceWithCache();
    } else if (acquiredDate && ttl) {
      const timeLeft = ttl - (Date.now() - acquiredDate.getTime());
      if (timeLeft > 0) {
        const timeoutId = setTimeout(() => {
          getResourceWithCache();
        }, timeLeft);
        return () => clearTimeout(timeoutId);
      } else {
        getResourceWithCache();
      }
    }
  }, [
    acquireImmediately,
    acquiredDate,
    getResourceWithCache,
    isInStore,
    isLoading,
    ttl,
  ]);
  const cachedActions: T = {
    ...otherActionsWithCache,
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
