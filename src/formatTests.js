const colorForFailure = failure =>
  failure === undefined ? 37 : failure === null ? 32 : 31;
const markForFailure = failure =>
  failure === undefined ? "" : failure === null ? "✓ " : "✕ ";

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

const formatTests = testSuites => {
  // return testSuites;
  const failingSuites = testSuites.filter(({ tests = [] }) =>
    tests.some(({ failure }) => failure)
  );

  return [
    ...testSuites.reduce((others, testSuite) => {
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
    ["\x1b[32;1m%s %s\x1b[0m", countPassingTests(testSuites), "passing"],
    ...(countFailingTests(testSuites)
      ? [["\x1b[31;1m%s %s\x1b[0m", countFailingTests(testSuites), "failing"]]
      : []),
    [],
    ...failingSuites.reduce(
      (others, { folder, file, tests = [] }) => [
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
              ["\n    \x1b[1;2m%s\x1b[0m", JSON.stringify(failure)]
            ],
            []
          ),
        []
      ],
      []
    )
  ];
};

module.exports = formatTests;
