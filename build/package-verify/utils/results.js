function getExitCode(results) {
  return results
    .reduce((acc, current) => {
      if (typeof current === 'boolean') {
        return acc.concat({ found: current });
      }
      return acc.concat(current.paths, current.fieldMatches, current.compile);
    }, [])
    .filter(r => r.found === false).length;
}

module.exports = {
  getExitCode,
};
