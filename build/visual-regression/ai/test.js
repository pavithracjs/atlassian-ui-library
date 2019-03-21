var exec = require('child_process').spawnSync;

console.log(process.cwd());
const child = exec('python3', [
  `${process.cwd()}/build/visual-regression/ai/run_model.py`,
  `--image`,
  `${process.cwd()}/build/visual-regression/ai/search.png`,
]);
console.log(child.output.toString('utf8'));
process.on('exit', function() {
  console.log('bye');
});
