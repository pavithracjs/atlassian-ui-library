const bolt = require('bolt');

(async () => {
  const project = await bolt.getProject();
  const workspaces = await bolt.getWorkspaces();
  const folder = process.argv[2];

  const packages = workspaces
    .filter(ws => ws.dir.includes(`packages/${folder}/`))
    .map(pkg => pkg.dir.replace(project.dir, ''));

  console.log(packages.join(' '));
})();
