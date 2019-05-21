/* 
Util function to merge json files under folder provided as input
Usage:
node <path_to_this_file>/merge.json.in.folder.js .folderWithJsonFiles
*/

const fs = require('fs');
const path = require('path');
const exec = require('child_process').execSync;
const input = path.join(process.cwd(), process.argv[2]);

const mergeJSONFiles = () => {
  const output = path.join(input, 'merged.json');
  if (exists(output)) {
    console.log('remove file if exist', output);
    try {
      exec(`rm -rf ${output}`);
    } catch (e) {}
  }

  const files = fs.readdirSync(input);

  const jsonFiles = files.reduce((acc, filename) => {
    if (filename.includes('.json')) {
      const content = JSON.parse(fs.readFileSync(path.join(input, filename)));
      acc.push(...content);
    }
    return acc;
  }, []);

  if (jsonFiles.length > 0) {
    fs.writeFileSync(output, JSON.stringify(jsonFiles), 'utf-8');
  }
};

function exists(filePath) {
  try {
    fs.accessSync(filePath);
    return true;
  } catch (e) {
    return false;
  }
}

(() => mergeJSONFiles())();
