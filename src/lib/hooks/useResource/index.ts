import { useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  requestInitial,
  requestSuccess,
  requestFailure,
  clearCachedResource,
} from "./actions";
import { FilterCallback } from "./types";

interface RetrievedResource {
  isLoading: boolean;
  isInStore: boolean;
  data: any;
  error: Error | false;
  acquiredDate?: Date;
}

interface UseResourceResponse<T extends Actions> {
  actions: T;
  isLoading: boolean;
  error: Error | false;
  data: any;
  isInStore: boolean;
  filterCache: Function;
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
  const {
    data,
    isLoading,
    error,
    isInStore = true,
    acquiredDate,
  } = useSelector(
    (state: any): RetrievedResource => {
      const { resourceHashTable } = state.useResource;
      const requestData = resourceHashTable[resourceId];
      const defaultData = {
        data: null,
        isLoading: false,
        error: false,
        isInStore: false,
      };
      return requestData || defaultData;
    }
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
