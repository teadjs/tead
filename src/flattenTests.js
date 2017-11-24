const flattenTests = (test, prefixes = []) =>
  Object.keys(test).reduce(
    (tests, name) =>
      Array.isArray(test[name])
        ? tests.concat({
            prefixes,
            name,
            failure: !test[name][0] ? test[name][1] : null
          })
        : tests.concat(
            { name, prefixes },
            flattenTests(test[name], prefixes.concat(name))
          ),
    []
  );

module.exports = flattenTests;
