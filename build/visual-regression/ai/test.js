var exec = require('child_process').spawnSync;

const setPython = exec(
  'alias python=/Library/Frameworks/Python.framework/Versions/2.7/bin/python',
  [],
);
const child = exec('python', [
  '/Users/rbellebon/atlaskit-mk-2/build/visual-regression/ai/run_model.py --image /Users/rbellebon/atlaskit-mk-2/build/visual-regression/ai/search.png',
]);
console.log(child.output.toString('utf8'));
process.on('exit', function() {
  console.log('bye');
});
