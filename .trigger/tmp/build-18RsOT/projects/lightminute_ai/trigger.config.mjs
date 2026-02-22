import {
  defineConfig
} from "../../chunk-NXCHGGXD.mjs";
import "../../chunk-LRTAKWDY.mjs";
import {
  init_esm
} from "../../chunk-5QNIFE2Q.mjs";

// trigger.config.ts
init_esm();
var trigger_config_default = defineConfig({
  project: "proj_djysjzfpwoqbjlvvkzge",
  dirs: ["./trigger"],
  runtime: "node",
  logLevel: "info",
  maxDuration: 300,
  // 5 minutes
  retries: {
    enabledInDev: true,
    default: {
      maxAttempts: 3,
      minTimeoutInMs: 1e3,
      maxTimeoutInMs: 1e4,
      factor: 2,
      randomize: true
    }
  },
  build: {}
});
var resolveEnvVars = void 0;
export {
  trigger_config_default as default,
  resolveEnvVars
};
//# sourceMappingURL=trigger.config.mjs.map
