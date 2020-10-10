import React, { useCallback } from "react";
import useResource from "./lib";
import Setup from "./examples/Setup";

const App = () => {
  // const getResourceId = useCallback(() => {
  //   return "resource-id";
  // }, []);
  // const getResource = useCallback(
  //   () =>
  //     fetch("http://www.asterank.com/api/mpc?limit=100").then((response) =>
  //       response.json()
  //     ),
  //   []
  // );
  // const { isLoading, data } = useResource(getResourceId, { getResource });
  // if (isLoading || !data) return <p>Loading...</p>;
  // console.log(data);
  const getResource = useCallback(() => Promise.resolve(1), []);
  const doNothing = useCallback(() => Promise.resolve(), []);
  const {
    data,
    actions: { doNothing: a, getResource: b },
  } = useResource("hi", { getResource, doNothing });
  return (
    <p>{data}</p>
    // <Setup />
    // <div>
    //   <pre>
    //     {data.map((planet) => (
    //       <p key={planet.readable_des}>{planet.readable_des}</p>
    //     ))}
    //   </pre>
    // </div>
  );
};

export default App;
