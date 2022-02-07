import runTests from "../src/runTests.js";

export default {
  runTests: {
    "is a function": [typeof runTests, "function"],
    "is invalid for": {
      "missing arguments": [
        runTests(),
        { "invalid test": [false, [{ invalid: undefined }]] }
      ],
      true: [runTests(true), { "invalid test": [false, [{ invalid: true }]] }],
      numbers: [runTests(666), { "invalid test": [false, [{ invalid: 666 }]] }],
      strings: [
        runTests("foobar"),
        { "invalid test": [false, [{ invalid: "foobar" }]] }
      ]
    },
    runs: {
      "passing test": [runTests([true, true]), [true, []]],
      "failing test": [
        runTests([false, true]),
        [false, [{ before: true, after: false, context: [] }]]
      ],
      "nested tests": [
        runTests({
          multiple: {
            levels: {
              of: { tests: { passing: [true, true], failing: [false, true] } }
            }
          }
        }),
        {
          multiple: {
            levels: {
              of: {
                tests: {
                  passing: [true, []],
                  failing: [
                    false,
                    [{ before: true, after: false, context: [] }]
                  ]
                }
              }
            }
          }
        }
      ]
    }
  }
};
