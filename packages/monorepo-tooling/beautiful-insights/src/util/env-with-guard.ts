export default function(name: string): string {
  if (
    !process.env.hasOwnProperty(name) ||
    !process.env[name] ||
    typeof process.env[name] !== 'string'
  ) {
    throw new Error(`Missing ${name} environment variable`);
  }
  return process.env[name] as string;
}
