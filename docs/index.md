---
title: Setup
permalink: /index.html
nav_order: 0
---

# useResource

This is a React custom hook meant for assisting in the retrieval of remote data and the caching of it once acquired using redux.

## {{ page.title }}

This project has two exports, the default which is the `useResource` hook, and a `{ reducer }`.

```javascript
import useResource, { reducer } from "@alexjamesmalcolm/use-resource";
```

### Redux

Before being able to use the `useResource` you must first include the `reducer` into your `rootReducer`

```javascript
import { createStore, combineReducers } from "redux";
import { reducer as useResource } from "@alexjamesmalcolm/use-resource";

const rootReducer = combineReducers({ useResource });

const store = createStore(rootReducer);

export default store;
```

It's very important that the reducer is initialized as `useResource`.

### Wrapped in a Custom Hook

If you're unfamiliar with custom hooks you can read about them in [React's documentation](https://reactjs.org/docs/hooks-custom.html)

It's recommended that `useResource` be used inside of a custom hook. For example you may want a hook that retrieves and pages through lists of breweries thanks to https://www.openbrewerydb.org/

```typescript
import { useMemo, useCallback } from "react";
import useResource from "../../lib"; // normally from "@alexjamesmalcolm/use-resource";

interface Brewery {
  id: number;
  name: string;
  brewery_type: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  longitude: string;
  latitude: string;
  phone: string;
  website_url: string;
  updated_at: string;
  tag_list: [];
}

const useBreweries = ({
  pageNumber = 1,
  pageSize = 10,
}: {
  pageNumber?: number;
  pageSize?: number;
} = {}) => {
  const resourceId: string = useMemo(
    () => `useBreweries: page ${pageNumber} with ${pageSize} per page`,
    [pageNumber, pageSize]
  );
  const getResource = useCallback(
    () =>
      fetch(
        `https://api.openbrewerydb.org/breweries?page=${pageNumber}&per_page=${pageSize}`
      ).then((response) => response.json()),
    [pageNumber, pageSize]
  );
  const {
    data,
    error,
    filterCache,
    isInStore,
    isLoading,
    actions,
  } = useResource(resourceId, { getResource });
  return { breweries: data as Brewery[], error, isLoading };
};

export default useBreweries;
```

### Using our Custom Hook in a Component

Then we implement `useBreweries` in our example component:

```jsx
import React, { useState, useCallback } from "react";
import useBreweries from "../../hooks/useBreweries";

const Setup = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const { breweries, isLoading, error } = useBreweries({ pageNumber });
  const previousPage = useCallback(
    () => setPageNumber(Math.max(1, pageNumber - 1)),
    [pageNumber]
  );
  const nextPage = useCallback(() => setPageNumber(pageNumber + 1), [
    pageNumber,
  ]);
  if (isLoading || !breweries) return <p>Loading breweries...</p>;
  if (error) return <p>There was an error: {error.message}</p>;
  return (
    <>
      <button onClick={previousPage}>Previous</button>
      <button onClick={nextPage}>Next</button>
      {breweries.map((brewery) => (
        <div key={brewery.id}>
          <p>{brewery.name}</p>
          <p>{brewery.state}</p>
        </div>
      ))}
      <button onClick={previousPage}>Previous</button>
      <button onClick={nextPage}>Next</button>
    </>
  );
};

export default Setup;
```
