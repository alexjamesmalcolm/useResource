import { useEffect } from "react";
import useGetterActionWithCache from "../useGetterActionWithCache";

const useAcquireEffect = ({
  isLoading,
  isInStore,
  acquireImmediately,
  resourceId,
  getResource,
  acquiredDate,
  ttl,
}: {
  isLoading: boolean;
  isInStore: boolean;
  acquireImmediately: boolean;
  resourceId: string;
  getResource: () => Promise<any>;
  acquiredDate: Date | undefined;
  ttl: number;
}) => {
  const getResourceWithCache = useGetterActionWithCache(
    resourceId,
    getResource
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
};

export default useAcquireEffect;
