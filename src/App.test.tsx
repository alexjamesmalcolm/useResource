import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "./store";
import App from "./App";
import * as useResource from "./lib";

it("renders without crashing", () => {
  const useResourceSpy = jest.spyOn(useResource, "default");
  useResourceSpy.mockReturnValue({
    actions: { getResource: jest.fn() },
    data: null,
    isLoading: true,
    error: null,
    filterCache: jest.fn(),
    isInStore: false,
  });
  // const div = document.createElement("div");
  // ReactDOM.render(<App />, div);
  // ReactDOM.unmountComponentAtNode(div);
});

test("renders learn react link", () => {
  const { getByText } = render(
    <Provider store={store}>
      <App />
    </Provider>
  );
});
