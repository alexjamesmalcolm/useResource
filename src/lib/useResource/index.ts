import { useMemo } from "react";
import useStoredResource from "./useStoredResource";
import { FilterCallback, TtlCallback, OtherActions } from "./types";
import useActions from "./useActions";
import useGetterActionWithCache from "./useGetterActionWithCache";
import useTransformativeActionsWithCache from "./useTransformativeActionsWithCache";
import useAcquireEffect from "./useAcquireEffect";

type Primitive = number | boolean | string;
type SerializableObject = {
  [key in number | string]: Primitive;
};
type Serializable = SerializableObject | SerializableObject[] | Primitive;

interface UseResourceResponse<T, A extends OtherActions<T>> {
  actions: { getResource: () => Promise<T> } & A;
  isLoading: boolean;
  error?: Error;
  data: T;
  isInStore: boolean;
  filterCache: (filterCallback: FilterCallback) => void;
}

const useResource = <
  T extends unknown,
  A extends OtherActions<T>,
  S extends Serializable
>(
  getResourceId: string | (() => string),
  actions: { getResource: () => Promise<T> } & A,
  options: {
    acquireImmediately?: boolean;
    ttl?: number | TtlCallback;
    serialization?: {
      serializer: (data: T) => S;
      deserializer: (serializedData: S) => T;
    };
  } = {}
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
  const transformativeActionsWithCache = useTransformativeActionsWithCache<
    T,
    A
  >(resourceId, actions);
  useAcquireEffect({
    acquireImmediately,
    getResource,
    resourceId,
    ttl,
  });
  const cachedActions = useMemo(
    () =>
      ({
        ...transformativeActionsWithCache,
        getResource: getResourceWithCache,
      } as { getResource: () => Promise<T> } & A),
    [getResourceWithCache, transformativeActionsWithCache]
  );
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
