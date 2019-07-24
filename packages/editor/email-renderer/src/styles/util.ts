export const CS_CONTENT_PREFIX = 'csg';
export const createClassName = (name: string) => {
  return `${CS_CONTENT_PREFIX}-${name}`;
};
