let defaultConfig = {
  fieldMatch: {},
  fields: ['main'],
  customPaths: [],
};

module.exports = {
  deepMergeConfig: (globalConfig, localConfig) => {
    // Ensure fields are unique
    const fields = new Set([
      'main',
      ...(localConfig.fields || globalConfig.fields || defaultConfig.fields),
    ]);

    // Ensure customPaths are unique
    const customPaths = new Set(
      localConfig.customPaths ||
        globalConfig.customPaths ||
        defaultConfig.customPaths,
    );

    return {
      fieldMatch: Object.assign(
        {},
        localConfig.fieldMatch ||
          globalConfig.fieldMatch ||
          defaultConfig.fieldMatch,
      ),
      fields: Array.from(fields).filter(Boolean),
      customPaths: Array.from(customPaths).filter(Boolean),
      peerDependencyResolution: new Map(
        Object.entries(
          Object.assign(
            {},
            localConfig.peerDependencyResolution ||
              globalConfig.peerDependencyResolution ||
              defaultConfig.peerDependencyResolution,
          ),
        ),
      ),
    };
  },
};
