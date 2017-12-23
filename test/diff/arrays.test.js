import diff from "../../src/diff";

export default {
  "diff with arrays": {
    "is empty for two empty arrays": [diff([], []), []],
    "contains modified diff when compared to undefined": [
      diff([], undefined),
      [{ before: [], after: undefined, context: [] }]
    ],
    "contains modified diff when compared to null": [
      diff([], null),
      [{ before: [], after: null, context: [] }]
    ],
    "contains modified diff when compared to booleans": [
      diff([], false),
      [{ before: [], after: false, context: [] }]
    ],
    "contains modified diff when compared to numbers": [
      diff([], 2),
      [{ before: [], after: 2, context: [] }]
    ],
    "contains modified diff when compared to strings": [
      diff([], "foobar"),
      [{ before: [], after: "foobar", context: [] }]
    ],
    "contains modified diff when compared to empty object": [
      diff([], {}),
      [{ before: [], after: {}, context: [] }]
    ],
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
        "contains modified diff when comparing nested empty array to empty empty object": [
          diff([[]], [{}]),
          [{ before: [], after: {}, context: ["[0]"] }]
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
        "contains modified diff when comparing nested empty object to empty array": [
          diff([{}], [[]]),
          [{ before: {}, after: [], context: ["[0]"] }]
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
  }
};
