import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import readline from "readline";
import { spawnSync } from "child_process";
import getFiles from "./getFiles.js";
import runTests from "./runTests.js";
import flattenTests from "./flattenTests.js";
import formatTests from "./formatTests.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const executeTests = ({ testFilter }) =>
  getFiles(process.cwd(), testFilter)
    .then(testFiles =>
      Promise.all(
        testFiles.map(fullPath => {
          const file = path.basename(fullPath);
          // appending a unique id to imports is the most reliable way
          // to make sure the latest test code is used each time
          // TODO: this approach only handles modifications to test code
          return import(`file://${fullPath}?v=${Date.now()}`).then(
            ({ default: tests }) => {
              return {
                file,
                folder: fullPath.substring(
                  process.cwd().length + 1,
                  fullPath.length - file.length
                ),
                tests: flattenTests(runTests(tests))
              };
            }
          );
        })
      ).then(formatTests)
    )
    .catch(error => {
      console.log(error);
      return [[], [[error]], []];
    });

export default options => {
  const {
    testPattern = "^((?!node_modules).)*(test|spec)\\.js$",
    watchPattern = "^((?!node_modules).)*\\.js$",
    watch,
    coverage
  } = options;
  if (coverage) {
    const { status } = spawnSync(
      `npx --yes c8 --reporter=text --reporter=lcov node ${__dirname}/tead.js "--testPattern=${testPattern}"`,
      {
        shell: true,
        stdio: "inherit"
      }
    );
    process.exit(status);
  }
  const testFilter = filename => filename.match(new RegExp(testPattern));
  const watchFilter = filename => filename.match(new RegExp(watchPattern));
  Object.assign(options, { testFilter, watchFilter });
  executeTests(options).then(
    ([testSummary = [], failingTests = [], testCounts = []]) => {
      if (watch) {
        process.stdout.write("\u001b[2J\u001b[0;0H");
        failingTests.concat(testCounts).forEach(line => console.log(...line));
        const rerunTests = () => {
          const intervalId = setInterval(() => process.stdout.write("."), 100);
          setTimeout(() => clearInterval(intervalId), 5000);
          executeTests(options).then(([, nextFailingTests, nextTestCounts]) => {
            clearInterval(intervalId);
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
        process.exit(testCounts?.[1]?.[1] || 0);
      }
    }
  );
};
