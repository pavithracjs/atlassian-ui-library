import {
  isLatestVersion,
  getDockerImageProdVersion,
  getDockerImageLocalVersion,
} from '../../docker-helper';

test('The latest image version should always be a string', async done => {
  const latestVersion = await getDockerImageLocalVersion();
  expect(latestVersion).toBeDefined();
  expect(latestVersion).not.toBe('<none>');
  expect(typeof latestVersion).toBe('string');
  done();
});
describe('Delete old docker image', () => {
  test('should be called when the localVersion is different from the productionVersion', async done => {
    const isLatest = await isLatestVersion('1.0.12');
    expect(isLatest).toBe(false);
    done();
  });
  test('should not be called when the localVersion is the same from the productionVersion', async done => {
    const prodVersion = getDockerImageProdVersion();
    const isLatest = await isLatestVersion(prodVersion);
    expect(isLatest).toBe(true);
    done();
  });
});
