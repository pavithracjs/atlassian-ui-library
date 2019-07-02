import * as fs from 'fs';
import { validator } from '../../../validator';
import waitForExpect from 'wait-for-expect';

const validate = validator();

declare var __dirname: string;
const BASE_DIR = `${__dirname}/../../../../../adf-schema/src/__tests__/unit/json-schema/v1-reference`;

const readFilesSync = (path: string) =>
  fs.readdirSync(path).reduce(
    (acc: any[], name: string) => {
      if (name.match(/\.json$/)) {
        acc.push({
          name,
          data: JSON.parse(fs.readFileSync(`${path}/${name}`, 'utf-8')),
        });
      }
      return acc;
    },
    [] as { name: string; data: any }[],
  );

describe('validate', () => {
  ['full', 'stage-0'].forEach(schemaType => {
    const valid = readFilesSync(`${BASE_DIR}/${schemaType}/valid`);
    valid.forEach((file: any) => {
      // Don't test Application Card
      if (file.name.indexOf('applicationCard') === 0) {
        return;
      }
      it(`validates '${file.name}'`, () => {
        const run = () => {
          validate(file.data);
        };
        waitForExpect(() => {
          expect(run).not.toThrowError();
        });
      });
    });

    const invalid = readFilesSync(`${BASE_DIR}/${schemaType}/invalid`);
    invalid.forEach((file: any) => {
      it(`does not validate '${file.name}'`, async () => {
        const run = () => {
          validate(file.data);
        };
        await Promise.resolve();
        expect(run).toThrowError();
      });
    });
  });
});
