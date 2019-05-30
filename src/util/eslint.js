export function extendEslint(config, newConfig, position = 0) {
  if (!config) return [newConfig];
  if (Array.isArray(config)) {
    const oldConfig = config.filter((c) => c !== newConfig);
    if (position === Infinity) return [...oldConfig, newConfig];
    return [newConfig, ...oldConfig];
  }

  if (config === newConfig) return [newConfig];
  if (position === Infinity) return [config, newConfig];
  return [newConfig, config];
}
