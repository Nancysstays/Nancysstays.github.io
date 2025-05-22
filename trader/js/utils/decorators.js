export function logMethod(target, key, descriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args) {
    console.log(`Calling ${key} with args:`, args);
    const result = originalMethod.apply(this, args);
    console.log(`Result of ${key}:`, result);
    return result;
  };

  return descriptor;
}
