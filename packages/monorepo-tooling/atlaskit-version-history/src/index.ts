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
      { file: './package.json' },
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

  const readAllFiles = log.all.map(item => {
    return loadFileFromGitHistory(item.hash, 'package.json')
      .then(json => {
        let parsed: IPackageJSON | null = null;
        try {
          parsed = JSON.parse(json);
        } catch (err) {}

        return {
          item: {
            ...item,
            date: new Date(item.date).getUTCDate(),
          },
          json: parsed,
        };
      })
      .catch(err => {
        console.error(err);
        return {
          item: {
            ...item,
            date: new Date(item.date).getUTCDate(),
          },
          json: null,
        };
      });
  });

  const getAkDependencyVersions = depMap => {
    return fromEntries(
      Object.entries(depMap).filter(([key]) => key.includes('atlaskit')),
    );
  };

  const allParsed = (await Promise.all(readAllFiles)).map(item => {
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
      const currentColumn = csvData.push([item.item.date]) - 1;

      Object.entries(item.akDeps).forEach(([name, version]) => {
        let depRowIndex = firstColumn.findIndex(row => row === name);

        if (depRowIndex === -1) {
          depRowIndex = firstColumn.push(name) - 1;
        }

        // console.log(csvData)
        csvData[currentColumn][depRowIndex] = version;
      });
    });

  const csvStrings: any = [];

  csvData.forEach(column => {
    if (!column) {
      return;
    }
    column.forEach((rowItem, rowIndex) => {
      if (typeof csvStrings[rowIndex] !== 'string') {
        csvStrings[rowIndex] = '';
      }
      csvStrings[rowIndex] += `"${rowItem}",`;
    });
  });

  const theCSV = csvStrings.join('\n');
  console.log(theCSV);
}
