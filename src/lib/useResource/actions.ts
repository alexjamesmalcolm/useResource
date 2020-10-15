import { FilterCallback } from "./types";

const p = "useResource";
export const actionTypes = {
  REQUEST_ASSIGN: `${p}_REQUEST_ASSIGN`,
  REQUEST_UNASSIGN: `${p}_REQUEST_UNASSIGN`,
  REQUEST_INITIAL: `${p}_REQUEST_INITIAL`,
  REQUEST_SUCCESS: `${p}_REQUEST_SUCCESS`,
  REQUEST_FAILURE: `${p}_REQUEST_FAILURE`,
  CLEAR_CACHED_RESOURCE: `${p}_CLEAR_CACHED_RESOURCE`,
};

export const requestAssign = (resourceId: string, hookId: string) => ({
  type: actionTypes.REQUEST_ASSIGN,
  data: { resourceId, hookId },
});
export const requestUnassign = (hookId: string) => ({
  type: actionTypes.REQUEST_UNASSIGN,
  data: { hookId },
});
export const requestInitial = (resourceId: string) => ({
  type: actionTypes.REQUEST_INITIAL,
  data: { resourceId },
});
export const requestSuccess = (resourceId: string, data: any) => ({
  type: actionTypes.REQUEST_SUCCESS,
  data: { resourceId, data },
});
export const requestFailure = (resourceId: string, error: Error) => ({
  type: actionTypes.REQUEST_FAILURE,
  data: { resourceId, error },
});
export const clearCachedResource = (filterCallback: FilterCallback) => ({
  type: actionTypes.CLEAR_CACHED_RESOURCE,
  data: { filterCallback },
});
