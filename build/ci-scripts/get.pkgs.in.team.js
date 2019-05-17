const bolt = require('bolt');

(async () => {
  const project = await bolt.getProject();
  const workspaces = await bolt.getWorkspaces();
  let input = process.argv[2];

  // special handling for editor pkgs
  if (input.includes('editor')) {
    input = 'editor';
  }

  const allFolders = input.split(',');

  const packages = allFolders.map(folder => {
    return workspaces
      .filter(ws => ws.dir.includes(`packages/${folder}/`))
      .map(pkg => pkg.dir.replace(project.dir, ''));
  });
  // flatten the map above
  let pkgs = packages.reduce((acc, val) => acc.concat(val), []);

  // apply split logic for editor pkgs
  if (input.includes('editor')) {
    const half = Math.floor(pkgs.length / 2);
    if (process.argv[2].includes('part-1')) {
      editorPkgs = pkgs.slice(0, half);
    } else {
      editorPkgs = pkgs.slice(half, pkgs.length);
    }
    pkgs = editorPkgs;
  }

  console.log(pkgs.join(' '));
})();
