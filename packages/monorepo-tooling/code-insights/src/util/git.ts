import spawn from 'projector-spawn';

export async function getOriginUrl() {
  const gitCmd = await spawn('git', ['remote', 'get-url', 'origin']);
  return gitCmd.stdout.trim();
}

export async function getRef() {
  const gitCmd = await spawn('git', ['rev-parse', 'HEAD']);
  return gitCmd.stdout.trim().split('\n')[0];
}
