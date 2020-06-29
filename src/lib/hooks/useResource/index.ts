import { useEffect, useMemo, useCallback } from "react";
import { useDispatch } from "react-redux";
import useStoredResource from "../useStoredResource";
import {
  requestInitial,
  requestSuccess,
  requestFailure,
  clearCachedResource,
} from "./actions";
import { FilterCallback } from "./types";

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
  const dispatch = useDispatch();
  const { acquiredDate, data, error, isInStore, isLoading } = useStoredResource(
    resourceId
  );
  const dispatchActionInitial = useCallback(
    () => dispatch(requestInitial(resourceId)),
    [dispatch, resourceId]
  );
  const dispatchActionSuccess = useCallback(
    (data: any) => dispatch(requestSuccess(resourceId, data)),
    [dispatch, resourceId]
  );
  const dispatchActionFailure = useCallback(
    (error: Error) => {
      console.warn(error);
      dispatch(requestFailure(resourceId, error));
    },
    [dispatch, resourceId]
  );
  const filterCache = useCallback(
    (filterCallback: FilterCallback) => {
      dispatch(clearCachedResource(filterCallback));
    },
    [dispatch]
  );
  const getResourceWithCache = useCallback(async () => {
    dispatchActionInitial();
    try {
      const data = await getResource();
      dispatchActionSuccess(data);
      return data;
    } catch (error) {
      dispatchActionFailure(error);
      throw error;
    }
  }, [
    dispatchActionFailure,
    dispatchActionInitial,
    dispatchActionSuccess,
    getResource,
  ]);
  const otherActionsWithCache = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(otherActions).map(([key, value]) => [
          key,
          async (...args: any[]) => {
            dispatchActionInitial();
            try {
              const data = await value(...args);
              if (data === undefined) {
                getResourceWithCache();
              } else {
                dispatchActionSuccess(data);
                return data;
              }
            } catch (error) {
              dispatchActionFailure(error);
              throw error;
            }
          },
        ])
      ),
    [
      dispatchActionFailure,
      dispatchActionInitial,
      dispatchActionSuccess,
      getResourceWithCache,
      otherActions,
    ]
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
