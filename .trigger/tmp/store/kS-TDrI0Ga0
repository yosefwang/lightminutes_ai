import {
  require_dist_cjs as require_dist_cjs2
} from "./chunk-UODSHMCL.mjs";
import {
  client_exports,
  init_client
} from "./chunk-CVRFA6TN.mjs";
import "./chunk-WZBEB63H.mjs";
import {
  require_dist_cjs
} from "./chunk-P45HRBDO.mjs";
import {
  __commonJS,
  __name,
  __require,
  __toCommonJS,
  init_esm
} from "./chunk-5QNIFE2Q.mjs";

// node_modules/@aws-sdk/credential-provider-process/dist-cjs/index.js
var require_dist_cjs3 = __commonJS({
  "node_modules/@aws-sdk/credential-provider-process/dist-cjs/index.js"(exports) {
    init_esm();
    var sharedIniFileLoader = require_dist_cjs2();
    var propertyProvider = require_dist_cjs();
    var child_process = __require("child_process");
    var util = __require("util");
    var client = (init_client(), __toCommonJS(client_exports));
    var getValidatedProcessCredentials = /* @__PURE__ */ __name((profileName, data, profiles) => {
      if (data.Version !== 1) {
        throw Error(`Profile ${profileName} credential_process did not return Version 1.`);
      }
      if (data.AccessKeyId === void 0 || data.SecretAccessKey === void 0) {
        throw Error(`Profile ${profileName} credential_process returned invalid credentials.`);
      }
      if (data.Expiration) {
        const currentTime = /* @__PURE__ */ new Date();
        const expireTime = new Date(data.Expiration);
        if (expireTime < currentTime) {
          throw Error(`Profile ${profileName} credential_process returned expired credentials.`);
        }
      }
      let accountId = data.AccountId;
      if (!accountId && profiles?.[profileName]?.aws_account_id) {
        accountId = profiles[profileName].aws_account_id;
      }
      const credentials = {
        accessKeyId: data.AccessKeyId,
        secretAccessKey: data.SecretAccessKey,
        ...data.SessionToken && { sessionToken: data.SessionToken },
        ...data.Expiration && { expiration: new Date(data.Expiration) },
        ...data.CredentialScope && { credentialScope: data.CredentialScope },
        ...accountId && { accountId }
      };
      client.setCredentialFeature(credentials, "CREDENTIALS_PROCESS", "w");
      return credentials;
    }, "getValidatedProcessCredentials");
    var resolveProcessCredentials = /* @__PURE__ */ __name(async (profileName, profiles, logger) => {
      const profile = profiles[profileName];
      if (profiles[profileName]) {
        const credentialProcess = profile["credential_process"];
        if (credentialProcess !== void 0) {
          const execPromise = util.promisify(sharedIniFileLoader.externalDataInterceptor?.getTokenRecord?.().exec ?? child_process.exec);
          try {
            const { stdout } = await execPromise(credentialProcess);
            let data;
            try {
              data = JSON.parse(stdout.trim());
            } catch {
              throw Error(`Profile ${profileName} credential_process returned invalid JSON.`);
            }
            return getValidatedProcessCredentials(profileName, data, profiles);
          } catch (error) {
            throw new propertyProvider.CredentialsProviderError(error.message, { logger });
          }
        } else {
          throw new propertyProvider.CredentialsProviderError(`Profile ${profileName} did not contain credential_process.`, { logger });
        }
      } else {
        throw new propertyProvider.CredentialsProviderError(`Profile ${profileName} could not be found in shared credentials file.`, {
          logger
        });
      }
    }, "resolveProcessCredentials");
    var fromProcess = /* @__PURE__ */ __name((init = {}) => async ({ callerClientConfig } = {}) => {
      init.logger?.debug("@aws-sdk/credential-provider-process - fromProcess");
      const profiles = await sharedIniFileLoader.parseKnownFiles(init);
      return resolveProcessCredentials(sharedIniFileLoader.getProfileName({
        profile: init.profile ?? callerClientConfig?.profile
      }), profiles, init.logger);
    }, "fromProcess");
    exports.fromProcess = fromProcess;
  }
});
export default require_dist_cjs3();
//# sourceMappingURL=dist-cjs-4EGC7UEP.mjs.map
