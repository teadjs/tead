import path from "path";
import { readdir, stat } from "fs/promises";

const getFiles = (folderPath, fileFilter = () => true) =>
  readdir(folderPath).then(names =>
    Promise.all(
      names
        .map(name => path.join(folderPath, name))
        .map(fullPath => stat(fullPath).then(stats => [fullPath, stats]))
    ).then(allStats =>
      allStats.reduce(
        (others, [fullPath, stats]) =>
          others.then(filePaths =>
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

export default getFiles;
