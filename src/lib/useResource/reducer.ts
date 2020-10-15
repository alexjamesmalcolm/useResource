import { AnyAction, Reducer } from "redux";
import { actionTypes } from "./actions";

export interface Resource {
  isLoading: boolean;
  assignedHookId?: string;
  error?: Error;
  data: any;
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
      data = null,
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
    const { resourceId, hookId } = action.data;
    const resource = getResource(resourceId);
    if (resource?.assignedHookId === undefined)
      return modifyResource(resourceId, { assignedHookId: hookId });
  }
  if (action.type === actionTypes.REQUEST_UNASSIGN) {
    return {
      resourceHashTable: Object.fromEntries(
        Object.entries(state.resourceHashTable).map((entry): [
          string,
          Resource
        ] =>
          entry[1].assignedHookId === action.data.hookId
            ? [entry[0], { isLoading: false, data: null }]
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
