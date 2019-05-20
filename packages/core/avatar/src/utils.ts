import { ComponentType } from 'react';

export function omit<Obj extends { [key: string]: any }, Key extends keyof Obj>(
  obj: Obj,
  ...keysToOmit: Array<Key>
) {
  const newObj = { ...obj };

  for (const key of keysToOmit) {
    delete newObj[key];
  }
  return newObj;
}

export function getDisplayName(prefix: string, Component: ComponentType<any>) {
  const componentName: string = Component.displayName || Component.name;

  return componentName ? `${prefix}(${componentName})` : prefix;
}
