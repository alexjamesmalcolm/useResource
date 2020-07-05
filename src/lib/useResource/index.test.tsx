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

const makeWrapper = () => {
  const store = createStore(combineReducers({ useResource: reducer }));
  const Wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );
  return Wrapper;
};

const UnderTest = ({
  resourceId,
  getResource,
  ttl,
}: {
  resourceId: any;
  getResource: any;
  ttl?: any;
}) => {
  const {
    actions,
    data,
    error,
    filterCache,
    isInStore,
    isLoading,
  } = useResource(resourceId, { getResource }, { ttl });
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return <pre>{JSON.stringify(data)}</pre>;
};

describe("useResource", () => {
  it("should load and then finish after a second", async () => {
    const resourceId = "Resource ID";
    const data = "This is the data that we should be seeing";
    const getResource = jest
      .fn()
      .mockImplementation(() => Promise.resolve(data));
    const Wrapper = makeWrapper();
    const underTest = mount(
      <Wrapper>
        <UnderTest getResource={getResource} resourceId={resourceId} />
      </Wrapper>
    );
    wait(1000, () =>
      expect(underTest.update().debug().includes(data)).toBe(true)
    );
  });

  it("should only keep data for 2 seconds due to 2000 ttl", async () =>
    new Promise((resolve) => {
      const Wrapper = makeWrapper();
      const resourceId = Date.now() + Math.random();
      const ttl = 2000;
      const getResource = jest
        .fn()
        .mockImplementation(() => Promise.resolve(Date.now()));
      mount(
        <Wrapper>
          <UnderTest
            getResource={getResource}
            resourceId={resourceId}
            ttl={ttl}
          />
        </Wrapper>
      );
      wait(1000, () => expect(getResource).toBeCalledTimes(1));
      wait(3000, () => {
        expect(getResource).toBeCalledTimes(2);
        resolve();
      });
    }));

  it("should display an error when the getResource function fails", async () => {
    const Wrapper = makeWrapper();
    const resourceId = Date.now() + Math.random();
    const errorMessage = "Whoopsie there was a problem";
    const getResource = jest
      .fn()
      .mockImplementation(() => Promise.reject(new Error(errorMessage)));
    const underTest = mount(
      <Wrapper>
        <UnderTest getResource={getResource} resourceId={resourceId} />
      </Wrapper>
    );
    await wait(100);
    underTest.update();
    expect(underTest.debug().includes(errorMessage)).toBe(true);
  });
});
