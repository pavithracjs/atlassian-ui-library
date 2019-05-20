const fs = require('fs');
const path = require('path');
const exec = require('child_process').execSync;
const input = path.join(process.cwd(), process.argv[2]);
const readFiles = () => {
  const files = fs.readdirSync(input);
  const output = path.join(input, 'merged.json');

  const jsonFiles = files
    .filter(filename => {
      return filename.includes('.json');
    })
    .map(file => {
      const content = fs.readFileSync(path.join(input, file));
      console.log(content);
      return content;
    });

  if (fs.existsSync(output)) {
    try {
      console.log('deleting merged file');
      exec(`rm -rf ${output}`);
    } catch (e) {}
  }

  fs.writeFileSync(output, jsonFiles, 'utf-8');
};

(() => readFiles())();
