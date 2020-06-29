import { useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  requestInitial,
  requestSuccess,
  requestFailure,
  clearCachedResource,
} from "../actions";
import { FilterCallback } from "../types";

const useActions = (resourceId: string) => {
  const dispatch = useDispatch();
  const initial = useCallback(() => dispatch(requestInitial(resourceId)), [
    dispatch,
    resourceId,
  ]);
  const success = useCallback(
    (data: any) => dispatch(requestSuccess(resourceId, data)),
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
  return { initial, success, failure, filterCache };
};

export default useActions;
