// Minimal process shim for browser bundles when legacy polyfill is disabled.
if (typeof globalThis.process === "undefined") {
  globalThis.process = {
    env: {},
    browser: true,
    nextTick: (cb, ...args) => queueMicrotask(() => cb(...args)),
  };
}

export default globalThis.process;

