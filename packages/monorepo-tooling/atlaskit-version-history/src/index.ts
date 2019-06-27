import meow from 'meow';
// import { getRef, getOriginUrl } from './util/git';
import simpleGit from 'simple-git';
import loadFileFromGitHistory from './util/load-file-from-git-history';
import { IPackageJSON } from './util/package-json';

// Object.fromEntries polyfill, remove when upgraded to node 10
function fromEntries(iterable) {
  return [...iterable].reduce(
    (obj, { 0: key, 1: val }) => Object.assign(obj, { [key]: val }),
    {},
  );
}

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

// type Flags = {

// };

// prettier-ignore
const HELP_MSG = `
   Atlaskit version history
`;

export async function run() {
  meow(HELP_MSG);

  /* 
  {
    flags: {
      commit: {
        type: 'string',
      },
      branch: {
        type: 'string',
      },
      targetBranch: {
        type: 'string',
        default: 'origin/master',
      },
      gitUrl: {
        type: 'string',
      },
      reporters: {
        type: 'string',
        default: 'console',
      },
    },
  }
  */

  const log = await getHistory();
  const readAllFiles: any[] = [];

  for (let i = 0; i < log.all.length; i++) {
    let item = log.all[i];
    try {
      const json = await loadFileFromGitHistory(item.hash, 'package.json');

      let parsed: IPackageJSON | null = null;
      try {
        parsed = JSON.parse(json);
      } catch (err) {}
      readAllFiles.push({
        item: {
          ...item,
          date: new Date(item.date).toUTCString(),
        },
        json: parsed,
      });
    } catch (err) {
      console.error(err);
      readAllFiles.push({
        item: {
          ...item,
          date: new Date(item.date).toUTCString(),
        },
        json: null,
      });
    }
  }

  const getAkDependencyVersions = depMap => {
    return fromEntries(
      Object.entries(depMap).filter(([key]) => key.includes('atlaskit')),
    );
  };

  const allParsed = readAllFiles.map(item => {
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
    (a, b) => new Date(a.item.date).getTime() - new Date(b.item.date).getTime(),
  );

  const csvData: any = [['']];

  allParsed
    .filter(item => Object.entries(item.akDeps).length > 0)
    .forEach(item => {
      const firstColumn = csvData[0];
      const currentRow = firstColumn.push(item.item.date) - 1;

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

  const csvStrings: any = [];

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
