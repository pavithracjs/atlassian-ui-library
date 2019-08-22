import {
  MediaMock,
  generateFilesFromTestData,
} from '@atlaskit/media-test-helpers';
import { testMediaFileId } from '@atlaskit/editor-test-helpers';
import { fakeImage } from '../../../media/media-test-helpers/src/mocks/database/mockData';

export default new MediaMock({
  recents: generateFilesFromTestData([
    {
      name: 'one.svg',
      dataUri: fakeImage,
    },
    {
      name: 'two.svg',
      dataUri: fakeImage,
    },
    {
      name: 'three.svg',
      dataUri: fakeImage,
    },
    {
      name: 'four.svg',
      dataUri: fakeImage,
    },
    {
      name: 'five.svg',
      dataUri: fakeImage,
    },
  ]),
  MediaServicesSample: generateFilesFromTestData([
    {
      id: testMediaFileId,
      name: 'one.svg',
      dataUri: fakeImage,
    },
  ]),
});
