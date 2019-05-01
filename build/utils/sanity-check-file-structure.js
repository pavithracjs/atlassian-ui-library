const fs = require('fs');

const src = fs.readdirSync('./src');
const root = fs.readdirSync('./');

const missing = src
  .filter(fileName => fileName !== '__tests__')
  .filter(fileName => !root.includes(fileName.replace(/\.tsx?/, '.js')));
if (missing.length > 0) {
  throw new Error(
    `Build files in root are  missing some files: ${missing.join(',')}`,
  );
}
