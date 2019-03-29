export default function(name: string, dontThrow: boolean): string | null {
  if (
    !process.env.hasOwnProperty(name) ||
    !process.env[name] ||
    typeof process.env[name] !== 'string'
  ) {
    if (dontThrow) {
      return null;
    }
    throw new Error(`Missing ${name} environment variable`);
  }
  return process.env[name] as string;
}
