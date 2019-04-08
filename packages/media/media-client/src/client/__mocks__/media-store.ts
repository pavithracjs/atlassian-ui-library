export class MediaStore {
  constructor() {}

  createCollection = jest.fn();

  getCollection = jest.fn();

  getCollectionItems = jest.fn();

  removeCollectionFile = jest.fn();

  createUpload = jest.fn();

  uploadChunk = jest.fn();

  probeChunks = jest.fn();

  createFileFromUpload = jest.fn();

  touchFiles = jest.fn();

  createFile = jest.fn();

  createFileFromBinary = jest.fn();

  getFile = jest.fn();

  getFileImageURL = jest.fn();

  getFileBinaryURL = jest.fn();

  getArtifactURL = jest.fn();

  getImage = jest.fn();

  getItems = jest.fn();

  getImageMetadata = jest.fn();

  appendChunksToUpload = jest.fn();

  copyFileWithToken = jest.fn();

  request = jest.fn();
}
