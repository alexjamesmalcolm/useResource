import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import useResource from ".";
import reducer from "./reducer";
import { createStore, combineReducers } from "redux";

const wait = async (time: number, callback: Function = () => {}) =>
  new Promise((resolve) =>
    setTimeout(async () => resolve(await callback()), time)
  );

const store = createStore(combineReducers({ useResource: reducer }));

const Wrapper = ({ children }) => <Provider store={store}>{children}</Provider>;

const UnderTest = ({ resourceId, getResource }) => {
  const {
    actions,
    data,
    error,
    filterCache,
    isInStore,
    isLoading,
  } = useResource(resourceId, { getResource });
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return <pre>{JSON.stringify(data)}</pre>;
};

describe("useResource", () => {
  it("should load and then finish after a second", async () => {
    const resourceId = "Resource ID";
    const data = "This is the data that we should be seeing";
    const getResource = () => Promise.resolve(data);
    const underTest = mount(
      <Wrapper>
        <UnderTest getResource={getResource} resourceId={resourceId} />
      </Wrapper>
    );
    expect(underTest.debug().includes("Loading...")).toBe(true);
    wait(1000, () => expect(underTest.debug().includes(data)).toBe(true));
  });
});
