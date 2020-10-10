import { useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import {
  requestInitial,
  requestSuccess,
  requestFailure,
  clearCachedResource,
} from "../actions";
import { FilterCallback } from "../types";

const useActions = <T>(resourceId: string) => {
  const dispatch = useDispatch();
  const initial = useCallback(() => dispatch(requestInitial(resourceId)), [
    dispatch,
    resourceId,
  ]);
  const success = useCallback<(data: T) => T>(
    (data: T) => {
      dispatch(requestSuccess(resourceId, data));
      return data;
    },
    [dispatch, resourceId]
  );
  const failure = useCallback(
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
  return useMemo(() => ({ initial, success, failure, filterCache }), [
    failure,
    filterCache,
    initial,
    success,
  ]);
};

export default useActions;
