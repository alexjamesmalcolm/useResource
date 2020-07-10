---
title: Acquiring Manually
---

# {{ page.title }}

By default resources are immediately acquired. If for whatever reason you wish to disable this and instead opt for calling the `getResource` method in an event handler or a `useEffect` then you can do so by passing `false` to the `acquireImmedaitely` option.
