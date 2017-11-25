#!/usr/bin/env node

require = require("@std/esm")(module, { esm: "js", cjs: true });
const path = require("path");
const getFiles = require("./getFiles");
const runTests = require("./runTests");
const flattenTests = require("./flattenTests");
const formatTests = require("./formatTests");

const compose = (...fns) =>
  fns.reduceRight((f, g) => (...args) => f(g(...args)));

const printTests = ([testSummary, failingTests]) => {
  testSummary.concat(failingTests).forEach(line => console.log(...line));
  process.exit(failingTests.length);
};

getFiles(
  process.cwd(),
  fileName =>
    fileName.match(/.*(test|spec)\.js$/) && !fileName.match(/.*node_modules.*/)
).then(testFiles =>
  compose(formatTests, printTests)(
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
