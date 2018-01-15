import diff from "../../src/diff";

export default {
  diff: {
    "is a function": [typeof diff, "function"],
    "is empty without arguments": [diff(), []],
    with: {
      undefined: {
        "is empty when equal": [diff(undefined, undefined), []],
        "contains modified diff when compared to null": [
          diff(undefined, null),
          [{ before: undefined, after: null, context: [] }]
        ],
        "contains modified diff when compared to booleans": [
          diff(undefined, false),
          [{ before: undefined, after: false, context: [] }]
        ],
        "contains modified diff when compared to numbers": [
          diff(undefined, 2),
          [{ before: undefined, after: 2, context: [] }]
        ],
        "contains modified diff when compared to strings": [
          diff(undefined, "foobar"),
          [{ before: undefined, after: "foobar", context: [] }]
        ],
        "contains modified diff when compared to empty array": [
          diff(undefined, []),
          [{ before: undefined, after: [], context: [] }]
        ],
        "contains modified diff when compared to empty object": [
          diff(undefined, {}),
          [{ before: undefined, after: {}, context: [] }]
        ]
      },
      null: {
        "is empty when equal": [diff(null, null), []],
        "contains modified diff when compared to undefined": [
          diff(null, undefined),
          [{ before: null, after: undefined, context: [] }]
        ],
        "contains modified diff when compared to booleans": [
          diff(null, false),
          [{ before: null, after: false, context: [] }]
        ],
        "contains modified diff when compared to numbers": [
          diff(null, 2),
          [{ before: null, after: 2, context: [] }]
        ],
        "contains modified diff when compared to strings": [
          diff(null, "foobar"),
          [{ before: null, after: "foobar", context: [] }]
        ],
        "contains modified diff when compared to empty array": [
          diff(null, []),
          [{ before: null, after: [], context: [] }]
        ],
        "contains modified diff when compared to empty object": [
          diff(null, {}),
          [{ before: null, after: {}, context: [] }]
        ]
      },
      booleans: {
        "is empty when equal": [diff(true, true), []],
        "contains modified diff when compared to undefined": [
          diff(true, undefined),
          [{ before: true, after: undefined, context: [] }]
        ],
        "contains modified diff when compared to null": [
          diff(true, null),
          [{ before: true, after: null, context: [] }]
        ],
        "contains modified diff when compared to booleans": [
          diff(true, false),
          [{ before: true, after: false, context: [] }]
        ],
        "contains modified diff when compared to numbers": [
          diff(true, 2),
          [{ before: true, after: 2, context: [] }]
        ],
        "contains modified diff when compared to strings": [
          diff(true, "foobar"),
          [{ before: true, after: "foobar", context: [] }]
        ],
        "contains modified diff when compared to empty array": [
          diff(true, []),
          [{ before: true, after: [], context: [] }]
        ],
        "contains modified diff when compared to empty object": [
          diff(true, {}),
          [{ before: true, after: {}, context: [] }]
        ],
        "compares different truthy values as different": [
          diff(true, 1),
          [{ before: true, after: 1, context: [] }]
        ],
        "compares different falsy values as different": [
          diff(false, 0),
          [{ before: false, after: 0, context: [] }]
        ]
      },
      numbers: {
        "is empty when equal": [diff(1, 1), []],
        "is empty with rounding error differences": [
          diff(Math.sin(Math.PI), 0),
          []
        ],
        "is empty with equivalent small numbers": [diff(0.1 + 0.2, 0.3), []],
        "is empty with equivalent large numbers": [
          diff(Math.pow(10, 13) + 0.1 + 0.2, Math.pow(10, 13) + 0.3),
          []
        ],
        "contains modified diff when compared to undefined": [
          diff(1, undefined),
          [{ before: 1, after: undefined, context: [] }]
        ],
        "contains modified diff when compared to null": [
          diff(1, null),
          [{ before: 1, after: null, context: [] }]
        ],
        "contains modified diff when compared to booleans": [
          diff(1, false),
          [{ before: 1, after: false, context: [] }]
        ],
        "contains modified diff when comparing small numbers": [
          // epsilon is the smallest number we can compare
          // so compare that with itself times two
          diff(Number.EPSILON, Number.EPSILON * 2),
          [{ before: Number.EPSILON, after: Number.EPSILON * 2, context: [] }]
        ],
        "contains modified diff when comparing large numbers": [
          // we can compare up to fifteen significant figures
          // so use thirteen for the whole number
          // and two for the decimal part
          diff(Math.pow(10, 13) + 0.01, Math.pow(10, 13) + 0.02),
          [
            {
              before: Math.pow(10, 13) + 0.01,
              after: Math.pow(10, 13) + 0.02,
              context: []
            }
          ]
        ],
        "contains modified diff when compared to strings": [
          diff(1, "foobar"),
          [{ before: 1, after: "foobar", context: [] }]
        ],
        "contains modified diff when compared to empty array": [
          diff(1, []),
          [{ before: 1, after: [], context: [] }]
        ],
        "contains modified diff when compared to empty object": [
          diff(1, {}),
          [{ before: 1, after: {}, context: [] }]
        ]
      },
      strings: {
        "is empty when equal": [diff("foo", "foo"), []],
        "contains modified diff when compared to undefined": [
          diff("foobar", undefined),
          [{ before: "foobar", after: undefined, context: [] }]
        ],
        "contains modified diff when compared to null": [
          diff("foobar", null),
          [{ before: "foobar", after: null, context: [] }]
        ],
        "contains modified diff when compared to booleans": [
          diff("foobar", false),
          [{ before: "foobar", after: false, context: [] }]
        ],
        "contains modified diff when compared to numbers": [
          diff("foobar", 2),
          [{ before: "foobar", after: 2, context: [] }]
        ],
        "contains modified diff when compared to strings": [
          diff("foo", "bar"),
          [{ before: "foo", after: "bar", context: [] }]
        ],
        "contains modified diff when compared to empty array": [
          diff("foobar", []),
          [{ before: "foobar", after: [], context: [] }]
        ],
        "contains modified diff when compared to empty object": [
          diff("foobar", {}),
          [{ before: "foobar", after: {}, context: [] }]
        ]
      }
    }
  }
};
