var spawn = require('child_process').spawnSync;

const main = async () => {
  const image = `${process.cwd()}/build/visual-regression/ai/search.png`;
  try {
    const { label, prediction } = await getPrediction(image);
    console.log({ label, prediction });
  } catch (e) {
    console.log(e);
  }
};

const getPrediction = async (img, threshold = 0.8) => {
  const child = spawn('python3', [
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

  if (prediction >= threshold) {
    return { label, prediction };
  }
  return;
};

main();
