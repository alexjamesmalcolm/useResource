import React, { useCallback } from "react";
import useResource from "../lib";

const App = () => {
  const getResourceId = useCallback(() => {
    return "resource-id";
  }, []);
  const getResource = useCallback(
    () =>
      fetch("http://www.asterank.com/api/mpc?limit=100").then((response) =>
        response.json()
      ),
    []
  );
  const { isLoading, data } = useResource(getResourceId, { getResource });
  if (isLoading || !data) return <p>Loading...</p>;
  console.log(data);
  return (
    <div>
      <pre>
        {data.map((planet) => (
          <p key={planet.readable_des}>{planet.readable_des}</p>
        ))}
      </pre>
    </div>
  );
};

export default App;
