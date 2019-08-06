import { exec } from 'child_process';

describe('TypeScript dist check', function() {
  it('When the src directory matches the root it should pass', done => {
    exec(
      'node ../../../../sanity-check-file-structure.js',
      { cwd: `${__dirname}/pass` },
      (error, stdout, stderr) => {
        if (error || stderr) {
          return done.fail(error || stderr);
        }
        expect(stdout).toBeDefined();
        return done();
      },
    );
  });
  it('When the src directory doesnt match the root it should thrown an error', done => {
    exec(
      'node ../../../../sanity-check-file-structure.js',
      { cwd: `${__dirname}/fail` },
      (error, stdout, stderr) => {
        if (stderr) {
          expect(stderr).toEqual(
            'Error: Build files in root are  missing some files or folders: index.js\n',
          );
          return done();
        }

        return done.fail('Expected this scenario to fail');
      },
    );
  });
});
