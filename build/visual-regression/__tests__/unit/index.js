import {
  isLatestVersion,
  getDockerImageProdVersion,
  getDockerImageLocalVersion,
} from '../../docker-helper';

test('The latest image version should always be a string', async () => {
  const latestVersion = await getDockerImageLocalVersion();
  expect(latestVersion).toBeDefined();
  expect(latestVersion).not.toBe('<none>');
  expect(typeof latestVersion).toBe('string');
});
describe('Delete old docker image', () => {
  test('should be called when the localVersion is different from the productionVersion', async () => {
    const isLatest = await isLatestVersion('1.0.12');
    expect(isLatest).toBe(false);
  });
  test('should not be called when the localVersion is the same as the productionVersion', async () => {
    const prodVersion = getDockerImageProdVersion();
    const isLatest = await isLatestVersion(prodVersion);
    expect(isLatest).toBe(true);
  });
});
