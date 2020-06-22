import {
  REQUEST_INITIAL,
  REQUEST_SUCCESS,
  REQUEST_FAILURE,
  CLEAR_CACHED_RESOURCE,
} from "./actionTypes";
import { FilterCallback } from "./types";

interface Resource {
  isLoading: boolean;
  error: Error | false | undefined;
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

const initialState: State = { resourceHashTable: {} };

const reducer = (state: State = initialState, action: Action) => {
  switch (action.type) {
    case REQUEST_INITIAL: {
      const { resourceId } = action.data;
      const resource: Resource = {
        isLoading: true,
        error: false,
        data: null,
      };
      return {
        ...state,
        resourceHashTable: {
          ...state.resourceHashTable,
          [resourceId]: resource,
        },
      };
    }
    case REQUEST_SUCCESS: {
      const { resourceId, data } = action.data;
      const resource: Resource = {
        isLoading: false,
        error: false,
        data,
        acquiredDate: new Date(),
      };
      return {
        ...state,
        resourceHashTable: {
          ...state.resourceHashTable,
          [resourceId]: resource,
        },
      };
    }
    case REQUEST_FAILURE: {
      const { resourceId, error } = action.data;
      const resource: Resource = {
        isLoading: false,
        error,
        data: null,
      };
      return {
        ...state,
        resourceHashTable: {
          ...state.resourceHashTable,
          [resourceId]: resource,
        },
      };
    }
    case CLEAR_CACHED_RESOURCE: {
      const { filterCallback } = action.data;
      return {
        ...state,
        resourcehashTable: Object.fromEntries(
          Object.entries(
            state.resourceHashTable
          ).filter(([resourceId, value]) => filterCallback(resourceId, value))
        ),
      };
    }
    default:
      return state;
  }
};

export default reducer;
