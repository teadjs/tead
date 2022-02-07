const flattenTests = (test = {}, prefixes = []) =>
  Object.keys(test).reduce(
    (tests, name) =>
      prefixes.length === 0 && name === "default"
        ? flattenTests(test.default)
        : Array.isArray(test[name])
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

export default flattenTests;
