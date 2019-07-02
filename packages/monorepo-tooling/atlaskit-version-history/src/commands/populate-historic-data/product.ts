//@ts-ignore
import simpleGit from 'simple-git';

import loadFileFromGitHistory from '../../util/load-file-from-git-history';
import { IPackageJSON } from '../../util/package-json';
import { PopulateHistoricDataFlags } from './types';

// Object.fromEntries polyfill, remove when upgraded to node 10
function fromEntries(iterable: any) {
  return [...iterable].reduce(
    (obj, { 0: key, 1: val }) => Object.assign(obj, { [key]: val }),
    {},
  );
}

export type PopulateProductFlags = PopulateHistoricDataFlags & {};

type LogResult = {
  all: ListLogLine[];
};

type ListLogLine = {
  hash: string;
  date: string;
  message: string;
  refs: string;
  body: string;
  author_name: string;
  author_email: string;
};

const getHistory = () =>
  new Promise<LogResult>((resolve, reject) => {
    simpleGit('./').log(
      { '--merges': null, './package.json': null },
      (err: any, result: LogResult) => {
        if (err !== null) {
          reject(err);
        }

        resolve(result);
      },
    );
  });

export default async function run(flags: PopulateProductFlags) {
  if (flags.dryRun) {
    console.log('TODO');
  }

  const log = await getHistory();
  type DependencyMap = { [key: string]: string };

  type ParsedInfo = {
    commitData: ListLogLine & {
      date: string;
    };
    json: IPackageJSON | null;
    akDeps?: DependencyMap;
  };
  const readAllFiles: ParsedInfo[] = [];

  for (
    let historyListIndex = 0;
    historyListIndex < log.all.length;
    historyListIndex++
  ) {
    // Using a for loop because running all promises in parallel spawns too many processes
    // Batching would be more efficient but in it's current form it's not unreasonably slow.

    let item = log.all[historyListIndex];

    try {
      const json = await loadFileFromGitHistory(item.hash, 'package.json');
      const parsed: IPackageJSON = JSON.parse(json);

      readAllFiles.push({
        commitData: {
          ...item,
          date: new Date(item.date).toUTCString(),
        },
        json: parsed,
      });
    } catch (err) {
      console.error(err);
      readAllFiles.push({
        commitData: {
          ...item,
          date: new Date(item.date).toUTCString(),
        },
        json: null,
      });
    }
  }

  const getAkDependencyVersions = (depMap: { [key: string]: string }) => {
    return fromEntries(
      Object.entries(depMap).filter(([key]) => key.includes('atlaskit')),
    );
  };

  const allParsed: ParsedInfo[] = readAllFiles.map(item => {
    if (item.json === null) {
      return {
        ...item,
        akDeps: {},
      };
    }

    return {
      ...item,
      akDeps: {
        ...getAkDependencyVersions(item.json.devDependencies || {}),
        ...getAkDependencyVersions(item.json.dependencies || {}),
        ...getAkDependencyVersions(item.json.peerDependencies || {}),
      },
    };
  });

  allParsed.sort(
    (a, b) =>
      new Date(a.commitData.date).getTime() -
      new Date(b.commitData.date).getTime(),
  );

  type CsvColumn = [[string]];

  const csvData: CsvColumn = [['']];

  allParsed
    .filter(item => !item.akDeps || Object.entries(item.akDeps).length > 0)
    .forEach(item => {
      if (!item.akDeps) {
        return;
      }

      const firstColumn = csvData[0];
      const currentRow = firstColumn.push(item.commitData.date) - 1;

      Object.entries(item.akDeps).forEach(([name, version]) => {
        let depColumnIndex = csvData.findIndex(item => item[0] === name);
        if (depColumnIndex === -1) {
          depColumnIndex = csvData.push([name]) - 1;
        }

        // console.log(csvData)
        csvData[depColumnIndex][currentRow] = version;
      });
    });

  for (let i = 0; i < csvData.length; i++) {
    for (let j = 0; j < csvData.length; j++) {
      if (typeof csvData[i][j] !== 'string') {
        // console.log('found empty cell');
        csvData[i][j] = '';
      }
    }

    if (i !== 0 && csvData[0].length < csvData[i].length) {
    }
  }

  const csvStrings: string[] = [];

  csvData.forEach(column => {
    if (!column) {
      return;
    }
    for (let rowIndex = 0; rowIndex < csvData[0].length; rowIndex++) {
      const rowItem = column[rowIndex] || '';

      if (typeof csvStrings[rowIndex] !== 'string') {
        csvStrings[rowIndex] = '';
      }

      csvStrings[rowIndex] += `"${rowItem}",`;
    }
  });

  const theCSV = csvStrings.join('\n');
  console.log(theCSV);
}
