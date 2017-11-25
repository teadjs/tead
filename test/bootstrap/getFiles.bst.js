const path = require("path");
const assert = require("assert");
const getFiles = require("../../src/getFiles");

const json = value => JSON.stringify(value);
const expectFiles = ([folder, filter, originalExpected]) => {
  const fullFolder = path.join(__dirname, folder);
  const timeoutID = setTimeout(() => {
    console.log("timed out waiting for getFiles Promise to resolve");
    process.exit(1);
  }, 5000);
  return getFiles(fullFolder, filter)
    .then(files => {
      clearTimeout(timeoutID);
      const originalActual = files.map(fullPath =>
        fullPath.substring(fullFolder.length + 1)
      );
      const expected = originalExpected
        .map(expectedPath => expectedPath.replace("/", path.sep))
        .sort();
      const actual = originalActual.sort();
      try {
        assert.deepStrictEqual(actual, expected);
      } catch (e) {
        return [
          "test failed! values:\n",
          ` folder: ${fullFolder}\n`,
          ` filter: ${filter}\n`,
          ` expected: ${json(expected)}\n`,
          ` actual: ${json(actual)}\n`
        ];
      }
      return [];
    })
    .catch(e => {
      console.log(e);
      return [
        "test error! values:\n",
        ` folder: ${fullFolder}\n`,
        ` filter: ${filter}\n`,
        ` expected: ${json(expected)}\n`,
        ` error: ${json(e)}\n`
      ];
    });
};

const tests = [
  [
    path.join("folder", "subfolder"),
    undefined,
    [
      "README.md",
      "file2.js",
      "file2.suffix1.js",
      "file2.suffix2.js",
      "file2.suffix3.js"
    ]
  ],
  [
    path.join("folder", "subfolder"),
    fileName => fileName.match(/.*\.md$/),
    ["README.md"]
  ],
  [
    "folder",
    undefined,
    [
      "README.md",
      "file.js",
      "file.suffix1.js",
      "file.suffix2.js",
      "file.suffix3.js",
      "subfolder/README.md",
      "subfolder/file2.js",
      "subfolder/file2.suffix1.js",
      "subfolder/file2.suffix2.js",
      "subfolder/file2.suffix3.js"
    ]
  ],
  [
    "folder",
    fileName => fileName.match(/.*file.*\.js$/),
    [
      "file.js",
      "file.suffix1.js",
      "file.suffix2.js",
      "file.suffix3.js",
      "subfolder/file2.js",
      "subfolder/file2.suffix1.js",
      "subfolder/file2.suffix2.js",
      "subfolder/file2.suffix3.js"
    ]
  ],
  [
    "folder",
    fileName => fileName.match(/.*(suffix1|suffix2)\.js$/),
    [
      "file.suffix1.js",
      "file.suffix2.js",
      "subfolder/file2.suffix1.js",
      "subfolder/file2.suffix2.js"
    ]
  ]
];

module.exports = () =>
  Promise.all(tests.map(expectFiles)).then(results => {
    const failures = results.filter(result => result.length);
    if (failures.length) {
      failures.forEach(failure => console.log(...failure));
      console.log(`${failures.length} getFiles bootstrap test(s) failed!`);
      process.exit(failures.length);
    }
  });
