require = require("@std/esm")(module, { esm: "js", cjs: true });
const path = require("path");
const fs = require("fs");
const getFiles = require("./getFiles");
const runTests = require("./runTests");
const flattenTests = require("./flattenTests");
const formatTests = require("./formatTests");

const compose = (...fns) =>
  fns.reduceRight((f, g) => (...args) => f(g(...args)));

const executeTests = ({ testFilter }) =>
  getFiles(process.cwd(), testFilter).then(testFiles =>
    formatTests(
      testFiles.map(fullPath => {
        const file = path.basename(fullPath);
        return {
          file,
          folder: fullPath.substring(
            process.cwd().length + 1,
            fullPath.length - file.length
          ),
          tests: compose(require, runTests, flattenTests)(fullPath)
        };
      })
    )
  );

module.exports = options => {
  const {
    testFilter = fileName =>
      fileName.match(/^((?!node_modules).)*(test|spec)\.js$/),
    watchFilter = fileName => fileName.match(/^((?!node_modules).)*\.js$/)
  } = options;
  Object.assign(options, { testFilter, watchFilter });
  executeTests(options).then(([testSummary, failingTests, testCounts]) => {
    if ("watch" in options) {
      console.log("\x1Bc");
      failingTests.concat(testCounts).forEach(line => console.log(...line));
      fs.watch(process.cwd(), { recursive: true }, (_, fileName) => {
        if (watchFilter(fileName)) {
          Object.keys(require.cache).forEach(key => delete require.cache[key]);
          executeTests(options).then(
            ([_, nextFailingTests, nextTestCounts]) => {
              console.log("\x1Bc");
              nextFailingTests
                .concat(nextTestCounts)
                .forEach(line => console.log(...line));
            }
          );
        }
      });
    } else {
      testSummary
        .concat(failingTests, testCounts)
        .forEach(line => console.log(...line));
      console.log();
      process.exit(failingTests.length);
    }
  });
};
