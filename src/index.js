const path = require("path");
const getFiles = require("./getFiles");
const runTests = require("./runTests");
const flattenTests = require("./flattenTests");
const formatTests = require("./formatTests");

const compose = (...fns) =>
  fns.reduceRight((f, g) => (...args) => f(g(...args)));

const printTests = tests => tests.forEach(test => console.log(...test));
// const printTests = tests => console.log(JSON.stringify(tests, null, 2));

getFiles(process.cwd(), fileName => fileName.match(/.*(test|spec)\.js$/)).then(
  testFiles =>
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
