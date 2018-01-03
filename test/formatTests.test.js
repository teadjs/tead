import formatTests from "../src/formatTests";

export default {
  formatTests: {
    "is a function": [typeof formatTests, "function"],
    passing: {
      "returns 0 without arguments": [
        formatTests(),
        [[], [], [["\u001b[32;1m%s %s\u001b[0m", 0, "passing"]]]
      ],
      "returns 0 with empty test suite": [
        formatTests([
          {
            folder: "test/folder",
            file: "index.test.js"
          }
        ]),
        [
          [
            [
              "\u001b[30;42m%s\u001b[0m \u001b[1;2m%s\u001b[0;37;1m%s\u001b[0m",
              " PASS ",
              "test/folder",
              "index.test.js"
            ],
            []
          ],
          [],
          [["\u001b[32;1m%s %s\u001b[0m", 0, "passing"]]
        ]
      ],
      "handled for root test": [
        formatTests([
          {
            folder: "test/folder",
            file: "index.test.js",
            tests: [{ prefixes: [], name: "passes", failure: null }]
          }
        ]),
        [
          [
            [
              "\u001b[30;42m%s\u001b[0m \u001b[1;2m%s\u001b[0;37;1m%s\u001b[0m",
              " PASS ",
              "test/folder",
              "index.test.js"
            ],
            ["\u001b[32m%s%s%s\u001b[0m", "  ", "✓ ", "passes"],
            []
          ],
          [],
          [["\u001b[32;1m%s %s\u001b[0m", 1, "passing"]]
        ]
      ],
      "handled for child test": [
        formatTests([
          {
            folder: "test/folder",
            file: "index.test.js",
            tests: [
              { prefixes: [], name: "nested" },
              { prefixes: ["nested"], name: "tests" },
              {
                prefixes: ["nested", "tests"],
                name: "pass",
                failure: null
              }
            ]
          }
        ]),
        [
          [
            [
              "\u001b[30;42m%s\u001b[0m \u001b[1;2m%s\u001b[0;37;1m%s\u001b[0m",
              " PASS ",
              "test/folder",
              "index.test.js"
            ],
            ["\u001b[37m%s%s%s\u001b[0m", "  ", "", "nested"],
            ["\u001b[37m%s%s%s\u001b[0m", "    ", "", "tests"],
            ["\u001b[32m%s%s%s\u001b[0m", "      ", "✓ ", "pass"],
            []
          ],
          [],
          [["\u001b[32;1m%s %s\u001b[0m", 1, "passing"]]
        ]
      ]
    },
    failing: {
      "handled for root test": [
        formatTests([
          {
            folder: "test/folder",
            file: "index.test.js",
            tests: [{ prefixes: [], name: "fails", failure: [{}] }]
          }
        ]),
        [
          [
            [
              "\u001b[30;41m%s\u001b[0m \u001b[1;2m%s\u001b[0;37;1m%s\u001b[0m",
              " FAIL ",
              "test/folder",
              "index.test.js"
            ],
            ["\u001b[31m%s%s%s\u001b[0m", "  ", "✕ ", "fails"],
            []
          ],
          [
            [
              "\u001b[30;41m%s\u001b[0m \u001b[1;2m%s\u001b[0;37;1m%s\u001b[0m",
              " FAIL ",
              "test/folder",
              "index.test.js"
            ],
            [
              "\n  \u001b[31;1m%s\u001b[0;1m %s\u001b[31;1m%s\u001b[0m",
              "●",
              "",
              "fails"
            ],
            [],
            ["    \u001b[1;2m%s\u001b[0m", "{}"],
            []
          ],
          [
            ["\u001b[32;1m%s %s\u001b[0m", 0, "passing"],
            ["\u001b[31;1m%s %s\u001b[0m", 1, "failing"]
          ]
        ]
      ],
      "handled for child test": [
        formatTests([
          {
            folder: "test/folder",
            file: "index.test.js",
            tests: [
              { prefixes: [], name: "nested" },
              { prefixes: ["nested"], name: "tests" },
              {
                prefixes: ["nested", "tests"],
                name: "fail",
                failure: [{}]
              }
            ]
          }
        ]),
        [
          [
            [
              "\u001b[30;41m%s\u001b[0m \u001b[1;2m%s\u001b[0;37;1m%s\u001b[0m",
              " FAIL ",
              "test/folder",
              "index.test.js"
            ],
            ["\u001b[37m%s%s%s\u001b[0m", "  ", "", "nested"],
            ["\u001b[37m%s%s%s\u001b[0m", "    ", "", "tests"],
            ["\u001b[31m%s%s%s\u001b[0m", "      ", "✕ ", "fail"],
            []
          ],
          [
            [
              "\u001b[30;41m%s\u001b[0m \u001b[1;2m%s\u001b[0;37;1m%s\u001b[0m",
              " FAIL ",
              "test/folder",
              "index.test.js"
            ],
            [
              "\n  \u001b[31;1m%s\u001b[0;1m %s\u001b[31;1m%s\u001b[0m",
              "●",
              "nested > tests > ",
              "fail"
            ],
            [],
            ["    \u001b[1;2m%s\u001b[0m", "{}"],
            []
          ],
          [
            ["\u001b[32;1m%s %s\u001b[0m", 0, "passing"],
            ["\u001b[31;1m%s %s\u001b[0m", 1, "failing"]
          ]
        ]
      ],
      "handled for modified": [
        formatTests([
          {
            folder: "test/folder",
            file: "index.test.js",
            tests: [
              {
                prefixes: [],
                name: "fails",
                failure: [
                  { context: ["[0]", ".a"], before: { a: 1 }, after: { a: 2 } }
                ]
              }
            ]
          }
        ]),
        [
          [
            [
              "\u001b[30;41m%s\u001b[0m \u001b[1;2m%s\u001b[0;37;1m%s\u001b[0m",
              " FAIL ",
              "test/folder",
              "index.test.js"
            ],
            ["\u001b[31m%s%s%s\u001b[0m", "  ", "✕ ", "fails"],
            []
          ],
          [
            [
              "\u001b[30;41m%s\u001b[0m \u001b[1;2m%s\u001b[0;37;1m%s\u001b[0m",
              " FAIL ",
              "test/folder",
              "index.test.js"
            ],
            [
              "\n  \u001b[31;1m%s\u001b[0;1m %s\u001b[31;1m%s\u001b[0m",
              "●",
              "",
              "fails"
            ],
            [],
            [
              "    \u001b[90m%sencountered \u001b[1;31m%s\u001b[0;90m but expected \u001b[1;32m%s\u001b[0m",
              "for [0].a: ",
              '{"a":2}',
              '{"a":1}'
            ],
            []
          ],
          [
            ["\u001b[32;1m%s %s\u001b[0m", 0, "passing"],
            ["\u001b[31;1m%s %s\u001b[0m", 1, "failing"]
          ]
        ]
      ],
      "handled for removed": [
        formatTests([
          {
            folder: "test/folder",
            file: "index.test.js",
            tests: [
              {
                prefixes: [],
                name: "fails",
                failure: [
                  { context: ["[0]", ".a"], removed: { deleted: true } }
                ]
              }
            ]
          }
        ]),
        [
          [
            [
              "\u001b[30;41m%s\u001b[0m \u001b[1;2m%s\u001b[0;37;1m%s\u001b[0m",
              " FAIL ",
              "test/folder",
              "index.test.js"
            ],
            ["\u001b[31m%s%s%s\u001b[0m", "  ", "✕ ", "fails"],
            []
          ],
          [
            [
              "\u001b[30;41m%s\u001b[0m \u001b[1;2m%s\u001b[0;37;1m%s\u001b[0m",
              " FAIL ",
              "test/folder",
              "index.test.js"
            ],
            [
              "\n  \u001b[31;1m%s\u001b[0;1m %s\u001b[31;1m%s\u001b[0m",
              "●",
              "",
              "fails"
            ],
            [],
            [
              "    \u001b[90m%smissing \u001b[1;31m%s\u001b[0m",
              "for [0].a: ",
              '{"deleted":true}'
            ],
            []
          ],
          [
            ["\u001b[32;1m%s %s\u001b[0m", 0, "passing"],
            ["\u001b[31;1m%s %s\u001b[0m", 1, "failing"]
          ]
        ]
      ],
      "handled for added": [
        formatTests([
          {
            folder: "test/folder",
            file: "index.test.js",
            tests: [
              {
                prefixes: [],
                name: "fails",
                failure: [{ context: ["[0]", ".a"], added: { created: true } }]
              }
            ]
          }
        ]),
        [
          [
            [
              "\u001b[30;41m%s\u001b[0m \u001b[1;2m%s\u001b[0;37;1m%s\u001b[0m",
              " FAIL ",
              "test/folder",
              "index.test.js"
            ],
            ["\u001b[31m%s%s%s\u001b[0m", "  ", "✕ ", "fails"],
            []
          ],
          [
            [
              "\u001b[30;41m%s\u001b[0m \u001b[1;2m%s\u001b[0;37;1m%s\u001b[0m",
              " FAIL ",
              "test/folder",
              "index.test.js"
            ],
            [
              "\n  \u001b[31;1m%s\u001b[0;1m %s\u001b[31;1m%s\u001b[0m",
              "●",
              "",
              "fails"
            ],
            [],
            [
              "    \u001b[90m%sextraneous \u001b[1;32m%s\u001b[0m",
              "for [0].a: ",
              '{"created":true}'
            ],
            []
          ],
          [
            ["\u001b[32;1m%s %s\u001b[0m", 0, "passing"],
            ["\u001b[31;1m%s %s\u001b[0m", 1, "failing"]
          ]
        ]
      ],
      "handled for invalid": [
        formatTests([
          {
            folder: "test/folder",
            file: "index.test.js",
            tests: [
              {
                prefixes: [],
                name: "fails",
                failure: [{ invalid: 666 }]
              }
            ]
          }
        ]),
        [
          [
            [
              "\u001b[30;41m%s\u001b[0m \u001b[1;2m%s\u001b[0;37;1m%s\u001b[0m",
              " FAIL ",
              "test/folder",
              "index.test.js"
            ],
            ["\u001b[31m%s%s%s\u001b[0m", "  ", "✕ ", "fails"],
            []
          ],
          [
            [
              "\u001b[30;41m%s\u001b[0m \u001b[1;2m%s\u001b[0;37;1m%s\u001b[0m",
              " FAIL ",
              "test/folder",
              "index.test.js"
            ],
            [
              "\n  \u001b[31;1m%s\u001b[0;1m %s\u001b[31;1m%s\u001b[0m",
              "●",
              "",
              "fails"
            ],
            [],
            [
              "    \u001b[90m%sencountered \u001b[1;31m%s\u001b[0;90m but expected \u001b[1;32man object or test expectation array\u001b[0m",
              "",
              "666"
            ],
            []
          ],
          [
            ["\u001b[32;1m%s %s\u001b[0m", 0, "passing"],
            ["\u001b[31;1m%s %s\u001b[0m", 1, "failing"]
          ]
        ]
      ]
    }
  }
};
