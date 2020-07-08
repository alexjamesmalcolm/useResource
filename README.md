[![npm](https://img.shields.io/npm/v/@alexjamesmalcolm/use-resource)](https://www.npmjs.com/package/@alexjamesmalcolm/use-resource)
[![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/alexjamesmalcolm/use-resource/Build%20%26%20Test)](https://github.com/alexjamesmalcolm/use-resource/actions)
[![Coveralls github](https://img.shields.io/coveralls/github/alexjamesmalcolm/use-resource)](https://coveralls.io/github/alexjamesmalcolm/use-resource)
[![npm bundle size](https://img.shields.io/bundlephobia/min/@alexjamesmalcolm/use-resource)](https://www.npmjs.com/package/@alexjamesmalcolm/use-resource)
![MIT License](https://img.shields.io/npm/l/@alexjamesmalcolm/use-resource)

# useResource

This is a React custom hook meant for assisting in the retrieval of remote data and the caching of it once acquired using redux.

## Documentation

Read the [documentation](http://www.alexjamesmalcolm.com/use-resource/), if there's a concept you'd like further explained or a feature you would like requested you can open an issue.

## TODO

- Allow for custom reducer names
- Internalize state management so `reducer` does not need to be exported
- ~~Allow passing a function instead of a number to `ttl` in case it needs to be determined programmatically.~~
- Mask my personal email address with GitHub's privacy email address
- Implement dependency array to replace `resourceId`
- Somehow get a unique identifier from supplied `getResource` function to replace `resourceId`
