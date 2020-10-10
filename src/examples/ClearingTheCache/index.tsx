import React, { useMemo, useCallback, useState } from "react";
import useResource from "../../lib";

const idPrefix = "useJokes";

const useJokes = ({
  categories: { programming = true, miscellaneous = true, dark = true },
  blacklist: {
    nsfw = false,
    religious = false,
    political = false,
    racist = false,
    sexist = false,
  },
  searchText = "",
}) => {
  const resourceId = useMemo(
    () =>
      `${idPrefix}: ${JSON.stringify({
        programming,
        miscellaneous,
        dark,
        nsfw,
        political,
        religious,
        racist,
        sexist,
        searchText,
      })}`,
    [
      dark,
      miscellaneous,
      nsfw,
      political,
      programming,
      racist,
      religious,
      searchText,
      sexist,
    ]
  );
  const getResource = useCallback(() => {
    const categories = Object.entries({
      Programming: programming,
      Miscellaneous: miscellaneous,
      Dark: dark,
    })
      .filter(([, value]) => value)
      .map(([key]) => key)
      .join(",");
    const blacklist = Object.entries({
      nsfw,
      religious,
      political,
      racist,
      sexist,
    })
      .filter(([, value]) => value)
      .map(([key]) => key)
      .join(",");
    return fetch(
      `https://sv443.net/jokeapi/v2/joke/${categories}?blacklistFlags=${blacklist}&contains=${searchText}`
    ).then((response) => response.json());
  }, [
    dark,
    miscellaneous,
    nsfw,
    political,
    programming,
    racist,
    religious,
    searchText,
    sexist,
  ]);
  const {
    actions,
    data,
    error,
    filterCache,
    isLoading,
  } = useResource(resourceId, { getResource });
  const clearAllJokes = useCallback(() => {
    filterCache((id) => !id.startsWith(idPrefix));
  }, [filterCache]);
  return {
    data,
    actions: { search: actions.getResource, clearAllJokes },
    isLoading,
    error,
  };
};

const ClearingTheCache = () => {
  const [searchText, setSearchText] = useState("");
  const {
    actions: { clearAllJokes, search },
    data,
    error,
    isLoading,
  } = useJokes({ blacklist: {}, categories: {}, searchText });
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>There was an error: {error.message}</p>;
  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <button onClick={clearAllJokes}>Clear Cache</button>
      <button onClick={search}>Search</button>
    </div>
  );
};

export default ClearingTheCache;
