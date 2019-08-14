export class MediaNodeUpdater {
  static instances: MediaNodeUpdater[] = [];
  static resolvers = {};
  static mockReset() {
    this.instances.length = 0;
    MediaNodeUpdater.resolvers = {};
  }

  constructor() {
    this.updateContextId = jest.fn().mockResolvedValue(undefined);
    this.getAttrs = jest.fn();
    this.getObjectId = jest.fn().mockResolvedValue(undefined);
    this.getCurrentContextId = jest.fn();
    this.updateDimensions = jest.fn();
    this.getRemoteDimensions =
      (MediaNodeUpdater.resolvers as any)['getRemoteDimensions'] ||
      jest.fn().mockResolvedValue(undefined);
    this.isNodeFromDifferentCollection = jest.fn().mockResolvedValue(true);
    this.copyNode = jest.fn().mockResolvedValue(undefined);
    this.updateFileAttrs = jest.fn();
    MediaNodeUpdater.instances.push(this);
  }

  static resolve(key: string, value: any) {
    (MediaNodeUpdater.resolvers as any)[key] = value;
  }

  async updateContextId() {}
  getAttrs() {}
  async getObjectId() {}
  getCurrentContextId() {}
  updateDimensions() {}
  async getRemoteDimensions() {}
  async isNodeFromDifferentCollection() {}
  async copyNode() {}
  async updateFileAttrs() {}
}
