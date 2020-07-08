import { useEffect } from "react";
import useGetterActionWithCache from "../useGetterActionWithCache";
import { TtlCallback } from "../types";
import useStoredResource from "../useStoredResource";

const useAcquireEffect = ({
  acquireImmediately,
  resourceId,
  getResource,
  ttl,
}: {
  acquireImmediately: boolean;
  resourceId: string;
  getResource: () => Promise<any>;
  ttl: number | TtlCallback;
}) => {
  const getResourceWithCache = useGetterActionWithCache(
    resourceId,
    getResource
  );
  const { acquiredDate, data, isInStore, isLoading } = useStoredResource(
    resourceId
  );
  useEffect(() => {
    if (!isLoading && !isInStore && acquireImmediately) {
      getResourceWithCache();
    } else if (acquiredDate && ttl) {
      const timeLeft =
        typeof ttl === "function"
          ? ttl(resourceId, data)
          : ttl - (Date.now() - acquiredDate.getTime());
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
    data,
    getResourceWithCache,
    isInStore,
    isLoading,
    resourceId,
    ttl,
  ]);
};

export default useAcquireEffect;
