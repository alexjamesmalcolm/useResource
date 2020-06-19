import { useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  requestInitial,
  requestSuccess,
  requestFailure,
  clearCachedResource,
} from "./actions";
import { GetResourceId, FilterCallback } from "./types";

interface RetrievedResource {
  isLoading: boolean;
  isInStore: boolean;
  data: any;
  error: Error | boolean;
  acquiredDate?: Date;
}

const useResource = (
  getResourceId: string | GetResourceId,
  actions: { getResource: Function; [key: string]: Function },
  options: { acquireImmediately?: boolean; ttl?: number } = {}
) => {
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
    } catch (error) {
      dispatchActionFailure(error);
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
              }
            } catch (error) {
              dispatchActionFailure(error);
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
  return {
    actions: { ...otherActionsWithCache, getResource: getResourceWithCache },
    isLoading,
    error,
    data,
    isInStore,
    filterCache,
  };
};

export default useResource;
