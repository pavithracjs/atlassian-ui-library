#!/usr/bin/env node

const bolt = require('bolt');
const fs = require('fs');
const path = require('path');

async function main() {
  const pkgJson = JSON.parse(fs.readFileSync('package.json'));
  const oldDeps = pkgJson.dependencies;
  const allPackages = await bolt.getWorkspaces({
    cwd: path.join(process.cwd(), '..'),
  });
  const diff = [];
  const newDeps = {};
  allPackages
    .sort((a, b) => a.config.name.localeCompare(b.config.name))
    .forEach(({ config: { name, private, version } }) => {
      if (private) {
        return;
      }
      const existingEntry = pkgJson.dependencies[name];
      if (!existingEntry) {
        diff.push({ type: 'add', name, version });
      } else if (existingEntry !== version) {
        diff.push({ type: 'update', name, oldVersion: existingEntry, version });
      }
      newDeps[name] = version;
    });

  pkgJson.dependencies = newDeps;
  fs.writeFileSync('package.json', JSON.stringify(pkgJson, null, 2), {
    encoding: 'utf-8',
  });

  const addedDeps = diff.filter(d => d.type === 'add');
  console.log(`Added ${addedDeps.length} dependencies`);
  addedDeps.forEach(d => {
    console.log(`${d.name}@${d.version}`);
  });

  const updatedDeps = diff.filter(d => d.type === 'updated');
  console.log(`Updated ${updatedDeps.length} dependencies`);
  updatedDeps.forEach(d => {
    console.log(`${d.name}: ${d.oldVersion} -> ${d.version}`);
  });

  const removedDeps = Object.entries(oldDeps).filter(
    ([name]) => !newDeps[name],
  );
  console.log(`Removed ${removedDeps.length} dependencies`);
  removedDeps.forEach(([name, version]) => {
    console.log(`${name}@${version}`);
  });
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
