export function isModuleNotFoundError(e: Error, pkgId: string) {
  const a = new RegExp(`^Missing ${pkgId} in file system`);
  return (
    (e.message && e.message.indexOf('Cannot find module') > -1) ||
    a.test(e.message)
  );
}
