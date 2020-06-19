# useResource

This is a React custom hook meant for assisting in the retrieval of remote data and the caching of it once acquired using redux.

## Setup

This project has two exports, the default which is the `useResource` hook, and a `{ reducer }`.

```javascript
import useResource, { reducer } from "@alexjamesmalcolm/use-resource";
```

Before being able to use the `useResource` you must first include the `reducer` into your `rootReducer`

```javascript
import { createStore, combineReducers } from "redux";
import { reducer as useResource } from "@alexjamesmalcolm/use-resource";

const rootReducer = combineReducers({ useResource });

const store = createStore(rootReducer);

export default store;
```

It's very important that the reducer is initialized as `useResource`.

It's recommended that `useResource` be used inside of a custom hook. For example you may want a hook that retrieves and pages through lists of breweries thanks to https://www.openbrewerydb.org/

###### TODO Create custom hook `useBreweries`

## Documentation

### Time-sensitive data

###### TODO: Document this

### Acquiring Immediately

###### TODO: Document this

### Creating, Updating, and Deleting the Resource

###### TODO: Document this

### Clearing the Cache

###### TODO: Document this

## TODO

- Allow for custom reducer names
- Internalize state management so `reducer` does not need to be exported
