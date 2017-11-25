import diff from "../src/diff";

export default {
  diff: {
    "is a function": ["function", typeof diff],
    "is empty without arguments": [diff(), []],
    with: {
      undefined: {
        "is empty when equal": [diff(undefined, undefined), []],
        "contains the diff when not equal": [
          diff(undefined, null),
          [{ before: undefined, after: null, context: [] }]
        ]
      },
      null: {
        "is empty when equal": [diff(null, null), []],
        "contains the diff when not equal": [
          diff(null, undefined),
          [{ before: null, after: undefined, context: [] }]
        ]
      },
      booleans: {
        "is empty when equal": [diff(true, true), []],
        "compares different truthy values as different": [
          diff(true, 1),
          [{ before: true, after: 1, context: [] }]
        ],
        "compares different falsy values as different": [
          diff(false, 0),
          [{ before: false, after: 0, context: [] }]
        ],
        "contains the diff when not equal": [
          diff(true, false),
          [{ before: true, after: false, context: [] }]
        ]
      },
      numbers: {
        "is empty when equal": [diff(1, 1), []],
        "contains the diff when not equal": [
          diff(1, 2),
          [{ before: 1, after: 2, context: [] }]
        ]
      },
      strings: {
        "is empty when equal": [diff("foo", "foo"), []],
        "contains the diff when not equal": [
          diff("foo", "bar"),
          [{ before: "foo", after: "bar", context: [] }]
        ]
      },
      arrays: {
        "is empty for two empty arrays": [diff([], []), []],
        containing: {
          primitives: {
            "is empty for same elements": [
              diff(
                [undefined, null, true, 1, "foo"],
                [undefined, null, true, 1, "foo"]
              ),
              []
            ],
            "contains modified diff for single element not equal arrays": [
              diff([true], [false]),
              [{ before: true, after: false, context: ["[0]"] }]
            ],
            "contains added diff when comparing empty array to single element array": [
              diff([], [true]),
              [{ added: true, context: ["[0]"] }]
            ],
            "contains removed diff when comparing single element array to empty array": [
              diff([true], []),
              [{ removed: true, context: ["[0]"] }]
            ]
          },
          arrays: {
            "is empty for nested empty arrays": [diff([[]], [[]]), []],
            "is empty for nested equal arrays": [diff([[true]], [[true]]), []],
            "contains modified diff for nested not equal arrays": [
              diff([[true]], [[false]]),
              [{ before: true, after: false, context: ["[0]", "[0]"] }]
            ],
            "contains added diff when comparing nested empty array to single element array": [
              diff([[]], [[true]]),
              [{ added: true, context: ["[0]", "[0]"] }]
            ],
            "contains removed diff when comparing nested single element array to empty array": [
              diff([[true]], [[]]),
              [{ removed: true, context: ["[0]", "[0]"] }]
            ]
          },
          objects: {
            "is empty for nested empty objects": [diff([{}], [{}]), []],
            "is empty for nested equal objects": [
              diff([{ a: true }], [{ a: true }]),
              []
            ],
            "contains modified diff for nested single property not equal objects": [
              diff([{ a: 1 }], [{ a: 2 }]),
              [{ before: 1, after: 2, context: ["[0]", ".a"] }]
            ],
            "contains added diff when comparing nested empty object to single property object": [
              diff([{}], [{ a: 1 }]),
              [{ added: 1, context: ["[0]", ".a"] }]
            ],
            "contains removed diff when comparing nested single property object to empty object": [
              diff([{ a: 1 }], [{}]),
              [{ removed: 1, context: ["[0]", ".a"] }]
            ],
            "containing arrays": {
              "is empty for nested empty arrays": [
                diff([{ a: [] }], [{ a: [] }]),
                []
              ],
              "is empty for nested equal arrays": [
                diff([{ a: [true] }], [{ a: [true] }]),
                []
              ],
              "contains modified diff for nested not equal arrays": [
                diff([{ a: [true] }], [{ a: [false] }]),
                [{ before: true, after: false, context: ["[0]", ".a", "[0]"] }]
              ],
              "contains added diff when comparing nested empty array to single element array": [
                diff([{ a: [] }], [{ a: [true] }]),
                [{ added: true, context: ["[0]", ".a", "[0]"] }]
              ],
              "contains removed diff when comparing nested single element array to empty array": [
                diff([{ a: [true] }], [{ a: [] }]),
                [{ removed: true, context: ["[0]", ".a", "[0]"] }]
              ]
            }
          }
        }
      },
      objects: {
        "is empty for two empty objects": [diff({}, {}), []],
        containing: {
          primitives: {
            "is empty for equal objects": [
              diff(
                { a: undefined, b: null, c: true, d: 1, foo: "bar" },
                { a: undefined, b: null, c: true, d: 1, foo: "bar" }
              ),
              []
            ],
            "contains modified diff for single property not equal objects": [
              diff({ a: 1 }, { a: 2 }),
              [{ before: 1, after: 2, context: ["a"] }]
            ],
            "contains added diff when comparing empty object to single property object": [
              diff({}, { a: 1 }),
              [{ added: 1, context: ["a"] }]
            ],
            "contains removed diff when comparing single property object to empty object": [
              diff({ a: 1 }, {}),
              [{ removed: 1, context: ["a"] }]
            ]
          },
          objects: {
            "is empty for nested empty objects": [
              diff({ a: {} }, { a: {} }),
              []
            ],
            "is empty for nested equal objects": [
              diff({ a: { b: true } }, { a: { b: true } }),
              []
            ]
          },
          arrays: {
            "is empty for nested empty arrays": [
              diff({ a: [] }, { a: [] }),
              []
            ],
            "is empty for nested equal arrays": [
              diff({ a: [true] }, { a: [true] }),
              []
            ],
            "contains modified diff for nested not equal arrays": [
              diff({ a: [true] }, { a: [false] }),
              [{ before: true, after: false, context: ["a", "[0]"] }]
            ],
            "contains added diff when comparing nested empty array to single element array": [
              diff({ a: [] }, { a: [true] }),
              [{ added: true, context: ["a", "[0]"] }]
            ],
            "contains removed diff when comparing nested single element array to empty array": [
              diff({ a: [true] }, { a: [] }),
              [{ removed: true, context: ["a", "[0]"] }]
            ],
            "containing objects": {
              "is empty for nested empty objects": [
                diff({ a: [{}] }, { a: [{}] }),
                []
              ],
              "is empty for nested equal objects": [
                diff({ a: [{ b: true }] }, { a: [{ b: true }] }),
                []
              ],
              "contains modified diff for nested single property not equal objects": [
                diff({ a: [{ b: 1 }] }, { a: [{ b: 2 }] }),
                [{ before: 1, after: 2, context: ["a", "[0]", ".b"] }]
              ],
              "contains added diff when comparing nested empty object to single property object": [
                diff({ a: [{}] }, { a: [{ b: 1 }] }),
                [{ added: 1, context: ["a", "[0]", ".b"] }]
              ],
              "contains removed diff when comparing nested single property object to empty object": [
                diff({ a: [{ b: 1 }] }, { a: [{}] }),
                [{ removed: 1, context: ["a", "[0]", ".b"] }]
              ]
            }
          }
        }
      }
    }
  }
};
