const assert = require("assert");
const diff = require("../../src/diff");

module.exports = () =>
  [
    // Compares equal compound array/object/array values
    [
      [
        undefined,
        null,
        true,
        1,
        "foo",
        {
          a: {
            b: {
              c: undefined,
              d: null,
              e: false,
              f: 2,
              g: "bar",
              h: [undefined, null, true, 3, "baz"]
            }
          }
        },
        [undefined, null, false, 4, "fizzbuzz"]
      ],
      [
        undefined,
        null,
        true,
        1,
        "foo",
        {
          a: {
            b: {
              c: undefined,
              d: null,
              e: false,
              f: 2,
              g: "bar",
              h: [undefined, null, true, 3, "baz"]
            }
          }
        },
        [undefined, null, false, 4, "fizzbuzz"]
      ],
      []
    ],
    // Compares equal compound object/array/object values
    [
      {
        a: {
          b: {
            c: undefined,
            d: null,
            e: true,
            f: 1,
            g: "foo",
            h: [
              undefined,
              null,
              false,
              2,
              "bar",
              {
                i: {
                  j: {
                    k: undefined,
                    l: null,
                    m: true,
                    n: 3,
                    o: "baz"
                  }
                }
              }
            ]
          }
        }
      },
      {
        a: {
          b: {
            c: undefined,
            d: null,
            e: true,
            f: 1,
            g: "foo",
            h: [
              undefined,
              null,
              false,
              2,
              "bar",
              {
                i: {
                  j: {
                    k: undefined,
                    l: null,
                    m: true,
                    n: 3,
                    o: "baz"
                  }
                }
              }
            ]
          }
        }
      },
      []
    ],

    // Compares different compound array/object/array values
    [
      [
        [
          undefined,
          true,
          1,
          "foo",
          { a: { b: { c: 4, d: [null, false, 6, "fizz"] } } }
        ],
        [],
        [undefined, false, 8, "fizzbuzz"]
      ],
      [
        [
          null,
          false,
          2,
          "bar",
          { a: { b: { c: 5, d: [undefined, true, 7, "buzz"] } } }
        ],
        [null, true, 3, "baz"],
        []
      ],
      [
        {
          before: undefined,
          after: null,
          context: ["[0]", "[0]"]
        },
        {
          before: true,
          after: false,
          context: ["[0]", "[1]"]
        },
        {
          before: 1,
          after: 2,
          context: ["[0]", "[2]"]
        },
        {
          before: "foo",
          after: "bar",
          context: ["[0]", "[3]"]
        },
        {
          before: 4,
          after: 5,
          context: ["[0]", "[4]", ".a", ".b", ".c"]
        },
        {
          before: null,
          after: undefined,
          context: ["[0]", "[4]", ".a", ".b", ".d", "[0]"]
        },
        {
          before: false,
          after: true,
          context: ["[0]", "[4]", ".a", ".b", ".d", "[1]"]
        },
        {
          before: 6,
          after: 7,
          context: ["[0]", "[4]", ".a", ".b", ".d", "[2]"]
        },
        {
          before: "fizz",
          after: "buzz",
          context: ["[0]", "[4]", ".a", ".b", ".d", "[3]"]
        },
        {
          added: null,
          context: ["[1]", "[0]"]
        },
        {
          added: true,
          context: ["[1]", "[1]"]
        },
        {
          added: 3,
          context: ["[1]", "[2]"]
        },
        {
          added: "baz",
          context: ["[1]", "[3]"]
        },
        {
          removed: undefined,
          context: ["[2]", "[0]"]
        },
        {
          removed: false,
          context: ["[2]", "[1]"]
        },
        {
          removed: 8,
          context: ["[2]", "[2]"]
        },
        {
          removed: "fizzbuzz",
          context: ["[2]", "[3]"]
        }
      ]
    ],

    // Compares different compound object/array/object values
    [
      {
        a: {
          b: {
            c: {
              d: undefined,
              e: true,
              f: 1,
              g: "foo",
              h: [
                null,
                false,
                3,
                "fizz",
                { i: undefined, j: true, k: 5, l: "baz" }
              ],
              m: null,
              n: false,
              o: 7,
              p: "foobar"
            }
          }
        }
      },
      {
        a: {
          b: {
            c: {
              d: null,
              e: false,
              f: 2,
              g: "bar",
              h: [
                undefined,
                true,
                4,
                "buzz",
                { i: null, j: false, k: 6, l: "fizzbuzz" }
              ]
            },
            q: undefined,
            r: true,
            s: 8,
            t: "string"
          }
        }
      },
      [
        {
          before: undefined,
          after: null,
          context: [".a", ".b", ".c", ".d"]
        },
        {
          before: true,
          after: false,
          context: [".a", ".b", ".c", ".e"]
        },
        {
          before: 1,
          after: 2,
          context: [".a", ".b", ".c", ".f"]
        },
        {
          before: "foo",
          after: "bar",
          context: [".a", ".b", ".c", ".g"]
        },
        {
          before: null,
          after: undefined,
          context: [".a", ".b", ".c", ".h", "[0]"]
        },
        {
          before: false,
          after: true,
          context: [".a", ".b", ".c", ".h", "[1]"]
        },
        {
          before: 3,
          after: 4,
          context: [".a", ".b", ".c", ".h", "[2]"]
        },
        {
          before: "fizz",
          after: "buzz",
          context: [".a", ".b", ".c", ".h", "[3]"]
        },
        {
          before: undefined,
          after: null,
          context: [".a", ".b", ".c", ".h", "[4]", ".i"]
        },
        {
          before: true,
          after: false,
          context: [".a", ".b", ".c", ".h", "[4]", ".j"]
        },
        {
          before: 5,
          after: 6,
          context: [".a", ".b", ".c", ".h", "[4]", ".k"]
        },
        {
          before: "baz",
          after: "fizzbuzz",
          context: [".a", ".b", ".c", ".h", "[4]", ".l"]
        },
        {
          removed: null,
          context: [".a", ".b", ".c", ".m"]
        },
        {
          removed: false,
          context: [".a", ".b", ".c", ".n"]
        },
        {
          removed: 7,
          context: [".a", ".b", ".c", ".o"]
        },
        {
          removed: "foobar",
          context: [".a", ".b", ".c", ".p"]
        },
        {
          added: undefined,
          context: [".a", ".b", ".q"]
        },
        {
          added: true,
          context: [".a", ".b", ".r"]
        },
        {
          added: 8,
          context: [".a", ".b", ".s"]
        },
        {
          added: "string",
          context: [".a", ".b", ".t"]
        }
      ]
    ]
  ]
    .map(([before, after, expected]) => {
      const actual = diff(before, after);
      try {
        assert.deepStrictEqual(actual, expected);
      } catch (e) {
        const json = value => JSON.stringify(value);
        return [
          "test failed! values:\n",
          ` before: ${json(before)}\n`,
          ` after: ${json(after)}\n`,
          ` expected: ${json(expected)}\n`,
          ` actual: ${json(actual)}\n`
        ];
      }
      return [];
    })
    .filter(result => result.length)
    .reduce(
      ([count], failure) => {
        console.log(...failure);
        return [count + 1];
      },
      [0]
    )
    .map(failureCount => {
      if (failureCount) {
        console.log(`${failureCount} diff bootstrap test(s) failed!`);
        process.exit(failureCount);
      }
    });
