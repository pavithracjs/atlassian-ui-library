export default function(name: string) {
  if (!process.env.hasOwnProperty(name)) {
    throw new Error(`Missing ${name} environment variable`);
  }
  return process.env[name];
}
