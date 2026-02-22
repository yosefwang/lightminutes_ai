import { defineConfig } from '@trigger.dev/sdk';

export default defineConfig({
  project: 'proj_djysjzfpwoqbjlvvkzge',
  dirs: ['./trigger'],
  runtime: 'node',
  logLevel: 'info',
  maxDuration: 300, // 5 minutes
  retries: {
    enabledInDev: true,
    default: {
      maxAttempts: 3,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000,
      factor: 2,
      randomize: true,
    },
  },
  build: {
    autoDetectExternal: true,
    keepNames: true,
    minify: false,
    extensions: [],
  },
});
