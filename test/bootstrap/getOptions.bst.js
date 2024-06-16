import assert from "assert";
import getOptions from "../../src/getOptions.js";

[
  [[], {}],
  [["invalid"], {}],
  [["--foo=bar"], { foo: "bar" }],
  [
    ["--testPattern=.*test\\.js$", "ignored", "--watch"],
    {
      testPattern: ".*test\\.js$",
      watch: true
    }
  ]
]
  .map(([argv, expected]) => {
    const actual = getOptions(argv);
    try {
      assert.deepStrictEqual(actual, expected);
      // eslint-disable-next-line no-unused-vars
    } catch (e) {
      const json = value => JSON.stringify(value);
      return [
        "test failed! values:\n",
        ` argv: ${json(argv)}\n`,
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
      console.log(`${failureCount} options bootstrap test(s) failed!`);
      process.exit(failureCount);
    }
  });
