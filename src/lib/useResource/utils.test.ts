import { uniqueIdentifier } from "./utils";

const doNTimes = (action: Function, times: number) => {
  const array = [...Array(times)];
  array.forEach(() => action());
  console.time();
  array.forEach(() => action());
  console.timeEnd();
};

describe("uniqueIdentifier", () => {
  it("should complete quickly", () => {
    doNTimes(uniqueIdentifier, 10000);
  });
});
