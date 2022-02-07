import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import readline from "readline";
import { spawn } from "child_process";
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
          return import(`file://${fullPath}`).then(({ default: tests }) => {
            return {
              file,
              folder: fullPath.substring(
                process.cwd().length + 1,
                fullPath.length - file.length
              ),
              tests: flattenTests(runTests(tests))
            };
          });
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
    spawn(
      `npx c8 --reporter=text --reporter=lcov node ${__dirname}/tead.js "--testPattern=${testPattern}"`,
      {
        shell: true,
        stdio: "inherit"
      }
    );
    return;
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
          Object.keys(require.cache).forEach(key => delete require.cache[key]);
          executeTests(options).then(
            ([_, nextFailingTests, nextTestCounts]) => {
              clearInterval(intervalId);
              process.stdout.write("\u001b[2J\u001b[0;0H");
              nextFailingTests
                .concat(nextTestCounts)
                .forEach(line => console.log(...line));
            }
          );
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
    }
  );
};
