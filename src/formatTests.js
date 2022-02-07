const json = value => JSON.stringify(value);

const colorForFailure = failure =>
  failure === undefined ? 37 : failure === null ? 32 : 31;

const markForFailure = failure =>
  failure === undefined ? "" : failure === null ? "✓ " : "✕ ";

const formatFailureLine = line => {
  const { context = [], before, after, removed, added, invalid } = line;
  const prefix = context.length ? `for ${context.join("")}: ` : "";
  if ("before" in line && "after" in line) {
    return [
      "    \x1b[90m%sencountered \x1b[1;31m%s\x1b[0;90m but expected \x1b[1;32m%s\x1b[0m",
      prefix,
      json(after),
      json(before)
    ];
  } else if ("removed" in line) {
    return ["    \x1b[90m%smissing \x1b[1;31m%s\x1b[0m", prefix, json(removed)];
  } else if ("added" in line) {
    return [
      "    \x1b[90m%sextraneous \x1b[1;32m%s\x1b[0m",
      prefix,
      json(added)
    ];
  } else if ("invalid" in line) {
    return [
      "    \x1b[90m%sencountered \x1b[1;31m%s\x1b[0;90m but expected \x1b[1;32man object or test expectation array\x1b[0m",
      prefix,
      json(invalid)
    ];
  }
  // Fallback ugly formatting for unknown failure reasons
  return ["    \x1b[1;2m%s\x1b[0m", json(line)];
};

const countPassingTests = testSuites =>
  testSuites.reduce(
    (count, { tests = [] }) =>
      tests.reduce(
        (suiteTotal, { failure }) => suiteTotal + (failure === null ? 1 : 0),
        count
      ),
    0
  );

const countFailingTests = testSuites =>
  testSuites.reduce(
    (count, { tests = [] }) =>
      tests.reduce(
        (suiteTotal, { failure }) => suiteTotal + (failure ? 1 : 0),
        count
      ),
    0
  );

const formatTests = (testSuites = []) => {
  const failingSuites = testSuites.filter(({ tests = [] }) =>
    tests.some(({ failure }) => failure)
  );

  return [
    testSuites.reduce((others, testSuite) => {
      const { folder, file, tests = [] } = testSuite;
      return [
        ...others,
        failingSuites.includes(testSuite)
          ? [
              "\x1b[30;41m%s\x1b[0m \x1b[1;2m%s\x1b[0;37;1m%s\x1b[0m",
              " FAIL ",
              folder,
              file
            ]
          : [
              "\x1b[30;42m%s\x1b[0m \x1b[1;2m%s\x1b[0;37;1m%s\x1b[0m",
              " PASS ",
              folder,
              file
            ],
        ...tests.map(({ prefixes, name, failure }) => [
          `\x1b[${colorForFailure(failure)}m%s%s%s\x1b[0m`,
          "  ".repeat(prefixes.length + 1),
          markForFailure(failure),
          name
        ]),
        []
      ];
    }, []),
    failingSuites.reduce(
      (others, { folder, file, tests }) => [
        ...others,
        [
          "\x1b[30;41m%s\x1b[0m \x1b[1;2m%s\x1b[0;37;1m%s\x1b[0m",
          " FAIL ",
          folder,
          file
        ],
        ...tests
          .filter(({ failure }) => failure)
          .reduce(
            (others, { prefixes, name, failure }) => [
              ...others,
              [
                "\n  \x1b[31;1m%s\x1b[0;1m %s\x1b[31;1m%s\x1b[0m",
                "●",
                prefixes.length ? `${prefixes.join(" > ")} > ` : "",
                name
              ],
              [],
              ...failure.map(formatFailureLine)
            ],
            []
          ),
        []
      ],
      []
    ),
    [
      ["\x1b[32;1m%s %s\x1b[0m", countPassingTests(testSuites), "passing"],
      ...(countFailingTests(testSuites)
        ? [["\x1b[31;1m%s %s\x1b[0m", countFailingTests(testSuites), "failing"]]
        : [])
    ]
  ];
};

export default formatTests;
