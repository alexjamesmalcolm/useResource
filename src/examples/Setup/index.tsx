import React, { useState, useCallback } from "react";
import useBreweries from "../../hooks/useBreweries";

const Setup = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const { breweries, isLoading, error } = useBreweries({ pageNumber });
  const previousPage = useCallback(
    () => setPageNumber(Math.max(1, pageNumber - 1)),
    [pageNumber],
  );
  const nextPage = useCallback(
    () => setPageNumber(pageNumber + 1),
    [pageNumber],
  );
  if (isLoading || !breweries) return <p>Loading breweries...</p>;
  if (error) return <p>There was an error: {error.message}</p>;
  return <>
    <button onClick={previousPage}>Previous</button>
    <button onClick={nextPage}>Next</button>
    {breweries.map((brewery) =>
      <div key={brewery.id}>
        <p>{brewery.name}</p>
        <p>{brewery.state}</p>
      </div>
    )}
    <button onClick={previousPage}>Previous</button>
    <button onClick={nextPage}>Next</button>
  </>;
};

export default Setup;
