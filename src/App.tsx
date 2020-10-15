import React, { useCallback } from "react";
import useResource from "./lib";

const App = () => {
  const resourceId = "resourceId";
  const getResource = useCallback(() => {
    console.log("getResource has been called");
    return new Promise((resolve) => {
      setTimeout(() => resolve("Hello there"), 1000);
    });
  }, []);
  useResource(resourceId, { getResource });
  useResource(resourceId, { getResource });
  return <p>Hi</p>;
};

export default App;
