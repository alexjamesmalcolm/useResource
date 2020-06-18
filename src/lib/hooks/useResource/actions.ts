import {
  REQUEST_INITIAL,
  REQUEST_SUCCESS,
  REQUEST_FAILURE,
  CLEAR_CACHED_RESOURCE,
} from "./actionTypes";
import { FilterCallback } from "./types";

export const requestInitial = (resourceId: string) => ({
  type: REQUEST_INITIAL,
  data: { resourceId },
});
export const requestSuccess = (resourceId: string, data: any) => ({
  type: REQUEST_SUCCESS,
  data: { resourceId, data },
});
export const requestFailure = (resourceId: string, error: Error) => ({
  type: REQUEST_FAILURE,
  data: { resourceId, error },
});
export const clearCachedResource = (filterCallback: FilterCallback) => ({
  type: CLEAR_CACHED_RESOURCE,
  data: { filterCallback },
});
