import {
  REQUEST_INITIAL,
  REQUEST_SUCCESS,
  REQUEST_FAILURE,
  CLEAR_CACHED_RESOURCE,
} from "./actionTypes";
import { ResourceId, FilterCallback } from "./types";

interface ActionData {
  resourceId: ResourceId;
  data?: any;
  error?: Error;
  filterCallback: FilterCallback;
}

interface Action {
  type: string;
  data: ActionData;
}

const initialState = { resourceHashTable: {} };

const reducer = (state = initialState, action: Action) => {
  // if (!resourceId) return state;
  switch (action.type) {
    case REQUEST_INITIAL: {
      const { resourceId } = action.data;
      return {
        ...state,
        resourceHashTable: {
          ...state.resourceHashTable,
          [resourceId]: {
            isLoading: true,
            error: false,
            data: null,
          },
        },
      };
    }
    case REQUEST_SUCCESS: {
      const { resourceId, data } = action.data;
      return {
        ...state,
        resourceHashTable: {
          ...state.resourceHashTable,
          [resourceId]: {
            isLoading: false,
            error: false,
            data,
          },
        },
      };
    }
    case REQUEST_FAILURE: {
      const { resourceId, error } = action.data;
      return {
        ...state,
        resourceHashTable: {
          ...state.resourceHashTable,
          [resourceId]: {
            isLoading: false,
            error,
            data: null,
          },
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
