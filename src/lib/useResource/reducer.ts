import { AnyAction, Reducer } from "redux";
import { actionTypes } from "./actions";

export interface Resource {
  isLoading: boolean;
  assignedHookId?: string;
  error?: Error;
  data?: any;
  acquiredDate?: string;
}

interface ResourceHashTable {
  [resourceId: string]: Resource;
}

interface State {
  resourceHashTable: ResourceHashTable;
}

const initialState: State = { resourceHashTable: {} };

const reducer: Reducer<State, AnyAction> = (
  state: State = initialState,
  action: AnyAction
) => {
  const getResource = (resourceId: string): Resource | undefined =>
    state.resourceHashTable[resourceId];
  const modifyResource = (
    resourceId: string,
    resource: Partial<Resource>
  ): State => {
    const {
      data = undefined,
      isLoading = false,
      acquiredDate,
      assignedHookId,
      error,
    } = getResource(resourceId) || {};
    const previousResource = {
      data,
      isLoading,
      acquiredDate,
      assignedHookId,
      error,
    };
    return {
      resourceHashTable: {
        ...state.resourceHashTable,
        [resourceId]: { ...previousResource, ...resource },
      },
    };
  };
  if (action.type === actionTypes.REQUEST_ASSIGN) {
    const { resourceId, hookId, acquireImmediately } = action.data;
    const initialResource: Resource = {
      data: undefined,
      assignedHookId: hookId,
      isLoading: acquireImmediately,
    };
    const resourceHashTable: ResourceHashTable = {
      [resourceId]: initialResource,
      ...state.resourceHashTable,
    };
    return {
      resourceHashTable: Object.fromEntries(
        Object.entries(resourceHashTable).map((entry): [string, Resource] => {
          if (entry[0] === resourceId)
            return [entry[0], { ...entry[1], assignedHookId: hookId }];
          if (entry[1].assignedHookId === hookId)
            return [entry[0], { ...entry[1], assignedHookId: undefined }];
          return entry;
        })
      ),
    };
  }
  if (action.type === actionTypes.REQUEST_UNASSIGN) {
    const entries = Object.entries(state.resourceHashTable);
    const isResourceEntryAssignedToThisHook = (
      entry: [string, Resource]
    ): boolean => entry[1].assignedHookId === action.data.hookId;
    if (!entries.some(isResourceEntryAssignedToThisHook)) return state;
    return {
      resourceHashTable: Object.fromEntries(
        entries.map((entry): [string, Resource] =>
          isResourceEntryAssignedToThisHook(entry)
            ? [entry[0], { isLoading: false, data: undefined }]
            : entry
        )
      ),
    };
  }
  if (action.type === actionTypes.REQUEST_INITIAL)
    return modifyResource(action.data.resourceId, {
      isLoading: true,
      assignedHookId: undefined,
      error: undefined,
      acquiredDate: undefined,
    });
  if (action.type === actionTypes.REQUEST_SUCCESS)
    return modifyResource(action.data.resourceId, {
      isLoading: false,
      data: action.data.data,
      acquiredDate: new Date().toISOString(),
    });
  if (action.type === actionTypes.REQUEST_FAILURE)
    return modifyResource(action.data.resourceId, {
      isLoading: false,
      error: action.data.error,
    });
  if (action.type === actionTypes.CLEAR_CACHED_RESOURCE) {
    const { filterCallback } = action.data;
    return {
      ...state,
      resourceHashTable: Object.fromEntries(
        Object.entries(state.resourceHashTable).filter(([resourceId, value]) =>
          filterCallback(resourceId, value)
        )
      ),
    };
  }
  return state;
};

export default reducer;
