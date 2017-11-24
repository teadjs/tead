const diff = require("./diff");

const resultsForTest = ([actual, expected]) => {
  const resultsDiff = diff(expected, actual);
  return [resultsDiff.length === 0, resultsDiff];
};

const runTests = test =>
  Array.isArray(test)
    ? resultsForTest(test)
    : Object.keys(test).reduce(
        (tests, key) =>
          Object.assign({}, tests, {
            [key]: runTests(test[key])
          }),
        {}
      );

module.exports = runTests;
