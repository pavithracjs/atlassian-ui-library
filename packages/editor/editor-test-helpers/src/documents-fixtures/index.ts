/// <reference types="node" />

import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);

export async function loadAdfDocFixture(fileName: string): Promise<object> {
  const file = await readFile(
    path.join(__dirname, 'documents', fileName),
    'utf8',
  );
  return JSON.parse(file);
}

export async function getAdfDocFixturesList() {
  const files = await readdir(path.join(__dirname, 'documents'));
  return files.filter(files => !files.endsWith('.json'));
}
