import { defineConfig } from '@trigger.dev/sdk/v3';

export default defineConfig({
  project: 'lightminute-ai',
  runtime: 'node',
  logLevel: 'info',
  maxDuration: 300,
  retries: {
    enabledInDev: true,
    default: {
      maxAttempts: 3,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000,
      factor: 2,
    },
  },
});
