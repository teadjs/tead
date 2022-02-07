import flattenTests from "../src/flattenTests.js";

export default {
  flattenTests: {
    "is a function": [typeof flattenTests, "function"],
    "is empty without arguments": [flattenTests(), []],
    flattens: {
      "empty test object to empty list": [flattenTests({}), []],
      "single passing test object": [
        flattenTests({ passing: [true] }),
        [{ prefixes: [], name: "passing", failure: null }]
      ],
      "single failing test object": [
        flattenTests({ failing: [false, { before: true, after: false }] }),
        [
          {
            prefixes: [],
            name: "failing",
            failure: { before: true, after: false }
          }
        ]
      ],
      "module passing test object skips default export property": [
        flattenTests({ default: { passing: [true] } }),
        [{ prefixes: [], name: "passing", failure: null }]
      ],
      "includes nested default property": [
        flattenTests({ top: { default: { passing: [true] } } }),
        [
          { prefixes: [], name: "top" },
          { prefixes: ["top"], name: "default" },
          { prefixes: ["top", "default"], name: "passing", failure: null }
        ]
      ]
    }
  }
};
