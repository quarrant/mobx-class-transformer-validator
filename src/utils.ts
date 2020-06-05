export function getObjectKeys<T>(target: T) {
  return Object.keys(target) as (keyof T)[];
}

export function isObjectKey<T extends Object>(object: T, key: string | number | symbol): key is keyof T {
  return key in object || object.hasOwnProperty(key) || !!getObjectKeys(object).find((k) => k === key);
}
