import { AnyAction, Reducer } from "redux";
import { actionTypes } from "./actions";

export interface Resource {
  isLoading: boolean;
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

const reducer: Reducer<State, AnyAction> = (
  state: State = initialState,
  action: AnyAction
) => {
  if (action.type === actionTypes.REQUEST_INITIAL)
    return modifyState({
      resource: { isLoading: true, data: null },
      resourceId: action.data.resourceId,
      state,
    });
  if (action.type === actionTypes.REQUEST_SUCCESS)
    return modifyState({
      resource: {
        isLoading: false,
        data: action.data.data,
        acquiredDate: new Date().toISOString(),
      },
      resourceId: action.data.resourceId,
      state,
    });
  if (action.type === actionTypes.REQUEST_FAILURE)
    return modifyState({
      resource: {
        isLoading: false,
        error: action.data.error,
        data: null,
      },
      resourceId: action.data.resourceId,
      state,
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
