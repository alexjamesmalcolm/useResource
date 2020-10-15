import React, { ReactNode } from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import useResource from ".";
import reducer from "./reducer";
import { createStore, combineReducers } from "redux";
import { TtlCallback } from "./types";

const wait = async (time: number, callback: Function = () => {}) =>
  new Promise((resolve) =>
    setTimeout(async () => resolve(await callback()), time)
  );

const makeWrapper = () => {
  const store = createStore(combineReducers({ useResource: reducer }));
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
  return Wrapper;
};

const UnderTest = ({
  resourceId,
  getResource,
  transformativeAction,
  ttl,
}: {
  resourceId: string | (() => string);
  getResource: () => Promise<unknown>;
  ttl?: number | TtlCallback;
  transformativeAction?: () => Promise<any>;
}) => {
  const {
    actions,
    data,
    error,
    filterCache,
    isInStore,
    isLoading,
  } = useResource(
    resourceId,
    transformativeAction
      ? { getResource, transformativeAction }
      : { getResource },
    { ttl }
  );
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <>
      <pre>{JSON.stringify(data)}</pre>
      {actions.transformativeAction && (
        <button
          id="transformative-action"
          onClick={actions.transformativeAction}
        >
          Transformative
        </button>
      )}
    </>
  );
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
      const resourceId = (Date.now() + Math.random()).toString();
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
    const resourceId = (Date.now() + Math.random()).toString();
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

  it("should use a transformative action that returns the new state", async () => {
    const Wrapper = makeWrapper();
    const resourceId = (Date.now() + Math.random()).toString();
    const initial = "initial data";
    const final = "final data";
    const getResource = jest
      .fn()
      .mockImplementation(() => Promise.resolve(initial));
    const transformativeAction = jest
      .fn()
      .mockImplementation(() => Promise.resolve(final));
    const underTest = mount(
      <Wrapper>
        <UnderTest
          getResource={getResource}
          resourceId={resourceId}
          transformativeAction={transformativeAction}
        />
      </Wrapper>
    );
    await wait(100);
    expect(underTest.update().debug().includes("Loading")).toBe(false);
    await wait(100);
    underTest.find("#transformative-action").simulate("click");
    await wait(100);
    expect(underTest.update().debug().includes(final)).toBe(true);
  });

  it("should use a transformative action that does not return the new state", async () => {
    const Wrapper = makeWrapper();
    const resourceId = (Date.now() + Math.random()).toString();
    const initial = "initial data";
    const final = "final data";
    let state = initial;
    const getResource = jest
      .fn()
      .mockImplementation(() => Promise.resolve(state));
    const transformativeAction = jest.fn().mockImplementation(async () => {
      state = final;
      return;
    });
    const underTest = mount(
      <Wrapper>
        <UnderTest
          getResource={getResource}
          resourceId={resourceId}
          transformativeAction={transformativeAction}
        />
      </Wrapper>
    );
    await wait(100);
    expect(underTest.update().debug().includes("Loading")).toBe(false);
    await wait(100);
    underTest.find("#transformative-action").simulate("click");
    await wait(100);
    expect(underTest.update().debug().includes(final)).toBe(true);
  });
  it("should accept a function for ttl", async () => {
    const Wrapper = makeWrapper();
    const resourceId = (Date.now() + Math.random()).toString();
    const getResource = jest
      .fn()
      .mockImplementation(() => Promise.resolve("result"));
    const ttl = () => 2000;
    mount(
      <Wrapper>
        <UnderTest
          getResource={getResource}
          resourceId={resourceId}
          ttl={ttl}
        />
      </Wrapper>
    );
    await wait(1000, () => expect(getResource).toBeCalledTimes(1));
    await wait(3000, () => expect(getResource).toBeCalledTimes(2));
  });
  it("should only call getResource once", async () => {
    const Wrapper = makeWrapper();
    const UnderTest = ({
      resourceId,
      getResource,
    }: {
      resourceId: string;
      getResource: () => Promise<string>;
    }) => {
      useResource(resourceId, { getResource });
      useResource(resourceId, { getResource });
      return <p>This is some content</p>;
    };
    const resourceId = "hello-there";
    const getResource = jest
      .fn()
      .mockReturnValue(Promise.resolve("so uncivilized"));
    mount(
      <Wrapper>
        <UnderTest getResource={getResource} resourceId={resourceId} />
      </Wrapper>
    );
    await wait(1000, () => expect(getResource).toBeCalledTimes(1));
  });
});
