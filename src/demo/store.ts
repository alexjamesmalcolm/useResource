import { createStore, combineReducers } from "redux";
import { reducer as useResource } from "../lib";

const rootReducer = combineReducers({ useResource });

const store = createStore(rootReducer);

export default store;
