const path = require("path");
const fs = require("fs");
const getFiles = require("./getFiles");
const runTests = require("./runTests");
const flattenTests = require("./flattenTests");
const formatTests = require("./formatTests");
const readline = require("readline");

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
    testPattern = "^((?!node_modules).)*(test|spec).js$",
    watchPattern = "^((?!node_modules).)*.js$"
  } = options;
  const testFilter = filename => filename.match(new RegExp(testPattern));
  const watchFilter = filename => filename.match(new RegExp(watchPattern));
  Object.assign(options, { testFilter, watchFilter });
  executeTests(options).then(([testSummary, failingTests, testCounts]) => {
    if ("watch" in options) {
      process.stdout.write("\u001b[2J\u001b[0;0H");
      failingTests.concat(testCounts).forEach(line => console.log(...line));
      const rerunTests = () => {
        const timeoutID = setInterval(() => process.stdout.write("."), 100);
        Object.keys(require.cache).forEach(key => delete require.cache[key]);
        executeTests(options).then(([_, nextFailingTests, nextTestCounts]) => {
          clearTimeout(timeoutID);
          process.stdout.write("\u001b[2J\u001b[0;0H");
          nextFailingTests
            .concat(nextTestCounts)
            .forEach(line => console.log(...line));
        });
      };
      readline.emitKeypressEvents(process.stdin);
      process.stdin.setRawMode(true);
      process.stdin.on("keypress", (str, key) => {
        if ((key.ctrl && key.name === "c") || key.name === "q") {
          process.exit(0);
        } else if (key.name === "a" || key.name === "return") {
          rerunTests();
        }
      });
      fs.watch(process.cwd(), { recursive: true }, (_, fileName) => {
        if (watchFilter(fileName)) {
          rerunTests();
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
