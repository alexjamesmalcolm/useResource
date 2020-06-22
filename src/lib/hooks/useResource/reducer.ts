import {
  REQUEST_INITIAL,
  REQUEST_SUCCESS,
  REQUEST_FAILURE,
  CLEAR_CACHED_RESOURCE,
} from "./actionTypes";
import { FilterCallback } from "./types";

interface Resource {
  isLoading: boolean;
  error?: Error;
  data: any;
  acquiredDate?: Date;
}

interface ActionData {
  resourceId: string;
  data?: any;
  error?: Error;
  filterCallback: FilterCallback;
}

interface Action {
  type: string;
  data: ActionData;
}

interface ResourceHashTable {
  [resourceId: string]: Resource;
}

interface State {
  resourceHashTable: ResourceHashTable;
}

const modifyState = ({
  state,
  resourceId,
  resource,
}: {
  state: State;
  resourceId: any;
  resource: Resource;
}): State => ({
  ...state,
  resourceHashTable: { ...state.resourceHashTable, [resourceId]: resource },
});

const initialState: State = { resourceHashTable: {} };

const reducer = (state: State = initialState, action: Action) => {
  if (action.type === REQUEST_INITIAL)
    return modifyState({
      resource: { isLoading: true, data: null },
      resourceId: action.data.resourceId,
      state,
    });
  if (action.type === REQUEST_SUCCESS)
    return modifyState({
      resource: {
        isLoading: false,
        data: action.data.data,
        acquiredDate: new Date(),
      },
      resourceId: action.data.resourceId,
      state,
    });
  if (action.type === REQUEST_FAILURE)
    return modifyState({
      resource: {
        isLoading: false,
        error: action.data.error,
        data: null,
      },
      resourceId: action.data.resourceId,
      state,
    });
  if (action.type === CLEAR_CACHED_RESOURCE) {
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
