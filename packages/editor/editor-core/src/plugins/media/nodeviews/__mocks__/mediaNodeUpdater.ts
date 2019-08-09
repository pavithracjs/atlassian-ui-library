export class MediaNodeUpdater {
  static instances: MediaNodeUpdater[] = [];
  static mockReset() {
    this.instances.length = 0;
  }

  constructor() {
    this.updateContextId = jest.fn().mockResolvedValue(undefined);
    this.getAttrs = jest.fn();
    this.getObjectId = jest.fn().mockResolvedValue(undefined);
    this.getCurrentContextId = jest.fn();
    this.updateDimensions = jest.fn();
    this.getRemoteDimensions = jest.fn().mockResolvedValue(undefined);
    this.isNodeFromDifferentCollection = jest.fn().mockResolvedValue(true);
    this.copyNode = jest.fn().mockResolvedValue(undefined);

    MediaNodeUpdater.instances.push(this);
  }

  async updateContextId() {}
  getAttrs() {}
  async getObjectId() {}
  getCurrentContextId() {}
  updateDimensions() {}
  async getRemoteDimensions() {}
  async isNodeFromDifferentCollection() {}
  async copyNode() {}
}
