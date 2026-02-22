import {
  init_sts,
  sts_exports
} from "./chunk-WMJKHVOP.mjs";
import "./chunk-BOXX7IAE.mjs";
import "./chunk-UBXUY2U2.mjs";
import "./chunk-RA5DMQQ6.mjs";
import "./chunk-K7ZPZUY5.mjs";
import "./chunk-BFQRAWI6.mjs";
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
import "./chunk-YS6GXE6O.mjs";
import {
  __commonJS,
  __name,
  __require,
  __toCommonJS,
  init_esm
} from "./chunk-5QNIFE2Q.mjs";

// node_modules/@aws-sdk/credential-provider-web-identity/dist-cjs/fromWebToken.js
var require_fromWebToken = __commonJS({
  "node_modules/@aws-sdk/credential-provider-web-identity/dist-cjs/fromWebToken.js"(exports) {
    "use strict";
    init_esm();
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: /* @__PURE__ */ __name(function() {
          return m[k];
        }, "get") };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || /* @__PURE__ */ function() {
      var ownKeys = /* @__PURE__ */ __name(function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
          return ar;
        };
        return ownKeys(o);
      }, "ownKeys");
      return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    }();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fromWebToken = void 0;
    var fromWebToken = /* @__PURE__ */ __name((init) => async (awsIdentityProperties) => {
      init.logger?.debug("@aws-sdk/credential-provider-web-identity - fromWebToken");
      const { roleArn, roleSessionName, webIdentityToken, providerId, policyArns, policy, durationSeconds } = init;
      let { roleAssumerWithWebIdentity } = init;
      if (!roleAssumerWithWebIdentity) {
        const { getDefaultRoleAssumerWithWebIdentity } = await Promise.resolve().then(() => __importStar((init_sts(), __toCommonJS(sts_exports))));
        roleAssumerWithWebIdentity = getDefaultRoleAssumerWithWebIdentity({
          ...init.clientConfig,
          credentialProviderLogger: init.logger,
          parentClientConfig: {
            ...awsIdentityProperties?.callerClientConfig,
            ...init.parentClientConfig
          }
        }, init.clientPlugins);
      }
      return roleAssumerWithWebIdentity({
        RoleArn: roleArn,
        RoleSessionName: roleSessionName ?? `aws-sdk-js-session-${Date.now()}`,
        WebIdentityToken: webIdentityToken,
        ProviderId: providerId,
        PolicyArns: policyArns,
        Policy: policy,
        DurationSeconds: durationSeconds
      });
    }, "fromWebToken");
    exports.fromWebToken = fromWebToken;
  }
});

// node_modules/@aws-sdk/credential-provider-web-identity/dist-cjs/fromTokenFile.js
var require_fromTokenFile = __commonJS({
  "node_modules/@aws-sdk/credential-provider-web-identity/dist-cjs/fromTokenFile.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fromTokenFile = void 0;
    var client_1 = (init_client(), __toCommonJS(client_exports));
    var property_provider_1 = require_dist_cjs();
    var shared_ini_file_loader_1 = require_dist_cjs2();
    var fs_1 = __require("fs");
    var fromWebToken_1 = require_fromWebToken();
    var ENV_TOKEN_FILE = "AWS_WEB_IDENTITY_TOKEN_FILE";
    var ENV_ROLE_ARN = "AWS_ROLE_ARN";
    var ENV_ROLE_SESSION_NAME = "AWS_ROLE_SESSION_NAME";
    var fromTokenFile = /* @__PURE__ */ __name((init = {}) => async (awsIdentityProperties) => {
      init.logger?.debug("@aws-sdk/credential-provider-web-identity - fromTokenFile");
      const webIdentityTokenFile = init?.webIdentityTokenFile ?? process.env[ENV_TOKEN_FILE];
      const roleArn = init?.roleArn ?? process.env[ENV_ROLE_ARN];
      const roleSessionName = init?.roleSessionName ?? process.env[ENV_ROLE_SESSION_NAME];
      if (!webIdentityTokenFile || !roleArn) {
        throw new property_provider_1.CredentialsProviderError("Web identity configuration not specified", {
          logger: init.logger
        });
      }
      const credentials = await (0, fromWebToken_1.fromWebToken)({
        ...init,
        webIdentityToken: shared_ini_file_loader_1.externalDataInterceptor?.getTokenRecord?.()[webIdentityTokenFile] ?? (0, fs_1.readFileSync)(webIdentityTokenFile, { encoding: "ascii" }),
        roleArn,
        roleSessionName
      })(awsIdentityProperties);
      if (webIdentityTokenFile === process.env[ENV_TOKEN_FILE]) {
        (0, client_1.setCredentialFeature)(credentials, "CREDENTIALS_ENV_VARS_STS_WEB_ID_TOKEN", "h");
      }
      return credentials;
    }, "fromTokenFile");
    exports.fromTokenFile = fromTokenFile;
  }
});

// node_modules/@aws-sdk/credential-provider-web-identity/dist-cjs/index.js
var require_dist_cjs3 = __commonJS({
  "node_modules/@aws-sdk/credential-provider-web-identity/dist-cjs/index.js"(exports) {
    init_esm();
    var fromTokenFile = require_fromTokenFile();
    var fromWebToken = require_fromWebToken();
    Object.keys(fromTokenFile).forEach(function(k) {
      if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
        enumerable: true,
        get: /* @__PURE__ */ __name(function() {
          return fromTokenFile[k];
        }, "get")
      });
    });
    Object.keys(fromWebToken).forEach(function(k) {
      if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
        enumerable: true,
        get: /* @__PURE__ */ __name(function() {
          return fromWebToken[k];
        }, "get")
      });
    });
  }
});
export default require_dist_cjs3();
//# sourceMappingURL=dist-cjs-66PIYABX.mjs.map
