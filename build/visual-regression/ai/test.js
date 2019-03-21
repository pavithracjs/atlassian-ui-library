var exec = require('child_process').spawnSync;

const image = `${process.cwd()}/build/visual-regression/ai/search.png`;

const getPrediction = async img => {
  const child = exec('python3', [
    `${process.cwd()}/build/visual-regression/ai/run_model.py`,
    `--image`,
    `${img}`,
  ]);

  const label = child.output
    .toString()
    .split(`\n`)[2]
    .split('-')[0]
    .trim();
  const prediction = child.output
    .toString()
    .split(`\n`)[2]
    .split('-')[1]
    .trim();

  console.log(label, prediction);
  process.on('exit', function() {
    return { label: prediction };
  });
};
