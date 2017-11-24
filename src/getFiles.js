const path = require("path");
const fs = require("fs");
const promisify = fn => (...args) =>
  new Promise((resolve, reject) =>
    fn(...args, (err, ...results) => (err ? reject(err) : resolve(...results)))
  );
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

const getFiles = (folderPath, fileFilter = () => true) =>
  readdir(folderPath).then(names =>
    Promise.all(
      names
        .map(name => path.join(folderPath, name))
        .map(fullPath => stat(fullPath).then(stats => [fullPath, stats]))
    ).then(allStats =>
      allStats.reduce(
        (others, [fullPath, stats]) =>
          others.then(
            filePaths =>
              stats.isDirectory()
                ? getFiles(fullPath).then(childPaths =>
                    filePaths.concat(childPaths.filter(fileFilter))
                  )
                : filePaths.concat(fileFilter(fullPath) ? fullPath : [])
          ),
        Promise.resolve([])
      )
    )
  );

module.exports = getFiles;
