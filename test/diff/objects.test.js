import diff from "../../src/diff";

export default {
  "diff with arrays": {
    "is empty for two empty objects": [diff({}, {}), []],
    "contains modified diff when compared to undefined": [
      diff({}, undefined),
      [{ before: {}, after: undefined, context: [] }]
    ],
    "contains modified diff when compared to null": [
      diff({}, null),
      [{ before: {}, after: null, context: [] }]
    ],
    "contains modified diff when compared to booleans": [
      diff({}, false),
      [{ before: {}, after: false, context: [] }]
    ],
    "contains modified diff when compared to numbers": [
      diff({}, 2),
      [{ before: {}, after: 2, context: [] }]
    ],
    "contains modified diff when compared to strings": [
      diff({}, "foobar"),
      [{ before: {}, after: "foobar", context: [] }]
    ],
    "contains modified diff when compared to empty array": [
      diff({}, []),
      [{ before: {}, after: [], context: [] }]
    ],
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
        "is empty for nested empty objects": [diff({ a: {} }, { a: {} }), []],
        "is empty for nested equal objects": [
          diff({ a: { b: true } }, { a: { b: true } }),
          []
        ]
      },
      arrays: {
        "is empty for nested empty arrays": [diff({ a: [] }, { a: [] }), []],
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
};
