const { readFile, readdir } = require('./fs');

/*
Does your package have a path that shouldn't be distributed?
Cool just add it to the exceptionlist
 */
const exceptionList = ['__tests__', '@types'];

const main = async () => {
  const [src, root, packageJSON] = await Promise.all([
    readdir('./src'),
    readdir('./'),
    readFile('./package.json').then(res => JSON.parse(res)),
  ]);

  if (packageJSON.module !== 'index.js' || packageJSON.private) {
    return;
  }

  const missing = src
    .filter(fileName => !exceptionList.includes(fileName))
    .filter(fileName => !root.includes(fileName.replace(/\.tsx?/, '.js')));
  if (missing.length > 0) {
    throw new Error(
      `Build files in root are  missing some files: ${missing.join(',')}`,
    );
  }
};

main().catch(err => {
  console.error(err.toString());
  process.exit(1);
});
