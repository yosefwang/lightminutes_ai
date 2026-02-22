import {
  dist_es_exports,
  dist_es_exports2,
  httpAuthSchemes_exports,
  init_dist_es,
  init_dist_es2,
  init_httpAuthSchemes,
  init_protocols,
  protocols_exports,
  require_dist_cjs10 as require_dist_cjs18,
  require_dist_cjs11 as require_dist_cjs19,
  require_dist_cjs12 as require_dist_cjs20,
  require_dist_cjs13 as require_dist_cjs21,
  require_dist_cjs14 as require_dist_cjs22,
  require_dist_cjs15 as require_dist_cjs23,
  require_dist_cjs16 as require_dist_cjs24,
  require_dist_cjs17 as require_dist_cjs25,
  require_dist_cjs2 as require_dist_cjs8,
  require_dist_cjs3 as require_dist_cjs9,
  require_dist_cjs4 as require_dist_cjs10,
  require_dist_cjs6 as require_dist_cjs11,
  require_dist_cjs7 as require_dist_cjs13,
  require_dist_cjs8 as require_dist_cjs14,
  require_dist_cjs9 as require_dist_cjs15
} from "./chunk-UBXUY2U2.mjs";
import {
  require_dist_cjs as require_dist_cjs12,
  require_dist_cjs2 as require_dist_cjs17
} from "./chunk-RA5DMQQ6.mjs";
import {
  init_schema,
  init_tslib_es6,
  require_dist_cjs as require_dist_cjs2,
  require_dist_cjs2 as require_dist_cjs4,
  require_dist_cjs4 as require_dist_cjs5,
  require_dist_cjs8 as require_dist_cjs7,
  schema_exports,
  tslib_es6_exports
} from "./chunk-K7ZPZUY5.mjs";
import {
  require_dist_cjs
} from "./chunk-BFQRAWI6.mjs";
import {
  require_dist_cjs as require_dist_cjs16
} from "./chunk-UODSHMCL.mjs";
import {
  client_exports,
  init_client
} from "./chunk-CVRFA6TN.mjs";
import "./chunk-WZBEB63H.mjs";
import {
  require_dist_cjs as require_dist_cjs6
} from "./chunk-P45HRBDO.mjs";
import {
  require_dist_cjs3
} from "./chunk-YS6GXE6O.mjs";
import {
  __commonJS,
  __name,
  __require,
  __toCommonJS,
  init_esm
} from "./chunk-5QNIFE2Q.mjs";

// node_modules/@aws-sdk/token-providers/dist-cjs/index.js
var require_dist_cjs26 = __commonJS({
  "node_modules/@aws-sdk/token-providers/dist-cjs/index.js"(exports) {
    "use strict";
    init_esm();
    var client = (init_client(), __toCommonJS(client_exports));
    var httpAuthSchemes = (init_httpAuthSchemes(), __toCommonJS(httpAuthSchemes_exports));
    var propertyProvider = require_dist_cjs6();
    var sharedIniFileLoader = require_dist_cjs16();
    var fs = __require("fs");
    var fromEnvSigningName = /* @__PURE__ */ __name(({ logger, signingName } = {}) => async () => {
      logger?.debug?.("@aws-sdk/token-providers - fromEnvSigningName");
      if (!signingName) {
        throw new propertyProvider.TokenProviderError("Please pass 'signingName' to compute environment variable key", { logger });
      }
      const bearerTokenKey = httpAuthSchemes.getBearerTokenEnvKey(signingName);
      if (!(bearerTokenKey in process.env)) {
        throw new propertyProvider.TokenProviderError(`Token not present in '${bearerTokenKey}' environment variable`, { logger });
      }
      const token = { token: process.env[bearerTokenKey] };
      client.setTokenFeature(token, "BEARER_SERVICE_ENV_VARS", "3");
      return token;
    }, "fromEnvSigningName");
    var EXPIRE_WINDOW_MS = 5 * 60 * 1e3;
    var REFRESH_MESSAGE = `To refresh this SSO session run 'aws sso login' with the corresponding profile.`;
    var getSsoOidcClient = /* @__PURE__ */ __name(async (ssoRegion, init = {}, callerClientConfig) => {
      const { SSOOIDCClient } = await import("./sso-oidc-2KMEH4WC.mjs");
      const coalesce = /* @__PURE__ */ __name((prop) => init.clientConfig?.[prop] ?? init.parentClientConfig?.[prop] ?? callerClientConfig?.[prop], "coalesce");
      const ssoOidcClient = new SSOOIDCClient(Object.assign({}, init.clientConfig ?? {}, {
        region: ssoRegion ?? init.clientConfig?.region,
        logger: coalesce("logger"),
        userAgentAppId: coalesce("userAgentAppId")
      }));
      return ssoOidcClient;
    }, "getSsoOidcClient");
    var getNewSsoOidcToken = /* @__PURE__ */ __name(async (ssoToken, ssoRegion, init = {}, callerClientConfig) => {
      const { CreateTokenCommand } = await import("./sso-oidc-2KMEH4WC.mjs");
      const ssoOidcClient = await getSsoOidcClient(ssoRegion, init, callerClientConfig);
      return ssoOidcClient.send(new CreateTokenCommand({
        clientId: ssoToken.clientId,
        clientSecret: ssoToken.clientSecret,
        refreshToken: ssoToken.refreshToken,
        grantType: "refresh_token"
      }));
    }, "getNewSsoOidcToken");
    var validateTokenExpiry = /* @__PURE__ */ __name((token) => {
      if (token.expiration && token.expiration.getTime() < Date.now()) {
        throw new propertyProvider.TokenProviderError(`Token is expired. ${REFRESH_MESSAGE}`, false);
      }
    }, "validateTokenExpiry");
    var validateTokenKey = /* @__PURE__ */ __name((key, value, forRefresh = false) => {
      if (typeof value === "undefined") {
        throw new propertyProvider.TokenProviderError(`Value not present for '${key}' in SSO Token${forRefresh ? ". Cannot refresh" : ""}. ${REFRESH_MESSAGE}`, false);
      }
    }, "validateTokenKey");
    var { writeFile } = fs.promises;
    var writeSSOTokenToFile = /* @__PURE__ */ __name((id, ssoToken) => {
      const tokenFilepath = sharedIniFileLoader.getSSOTokenFilepath(id);
      const tokenString = JSON.stringify(ssoToken, null, 2);
      return writeFile(tokenFilepath, tokenString);
    }, "writeSSOTokenToFile");
    var lastRefreshAttemptTime = /* @__PURE__ */ new Date(0);
    var fromSso = /* @__PURE__ */ __name((init = {}) => async ({ callerClientConfig } = {}) => {
      init.logger?.debug("@aws-sdk/token-providers - fromSso");
      const profiles = await sharedIniFileLoader.parseKnownFiles(init);
      const profileName = sharedIniFileLoader.getProfileName({
        profile: init.profile ?? callerClientConfig?.profile
      });
      const profile = profiles[profileName];
      if (!profile) {
        throw new propertyProvider.TokenProviderError(`Profile '${profileName}' could not be found in shared credentials file.`, false);
      } else if (!profile["sso_session"]) {
        throw new propertyProvider.TokenProviderError(`Profile '${profileName}' is missing required property 'sso_session'.`);
      }
      const ssoSessionName = profile["sso_session"];
      const ssoSessions = await sharedIniFileLoader.loadSsoSessionData(init);
      const ssoSession = ssoSessions[ssoSessionName];
      if (!ssoSession) {
        throw new propertyProvider.TokenProviderError(`Sso session '${ssoSessionName}' could not be found in shared credentials file.`, false);
      }
      for (const ssoSessionRequiredKey of ["sso_start_url", "sso_region"]) {
        if (!ssoSession[ssoSessionRequiredKey]) {
          throw new propertyProvider.TokenProviderError(`Sso session '${ssoSessionName}' is missing required property '${ssoSessionRequiredKey}'.`, false);
        }
      }
      ssoSession["sso_start_url"];
      const ssoRegion = ssoSession["sso_region"];
      let ssoToken;
      try {
        ssoToken = await sharedIniFileLoader.getSSOTokenFromFile(ssoSessionName);
      } catch (e) {
        throw new propertyProvider.TokenProviderError(`The SSO session token associated with profile=${profileName} was not found or is invalid. ${REFRESH_MESSAGE}`, false);
      }
      validateTokenKey("accessToken", ssoToken.accessToken);
      validateTokenKey("expiresAt", ssoToken.expiresAt);
      const { accessToken, expiresAt } = ssoToken;
      const existingToken = { token: accessToken, expiration: new Date(expiresAt) };
      if (existingToken.expiration.getTime() - Date.now() > EXPIRE_WINDOW_MS) {
        return existingToken;
      }
      if (Date.now() - lastRefreshAttemptTime.getTime() < 30 * 1e3) {
        validateTokenExpiry(existingToken);
        return existingToken;
      }
      validateTokenKey("clientId", ssoToken.clientId, true);
      validateTokenKey("clientSecret", ssoToken.clientSecret, true);
      validateTokenKey("refreshToken", ssoToken.refreshToken, true);
      try {
        lastRefreshAttemptTime.setTime(Date.now());
        const newSsoOidcToken = await getNewSsoOidcToken(ssoToken, ssoRegion, init, callerClientConfig);
        validateTokenKey("accessToken", newSsoOidcToken.accessToken);
        validateTokenKey("expiresIn", newSsoOidcToken.expiresIn);
        const newTokenExpiration = new Date(Date.now() + newSsoOidcToken.expiresIn * 1e3);
        try {
          await writeSSOTokenToFile(ssoSessionName, {
            ...ssoToken,
            accessToken: newSsoOidcToken.accessToken,
            expiresAt: newTokenExpiration.toISOString(),
            refreshToken: newSsoOidcToken.refreshToken
          });
        } catch (error) {
        }
        return {
          token: newSsoOidcToken.accessToken,
          expiration: newTokenExpiration
        };
      } catch (error) {
        validateTokenExpiry(existingToken);
        return existingToken;
      }
    }, "fromSso");
    var fromStatic = /* @__PURE__ */ __name(({ token, logger }) => async () => {
      logger?.debug("@aws-sdk/token-providers - fromStatic");
      if (!token || !token.token) {
        throw new propertyProvider.TokenProviderError(`Please pass a valid token to fromStatic`, false);
      }
      return token;
    }, "fromStatic");
    var nodeProvider = /* @__PURE__ */ __name((init = {}) => propertyProvider.memoize(propertyProvider.chain(fromSso(init), async () => {
      throw new propertyProvider.TokenProviderError("Could not load token from any providers", false);
    }), (token) => token.expiration !== void 0 && token.expiration.getTime() - Date.now() < 3e5, (token) => token.expiration !== void 0), "nodeProvider");
    exports.fromEnvSigningName = fromEnvSigningName;
    exports.fromSso = fromSso;
    exports.fromStatic = fromStatic;
    exports.nodeProvider = nodeProvider;
  }
});

// node_modules/@aws-sdk/client-sso/dist-cjs/auth/httpAuthSchemeProvider.js
var require_httpAuthSchemeProvider = __commonJS({
  "node_modules/@aws-sdk/client-sso/dist-cjs/auth/httpAuthSchemeProvider.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.resolveHttpAuthSchemeConfig = exports.defaultSSOHttpAuthSchemeProvider = exports.defaultSSOHttpAuthSchemeParametersProvider = void 0;
    var core_1 = (init_dist_es2(), __toCommonJS(dist_es_exports2));
    var util_middleware_1 = require_dist_cjs2();
    var defaultSSOHttpAuthSchemeParametersProvider = /* @__PURE__ */ __name(async (config, context, input) => {
      return {
        operation: (0, util_middleware_1.getSmithyContext)(context).operation,
        region: await (0, util_middleware_1.normalizeProvider)(config.region)() || (() => {
          throw new Error("expected `region` to be configured for `aws.auth#sigv4`");
        })()
      };
    }, "defaultSSOHttpAuthSchemeParametersProvider");
    exports.defaultSSOHttpAuthSchemeParametersProvider = defaultSSOHttpAuthSchemeParametersProvider;
    function createAwsAuthSigv4HttpAuthOption(authParameters) {
      return {
        schemeId: "aws.auth#sigv4",
        signingProperties: {
          name: "awsssoportal",
          region: authParameters.region
        },
        propertiesExtractor: /* @__PURE__ */ __name((config, context) => ({
          signingProperties: {
            config,
            context
          }
        }), "propertiesExtractor")
      };
    }
    __name(createAwsAuthSigv4HttpAuthOption, "createAwsAuthSigv4HttpAuthOption");
    function createSmithyApiNoAuthHttpAuthOption(authParameters) {
      return {
        schemeId: "smithy.api#noAuth"
      };
    }
    __name(createSmithyApiNoAuthHttpAuthOption, "createSmithyApiNoAuthHttpAuthOption");
    var defaultSSOHttpAuthSchemeProvider = /* @__PURE__ */ __name((authParameters) => {
      const options = [];
      switch (authParameters.operation) {
        case "GetRoleCredentials":
          {
            options.push(createSmithyApiNoAuthHttpAuthOption(authParameters));
            break;
          }
          ;
        case "ListAccountRoles":
          {
            options.push(createSmithyApiNoAuthHttpAuthOption(authParameters));
            break;
          }
          ;
        case "ListAccounts":
          {
            options.push(createSmithyApiNoAuthHttpAuthOption(authParameters));
            break;
          }
          ;
        case "Logout":
          {
            options.push(createSmithyApiNoAuthHttpAuthOption(authParameters));
            break;
          }
          ;
        default: {
          options.push(createAwsAuthSigv4HttpAuthOption(authParameters));
        }
      }
      return options;
    }, "defaultSSOHttpAuthSchemeProvider");
    exports.defaultSSOHttpAuthSchemeProvider = defaultSSOHttpAuthSchemeProvider;
    var resolveHttpAuthSchemeConfig = /* @__PURE__ */ __name((config) => {
      const config_0 = (0, core_1.resolveAwsSdkSigV4Config)(config);
      return Object.assign(config_0, {
        authSchemePreference: (0, util_middleware_1.normalizeProvider)(config.authSchemePreference ?? [])
      });
    }, "resolveHttpAuthSchemeConfig");
    exports.resolveHttpAuthSchemeConfig = resolveHttpAuthSchemeConfig;
  }
});

// node_modules/@aws-sdk/client-sso/package.json
var require_package = __commonJS({
  "node_modules/@aws-sdk/client-sso/package.json"(exports, module) {
    module.exports = {
      name: "@aws-sdk/client-sso",
      description: "AWS SDK for JavaScript Sso Client for Node.js, Browser and React Native",
      version: "3.993.0",
      scripts: {
        build: "concurrently 'yarn:build:types' 'yarn:build:es' && yarn build:cjs",
        "build:cjs": "node ../../scripts/compilation/inline client-sso",
        "build:es": "tsc -p tsconfig.es.json",
        "build:include:deps": 'yarn g:turbo run build -F="$npm_package_name"',
        "build:types": "tsc -p tsconfig.types.json",
        "build:types:downlevel": "downlevel-dts dist-types dist-types/ts3.4",
        clean: "premove dist-cjs dist-es dist-types tsconfig.cjs.tsbuildinfo tsconfig.es.tsbuildinfo tsconfig.types.tsbuildinfo",
        "extract:docs": "api-extractor run --local",
        "generate:client": "node ../../scripts/generate-clients/single-service --solo sso",
        "test:index": "tsc --noEmit ./test/index-types.ts && node ./test/index-objects.spec.mjs"
      },
      main: "./dist-cjs/index.js",
      types: "./dist-types/index.d.ts",
      module: "./dist-es/index.js",
      sideEffects: false,
      dependencies: {
        "@aws-crypto/sha256-browser": "5.2.0",
        "@aws-crypto/sha256-js": "5.2.0",
        "@aws-sdk/core": "^3.973.11",
        "@aws-sdk/middleware-host-header": "^3.972.3",
        "@aws-sdk/middleware-logger": "^3.972.3",
        "@aws-sdk/middleware-recursion-detection": "^3.972.3",
        "@aws-sdk/middleware-user-agent": "^3.972.11",
        "@aws-sdk/region-config-resolver": "^3.972.3",
        "@aws-sdk/types": "^3.973.1",
        "@aws-sdk/util-endpoints": "3.993.0",
        "@aws-sdk/util-user-agent-browser": "^3.972.3",
        "@aws-sdk/util-user-agent-node": "^3.972.9",
        "@smithy/config-resolver": "^4.4.6",
        "@smithy/core": "^3.23.2",
        "@smithy/fetch-http-handler": "^5.3.9",
        "@smithy/hash-node": "^4.2.8",
        "@smithy/invalid-dependency": "^4.2.8",
        "@smithy/middleware-content-length": "^4.2.8",
        "@smithy/middleware-endpoint": "^4.4.16",
        "@smithy/middleware-retry": "^4.4.33",
        "@smithy/middleware-serde": "^4.2.9",
        "@smithy/middleware-stack": "^4.2.8",
        "@smithy/node-config-provider": "^4.3.8",
        "@smithy/node-http-handler": "^4.4.10",
        "@smithy/protocol-http": "^5.3.8",
        "@smithy/smithy-client": "^4.11.5",
        "@smithy/types": "^4.12.0",
        "@smithy/url-parser": "^4.2.8",
        "@smithy/util-base64": "^4.3.0",
        "@smithy/util-body-length-browser": "^4.2.0",
        "@smithy/util-body-length-node": "^4.2.1",
        "@smithy/util-defaults-mode-browser": "^4.3.32",
        "@smithy/util-defaults-mode-node": "^4.2.35",
        "@smithy/util-endpoints": "^3.2.8",
        "@smithy/util-middleware": "^4.2.8",
        "@smithy/util-retry": "^4.2.8",
        "@smithy/util-utf8": "^4.2.0",
        tslib: "^2.6.2"
      },
      devDependencies: {
        "@tsconfig/node20": "20.1.8",
        "@types/node": "^20.14.8",
        concurrently: "7.0.0",
        "downlevel-dts": "0.10.1",
        premove: "4.0.0",
        typescript: "~5.8.3"
      },
      engines: {
        node: ">=20.0.0"
      },
      typesVersions: {
        "<4.0": {
          "dist-types/*": [
            "dist-types/ts3.4/*"
          ]
        }
      },
      files: [
        "dist-*/**"
      ],
      author: {
        name: "AWS SDK for JavaScript Team",
        url: "https://aws.amazon.com/javascript/"
      },
      license: "Apache-2.0",
      browser: {
        "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.browser"
      },
      "react-native": {
        "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.native"
      },
      homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-sso",
      repository: {
        type: "git",
        url: "https://github.com/aws/aws-sdk-js-v3.git",
        directory: "clients/client-sso"
      }
    };
  }
});

// node_modules/@aws-sdk/client-sso/node_modules/@aws-sdk/util-endpoints/dist-cjs/index.js
var require_dist_cjs27 = __commonJS({
  "node_modules/@aws-sdk/client-sso/node_modules/@aws-sdk/util-endpoints/dist-cjs/index.js"(exports) {
    "use strict";
    init_esm();
    var utilEndpoints = require_dist_cjs11();
    var urlParser = require_dist_cjs12();
    var isVirtualHostableS3Bucket = /* @__PURE__ */ __name((value, allowSubDomains = false) => {
      if (allowSubDomains) {
        for (const label of value.split(".")) {
          if (!isVirtualHostableS3Bucket(label)) {
            return false;
          }
        }
        return true;
      }
      if (!utilEndpoints.isValidHostLabel(value)) {
        return false;
      }
      if (value.length < 3 || value.length > 63) {
        return false;
      }
      if (value !== value.toLowerCase()) {
        return false;
      }
      if (utilEndpoints.isIpAddress(value)) {
        return false;
      }
      return true;
    }, "isVirtualHostableS3Bucket");
    var ARN_DELIMITER = ":";
    var RESOURCE_DELIMITER = "/";
    var parseArn = /* @__PURE__ */ __name((value) => {
      const segments = value.split(ARN_DELIMITER);
      if (segments.length < 6)
        return null;
      const [arn, partition2, service, region, accountId, ...resourcePath] = segments;
      if (arn !== "arn" || partition2 === "" || service === "" || resourcePath.join(ARN_DELIMITER) === "")
        return null;
      const resourceId = resourcePath.map((resource) => resource.split(RESOURCE_DELIMITER)).flat();
      return {
        partition: partition2,
        service,
        region,
        accountId,
        resourceId
      };
    }, "parseArn");
    var partitions = [
      {
        id: "aws",
        outputs: {
          dnsSuffix: "amazonaws.com",
          dualStackDnsSuffix: "api.aws",
          implicitGlobalRegion: "us-east-1",
          name: "aws",
          supportsDualStack: true,
          supportsFIPS: true
        },
        regionRegex: "^(us|eu|ap|sa|ca|me|af|il|mx)\\-\\w+\\-\\d+$",
        regions: {
          "af-south-1": {
            description: "Africa (Cape Town)"
          },
          "ap-east-1": {
            description: "Asia Pacific (Hong Kong)"
          },
          "ap-east-2": {
            description: "Asia Pacific (Taipei)"
          },
          "ap-northeast-1": {
            description: "Asia Pacific (Tokyo)"
          },
          "ap-northeast-2": {
            description: "Asia Pacific (Seoul)"
          },
          "ap-northeast-3": {
            description: "Asia Pacific (Osaka)"
          },
          "ap-south-1": {
            description: "Asia Pacific (Mumbai)"
          },
          "ap-south-2": {
            description: "Asia Pacific (Hyderabad)"
          },
          "ap-southeast-1": {
            description: "Asia Pacific (Singapore)"
          },
          "ap-southeast-2": {
            description: "Asia Pacific (Sydney)"
          },
          "ap-southeast-3": {
            description: "Asia Pacific (Jakarta)"
          },
          "ap-southeast-4": {
            description: "Asia Pacific (Melbourne)"
          },
          "ap-southeast-5": {
            description: "Asia Pacific (Malaysia)"
          },
          "ap-southeast-6": {
            description: "Asia Pacific (New Zealand)"
          },
          "ap-southeast-7": {
            description: "Asia Pacific (Thailand)"
          },
          "aws-global": {
            description: "aws global region"
          },
          "ca-central-1": {
            description: "Canada (Central)"
          },
          "ca-west-1": {
            description: "Canada West (Calgary)"
          },
          "eu-central-1": {
            description: "Europe (Frankfurt)"
          },
          "eu-central-2": {
            description: "Europe (Zurich)"
          },
          "eu-north-1": {
            description: "Europe (Stockholm)"
          },
          "eu-south-1": {
            description: "Europe (Milan)"
          },
          "eu-south-2": {
            description: "Europe (Spain)"
          },
          "eu-west-1": {
            description: "Europe (Ireland)"
          },
          "eu-west-2": {
            description: "Europe (London)"
          },
          "eu-west-3": {
            description: "Europe (Paris)"
          },
          "il-central-1": {
            description: "Israel (Tel Aviv)"
          },
          "me-central-1": {
            description: "Middle East (UAE)"
          },
          "me-south-1": {
            description: "Middle East (Bahrain)"
          },
          "mx-central-1": {
            description: "Mexico (Central)"
          },
          "sa-east-1": {
            description: "South America (Sao Paulo)"
          },
          "us-east-1": {
            description: "US East (N. Virginia)"
          },
          "us-east-2": {
            description: "US East (Ohio)"
          },
          "us-west-1": {
            description: "US West (N. California)"
          },
          "us-west-2": {
            description: "US West (Oregon)"
          }
        }
      },
      {
        id: "aws-cn",
        outputs: {
          dnsSuffix: "amazonaws.com.cn",
          dualStackDnsSuffix: "api.amazonwebservices.com.cn",
          implicitGlobalRegion: "cn-northwest-1",
          name: "aws-cn",
          supportsDualStack: true,
          supportsFIPS: true
        },
        regionRegex: "^cn\\-\\w+\\-\\d+$",
        regions: {
          "aws-cn-global": {
            description: "aws-cn global region"
          },
          "cn-north-1": {
            description: "China (Beijing)"
          },
          "cn-northwest-1": {
            description: "China (Ningxia)"
          }
        }
      },
      {
        id: "aws-eusc",
        outputs: {
          dnsSuffix: "amazonaws.eu",
          dualStackDnsSuffix: "api.amazonwebservices.eu",
          implicitGlobalRegion: "eusc-de-east-1",
          name: "aws-eusc",
          supportsDualStack: true,
          supportsFIPS: true
        },
        regionRegex: "^eusc\\-(de)\\-\\w+\\-\\d+$",
        regions: {
          "eusc-de-east-1": {
            description: "AWS European Sovereign Cloud (Germany)"
          }
        }
      },
      {
        id: "aws-iso",
        outputs: {
          dnsSuffix: "c2s.ic.gov",
          dualStackDnsSuffix: "api.aws.ic.gov",
          implicitGlobalRegion: "us-iso-east-1",
          name: "aws-iso",
          supportsDualStack: true,
          supportsFIPS: true
        },
        regionRegex: "^us\\-iso\\-\\w+\\-\\d+$",
        regions: {
          "aws-iso-global": {
            description: "aws-iso global region"
          },
          "us-iso-east-1": {
            description: "US ISO East"
          },
          "us-iso-west-1": {
            description: "US ISO WEST"
          }
        }
      },
      {
        id: "aws-iso-b",
        outputs: {
          dnsSuffix: "sc2s.sgov.gov",
          dualStackDnsSuffix: "api.aws.scloud",
          implicitGlobalRegion: "us-isob-east-1",
          name: "aws-iso-b",
          supportsDualStack: true,
          supportsFIPS: true
        },
        regionRegex: "^us\\-isob\\-\\w+\\-\\d+$",
        regions: {
          "aws-iso-b-global": {
            description: "aws-iso-b global region"
          },
          "us-isob-east-1": {
            description: "US ISOB East (Ohio)"
          },
          "us-isob-west-1": {
            description: "US ISOB West"
          }
        }
      },
      {
        id: "aws-iso-e",
        outputs: {
          dnsSuffix: "cloud.adc-e.uk",
          dualStackDnsSuffix: "api.cloud-aws.adc-e.uk",
          implicitGlobalRegion: "eu-isoe-west-1",
          name: "aws-iso-e",
          supportsDualStack: true,
          supportsFIPS: true
        },
        regionRegex: "^eu\\-isoe\\-\\w+\\-\\d+$",
        regions: {
          "aws-iso-e-global": {
            description: "aws-iso-e global region"
          },
          "eu-isoe-west-1": {
            description: "EU ISOE West"
          }
        }
      },
      {
        id: "aws-iso-f",
        outputs: {
          dnsSuffix: "csp.hci.ic.gov",
          dualStackDnsSuffix: "api.aws.hci.ic.gov",
          implicitGlobalRegion: "us-isof-south-1",
          name: "aws-iso-f",
          supportsDualStack: true,
          supportsFIPS: true
        },
        regionRegex: "^us\\-isof\\-\\w+\\-\\d+$",
        regions: {
          "aws-iso-f-global": {
            description: "aws-iso-f global region"
          },
          "us-isof-east-1": {
            description: "US ISOF EAST"
          },
          "us-isof-south-1": {
            description: "US ISOF SOUTH"
          }
        }
      },
      {
        id: "aws-us-gov",
        outputs: {
          dnsSuffix: "amazonaws.com",
          dualStackDnsSuffix: "api.aws",
          implicitGlobalRegion: "us-gov-west-1",
          name: "aws-us-gov",
          supportsDualStack: true,
          supportsFIPS: true
        },
        regionRegex: "^us\\-gov\\-\\w+\\-\\d+$",
        regions: {
          "aws-us-gov-global": {
            description: "aws-us-gov global region"
          },
          "us-gov-east-1": {
            description: "AWS GovCloud (US-East)"
          },
          "us-gov-west-1": {
            description: "AWS GovCloud (US-West)"
          }
        }
      }
    ];
    var version = "1.1";
    var partitionsInfo = {
      partitions,
      version
    };
    var selectedPartitionsInfo = partitionsInfo;
    var selectedUserAgentPrefix = "";
    var partition = /* @__PURE__ */ __name((value) => {
      const { partitions: partitions2 } = selectedPartitionsInfo;
      for (const partition2 of partitions2) {
        const { regions, outputs } = partition2;
        for (const [region, regionData] of Object.entries(regions)) {
          if (region === value) {
            return {
              ...outputs,
              ...regionData
            };
          }
        }
      }
      for (const partition2 of partitions2) {
        const { regionRegex, outputs } = partition2;
        if (new RegExp(regionRegex).test(value)) {
          return {
            ...outputs
          };
        }
      }
      const DEFAULT_PARTITION = partitions2.find((partition2) => partition2.id === "aws");
      if (!DEFAULT_PARTITION) {
        throw new Error("Provided region was not found in the partition array or regex, and default partition with id 'aws' doesn't exist.");
      }
      return {
        ...DEFAULT_PARTITION.outputs
      };
    }, "partition");
    var setPartitionInfo = /* @__PURE__ */ __name((partitionsInfo2, userAgentPrefix = "") => {
      selectedPartitionsInfo = partitionsInfo2;
      selectedUserAgentPrefix = userAgentPrefix;
    }, "setPartitionInfo");
    var useDefaultPartitionInfo = /* @__PURE__ */ __name(() => {
      setPartitionInfo(partitionsInfo, "");
    }, "useDefaultPartitionInfo");
    var getUserAgentPrefix = /* @__PURE__ */ __name(() => selectedUserAgentPrefix, "getUserAgentPrefix");
    var awsEndpointFunctions = {
      isVirtualHostableS3Bucket,
      parseArn,
      partition
    };
    utilEndpoints.customEndpointFunctions.aws = awsEndpointFunctions;
    var resolveDefaultAwsRegionalEndpointsConfig = /* @__PURE__ */ __name((input) => {
      if (typeof input.endpointProvider !== "function") {
        throw new Error("@aws-sdk/util-endpoint - endpointProvider and endpoint missing in config for this client.");
      }
      const { endpoint } = input;
      if (endpoint === void 0) {
        input.endpoint = async () => {
          return toEndpointV1(input.endpointProvider({
            Region: typeof input.region === "function" ? await input.region() : input.region,
            UseDualStack: typeof input.useDualstackEndpoint === "function" ? await input.useDualstackEndpoint() : input.useDualstackEndpoint,
            UseFIPS: typeof input.useFipsEndpoint === "function" ? await input.useFipsEndpoint() : input.useFipsEndpoint,
            Endpoint: void 0
          }, { logger: input.logger }));
        };
      }
      return input;
    }, "resolveDefaultAwsRegionalEndpointsConfig");
    var toEndpointV1 = /* @__PURE__ */ __name((endpoint) => urlParser.parseUrl(endpoint.url), "toEndpointV1");
    Object.defineProperty(exports, "EndpointError", {
      enumerable: true,
      get: /* @__PURE__ */ __name(function() {
        return utilEndpoints.EndpointError;
      }, "get")
    });
    Object.defineProperty(exports, "isIpAddress", {
      enumerable: true,
      get: /* @__PURE__ */ __name(function() {
        return utilEndpoints.isIpAddress;
      }, "get")
    });
    Object.defineProperty(exports, "resolveEndpoint", {
      enumerable: true,
      get: /* @__PURE__ */ __name(function() {
        return utilEndpoints.resolveEndpoint;
      }, "get")
    });
    exports.awsEndpointFunctions = awsEndpointFunctions;
    exports.getUserAgentPrefix = getUserAgentPrefix;
    exports.partition = partition;
    exports.resolveDefaultAwsRegionalEndpointsConfig = resolveDefaultAwsRegionalEndpointsConfig;
    exports.setPartitionInfo = setPartitionInfo;
    exports.toEndpointV1 = toEndpointV1;
    exports.useDefaultPartitionInfo = useDefaultPartitionInfo;
  }
});

// node_modules/@aws-sdk/client-sso/dist-cjs/endpoint/ruleset.js
var require_ruleset = __commonJS({
  "node_modules/@aws-sdk/client-sso/dist-cjs/endpoint/ruleset.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ruleSet = void 0;
    var u = "required";
    var v = "fn";
    var w = "argv";
    var x = "ref";
    var a = true;
    var b = "isSet";
    var c = "booleanEquals";
    var d = "error";
    var e = "endpoint";
    var f = "tree";
    var g = "PartitionResult";
    var h = "getAttr";
    var i = { [u]: false, "type": "string" };
    var j = { [u]: true, "default": false, "type": "boolean" };
    var k = { [x]: "Endpoint" };
    var l = { [v]: c, [w]: [{ [x]: "UseFIPS" }, true] };
    var m = { [v]: c, [w]: [{ [x]: "UseDualStack" }, true] };
    var n = {};
    var o = { [v]: h, [w]: [{ [x]: g }, "supportsFIPS"] };
    var p = { [x]: g };
    var q = { [v]: c, [w]: [true, { [v]: h, [w]: [p, "supportsDualStack"] }] };
    var r = [l];
    var s = [m];
    var t = [{ [x]: "Region" }];
    var _data = { version: "1.0", parameters: { Region: i, UseDualStack: j, UseFIPS: j, Endpoint: i }, rules: [{ conditions: [{ [v]: b, [w]: [k] }], rules: [{ conditions: r, error: "Invalid Configuration: FIPS and custom endpoint are not supported", type: d }, { conditions: s, error: "Invalid Configuration: Dualstack and custom endpoint are not supported", type: d }, { endpoint: { url: k, properties: n, headers: n }, type: e }], type: f }, { conditions: [{ [v]: b, [w]: t }], rules: [{ conditions: [{ [v]: "aws.partition", [w]: t, assign: g }], rules: [{ conditions: [l, m], rules: [{ conditions: [{ [v]: c, [w]: [a, o] }, q], rules: [{ endpoint: { url: "https://portal.sso-fips.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: n, headers: n }, type: e }], type: f }, { error: "FIPS and DualStack are enabled, but this partition does not support one or both", type: d }], type: f }, { conditions: r, rules: [{ conditions: [{ [v]: c, [w]: [o, a] }], rules: [{ conditions: [{ [v]: "stringEquals", [w]: [{ [v]: h, [w]: [p, "name"] }, "aws-us-gov"] }], endpoint: { url: "https://portal.sso.{Region}.amazonaws.com", properties: n, headers: n }, type: e }, { endpoint: { url: "https://portal.sso-fips.{Region}.{PartitionResult#dnsSuffix}", properties: n, headers: n }, type: e }], type: f }, { error: "FIPS is enabled but this partition does not support FIPS", type: d }], type: f }, { conditions: s, rules: [{ conditions: [q], rules: [{ endpoint: { url: "https://portal.sso.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: n, headers: n }, type: e }], type: f }, { error: "DualStack is enabled but this partition does not support DualStack", type: d }], type: f }, { endpoint: { url: "https://portal.sso.{Region}.{PartitionResult#dnsSuffix}", properties: n, headers: n }, type: e }], type: f }], type: f }, { error: "Invalid Configuration: Missing Region", type: d }] };
    exports.ruleSet = _data;
  }
});

// node_modules/@aws-sdk/client-sso/dist-cjs/endpoint/endpointResolver.js
var require_endpointResolver = __commonJS({
  "node_modules/@aws-sdk/client-sso/dist-cjs/endpoint/endpointResolver.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.defaultEndpointResolver = void 0;
    var util_endpoints_1 = require_dist_cjs27();
    var util_endpoints_2 = require_dist_cjs11();
    var ruleset_1 = require_ruleset();
    var cache = new util_endpoints_2.EndpointCache({
      size: 50,
      params: ["Endpoint", "Region", "UseDualStack", "UseFIPS"]
    });
    var defaultEndpointResolver = /* @__PURE__ */ __name((endpointParams, context = {}) => {
      return cache.get(endpointParams, () => (0, util_endpoints_2.resolveEndpoint)(ruleset_1.ruleSet, {
        endpointParams,
        logger: context.logger
      }));
    }, "defaultEndpointResolver");
    exports.defaultEndpointResolver = defaultEndpointResolver;
    util_endpoints_2.customEndpointFunctions.aws = util_endpoints_1.awsEndpointFunctions;
  }
});

// node_modules/@aws-sdk/client-sso/dist-cjs/models/SSOServiceException.js
var require_SSOServiceException = __commonJS({
  "node_modules/@aws-sdk/client-sso/dist-cjs/models/SSOServiceException.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SSOServiceException = exports.__ServiceException = void 0;
    var smithy_client_1 = require_dist_cjs7();
    Object.defineProperty(exports, "__ServiceException", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return smithy_client_1.ServiceException;
    }, "get") });
    var SSOServiceException = class _SSOServiceException extends smithy_client_1.ServiceException {
      static {
        __name(this, "SSOServiceException");
      }
      constructor(options) {
        super(options);
        Object.setPrototypeOf(this, _SSOServiceException.prototype);
      }
    };
    exports.SSOServiceException = SSOServiceException;
  }
});

// node_modules/@aws-sdk/client-sso/dist-cjs/models/errors.js
var require_errors = __commonJS({
  "node_modules/@aws-sdk/client-sso/dist-cjs/models/errors.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UnauthorizedException = exports.TooManyRequestsException = exports.ResourceNotFoundException = exports.InvalidRequestException = void 0;
    var SSOServiceException_1 = require_SSOServiceException();
    var InvalidRequestException = class _InvalidRequestException extends SSOServiceException_1.SSOServiceException {
      static {
        __name(this, "InvalidRequestException");
      }
      name = "InvalidRequestException";
      $fault = "client";
      constructor(opts) {
        super({
          name: "InvalidRequestException",
          $fault: "client",
          ...opts
        });
        Object.setPrototypeOf(this, _InvalidRequestException.prototype);
      }
    };
    exports.InvalidRequestException = InvalidRequestException;
    var ResourceNotFoundException = class _ResourceNotFoundException extends SSOServiceException_1.SSOServiceException {
      static {
        __name(this, "ResourceNotFoundException");
      }
      name = "ResourceNotFoundException";
      $fault = "client";
      constructor(opts) {
        super({
          name: "ResourceNotFoundException",
          $fault: "client",
          ...opts
        });
        Object.setPrototypeOf(this, _ResourceNotFoundException.prototype);
      }
    };
    exports.ResourceNotFoundException = ResourceNotFoundException;
    var TooManyRequestsException = class _TooManyRequestsException extends SSOServiceException_1.SSOServiceException {
      static {
        __name(this, "TooManyRequestsException");
      }
      name = "TooManyRequestsException";
      $fault = "client";
      constructor(opts) {
        super({
          name: "TooManyRequestsException",
          $fault: "client",
          ...opts
        });
        Object.setPrototypeOf(this, _TooManyRequestsException.prototype);
      }
    };
    exports.TooManyRequestsException = TooManyRequestsException;
    var UnauthorizedException = class _UnauthorizedException extends SSOServiceException_1.SSOServiceException {
      static {
        __name(this, "UnauthorizedException");
      }
      name = "UnauthorizedException";
      $fault = "client";
      constructor(opts) {
        super({
          name: "UnauthorizedException",
          $fault: "client",
          ...opts
        });
        Object.setPrototypeOf(this, _UnauthorizedException.prototype);
      }
    };
    exports.UnauthorizedException = UnauthorizedException;
  }
});

// node_modules/@aws-sdk/client-sso/dist-cjs/schemas/schemas_0.js
var require_schemas_0 = __commonJS({
  "node_modules/@aws-sdk/client-sso/dist-cjs/schemas/schemas_0.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Logout$ = exports.ListAccounts$ = exports.ListAccountRoles$ = exports.GetRoleCredentials$ = exports.RoleInfo$ = exports.RoleCredentials$ = exports.LogoutRequest$ = exports.ListAccountsResponse$ = exports.ListAccountsRequest$ = exports.ListAccountRolesResponse$ = exports.ListAccountRolesRequest$ = exports.GetRoleCredentialsResponse$ = exports.GetRoleCredentialsRequest$ = exports.AccountInfo$ = exports.errorTypeRegistries = exports.UnauthorizedException$ = exports.TooManyRequestsException$ = exports.ResourceNotFoundException$ = exports.InvalidRequestException$ = exports.SSOServiceException$ = void 0;
    var _AI = "AccountInfo";
    var _ALT = "AccountListType";
    var _ATT = "AccessTokenType";
    var _GRC = "GetRoleCredentials";
    var _GRCR = "GetRoleCredentialsRequest";
    var _GRCRe = "GetRoleCredentialsResponse";
    var _IRE = "InvalidRequestException";
    var _L = "Logout";
    var _LA = "ListAccounts";
    var _LAR = "ListAccountsRequest";
    var _LARR = "ListAccountRolesRequest";
    var _LARRi = "ListAccountRolesResponse";
    var _LARi = "ListAccountsResponse";
    var _LARis = "ListAccountRoles";
    var _LR = "LogoutRequest";
    var _RC = "RoleCredentials";
    var _RI = "RoleInfo";
    var _RLT = "RoleListType";
    var _RNFE = "ResourceNotFoundException";
    var _SAKT = "SecretAccessKeyType";
    var _STT = "SessionTokenType";
    var _TMRE = "TooManyRequestsException";
    var _UE = "UnauthorizedException";
    var _aI = "accountId";
    var _aKI = "accessKeyId";
    var _aL = "accountList";
    var _aN = "accountName";
    var _aT = "accessToken";
    var _ai = "account_id";
    var _c = "client";
    var _e = "error";
    var _eA = "emailAddress";
    var _ex = "expiration";
    var _h = "http";
    var _hE = "httpError";
    var _hH = "httpHeader";
    var _hQ = "httpQuery";
    var _m = "message";
    var _mR = "maxResults";
    var _mr = "max_result";
    var _nT = "nextToken";
    var _nt = "next_token";
    var _rC = "roleCredentials";
    var _rL = "roleList";
    var _rN = "roleName";
    var _rn = "role_name";
    var _s = "smithy.ts.sdk.synthetic.com.amazonaws.sso";
    var _sAK = "secretAccessKey";
    var _sT = "sessionToken";
    var _xasbt = "x-amz-sso_bearer_token";
    var n0 = "com.amazonaws.sso";
    var schema_1 = (init_schema(), __toCommonJS(schema_exports));
    var errors_1 = require_errors();
    var SSOServiceException_1 = require_SSOServiceException();
    var _s_registry = schema_1.TypeRegistry.for(_s);
    exports.SSOServiceException$ = [-3, _s, "SSOServiceException", 0, [], []];
    _s_registry.registerError(exports.SSOServiceException$, SSOServiceException_1.SSOServiceException);
    var n0_registry = schema_1.TypeRegistry.for(n0);
    exports.InvalidRequestException$ = [
      -3,
      n0,
      _IRE,
      { [_e]: _c, [_hE]: 400 },
      [_m],
      [0]
    ];
    n0_registry.registerError(exports.InvalidRequestException$, errors_1.InvalidRequestException);
    exports.ResourceNotFoundException$ = [
      -3,
      n0,
      _RNFE,
      { [_e]: _c, [_hE]: 404 },
      [_m],
      [0]
    ];
    n0_registry.registerError(exports.ResourceNotFoundException$, errors_1.ResourceNotFoundException);
    exports.TooManyRequestsException$ = [
      -3,
      n0,
      _TMRE,
      { [_e]: _c, [_hE]: 429 },
      [_m],
      [0]
    ];
    n0_registry.registerError(exports.TooManyRequestsException$, errors_1.TooManyRequestsException);
    exports.UnauthorizedException$ = [
      -3,
      n0,
      _UE,
      { [_e]: _c, [_hE]: 401 },
      [_m],
      [0]
    ];
    n0_registry.registerError(exports.UnauthorizedException$, errors_1.UnauthorizedException);
    exports.errorTypeRegistries = [
      _s_registry,
      n0_registry
    ];
    var AccessTokenType = [0, n0, _ATT, 8, 0];
    var SecretAccessKeyType = [0, n0, _SAKT, 8, 0];
    var SessionTokenType = [0, n0, _STT, 8, 0];
    exports.AccountInfo$ = [
      3,
      n0,
      _AI,
      0,
      [_aI, _aN, _eA],
      [0, 0, 0]
    ];
    exports.GetRoleCredentialsRequest$ = [
      3,
      n0,
      _GRCR,
      0,
      [_rN, _aI, _aT],
      [[0, { [_hQ]: _rn }], [0, { [_hQ]: _ai }], [() => AccessTokenType, { [_hH]: _xasbt }]],
      3
    ];
    exports.GetRoleCredentialsResponse$ = [
      3,
      n0,
      _GRCRe,
      0,
      [_rC],
      [[() => exports.RoleCredentials$, 0]]
    ];
    exports.ListAccountRolesRequest$ = [
      3,
      n0,
      _LARR,
      0,
      [_aT, _aI, _nT, _mR],
      [[() => AccessTokenType, { [_hH]: _xasbt }], [0, { [_hQ]: _ai }], [0, { [_hQ]: _nt }], [1, { [_hQ]: _mr }]],
      2
    ];
    exports.ListAccountRolesResponse$ = [
      3,
      n0,
      _LARRi,
      0,
      [_nT, _rL],
      [0, () => RoleListType]
    ];
    exports.ListAccountsRequest$ = [
      3,
      n0,
      _LAR,
      0,
      [_aT, _nT, _mR],
      [[() => AccessTokenType, { [_hH]: _xasbt }], [0, { [_hQ]: _nt }], [1, { [_hQ]: _mr }]],
      1
    ];
    exports.ListAccountsResponse$ = [
      3,
      n0,
      _LARi,
      0,
      [_nT, _aL],
      [0, () => AccountListType]
    ];
    exports.LogoutRequest$ = [
      3,
      n0,
      _LR,
      0,
      [_aT],
      [[() => AccessTokenType, { [_hH]: _xasbt }]],
      1
    ];
    exports.RoleCredentials$ = [
      3,
      n0,
      _RC,
      0,
      [_aKI, _sAK, _sT, _ex],
      [0, [() => SecretAccessKeyType, 0], [() => SessionTokenType, 0], 1]
    ];
    exports.RoleInfo$ = [
      3,
      n0,
      _RI,
      0,
      [_rN, _aI],
      [0, 0]
    ];
    var __Unit = "unit";
    var AccountListType = [
      1,
      n0,
      _ALT,
      0,
      () => exports.AccountInfo$
    ];
    var RoleListType = [
      1,
      n0,
      _RLT,
      0,
      () => exports.RoleInfo$
    ];
    exports.GetRoleCredentials$ = [
      9,
      n0,
      _GRC,
      { [_h]: ["GET", "/federation/credentials", 200] },
      () => exports.GetRoleCredentialsRequest$,
      () => exports.GetRoleCredentialsResponse$
    ];
    exports.ListAccountRoles$ = [
      9,
      n0,
      _LARis,
      { [_h]: ["GET", "/assignment/roles", 200] },
      () => exports.ListAccountRolesRequest$,
      () => exports.ListAccountRolesResponse$
    ];
    exports.ListAccounts$ = [
      9,
      n0,
      _LA,
      { [_h]: ["GET", "/assignment/accounts", 200] },
      () => exports.ListAccountsRequest$,
      () => exports.ListAccountsResponse$
    ];
    exports.Logout$ = [
      9,
      n0,
      _L,
      { [_h]: ["POST", "/logout", 200] },
      () => exports.LogoutRequest$,
      () => __Unit
    ];
  }
});

// node_modules/@aws-sdk/client-sso/dist-cjs/runtimeConfig.shared.js
var require_runtimeConfig_shared = __commonJS({
  "node_modules/@aws-sdk/client-sso/dist-cjs/runtimeConfig.shared.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getRuntimeConfig = void 0;
    var core_1 = (init_dist_es2(), __toCommonJS(dist_es_exports2));
    var protocols_1 = (init_protocols(), __toCommonJS(protocols_exports));
    var core_2 = (init_dist_es(), __toCommonJS(dist_es_exports));
    var smithy_client_1 = require_dist_cjs7();
    var url_parser_1 = require_dist_cjs12();
    var util_base64_1 = require_dist_cjs4();
    var util_utf8_1 = require_dist_cjs3();
    var httpAuthSchemeProvider_1 = require_httpAuthSchemeProvider();
    var endpointResolver_1 = require_endpointResolver();
    var schemas_0_1 = require_schemas_0();
    var getRuntimeConfig = /* @__PURE__ */ __name((config) => {
      return {
        apiVersion: "2019-06-10",
        base64Decoder: config?.base64Decoder ?? util_base64_1.fromBase64,
        base64Encoder: config?.base64Encoder ?? util_base64_1.toBase64,
        disableHostPrefix: config?.disableHostPrefix ?? false,
        endpointProvider: config?.endpointProvider ?? endpointResolver_1.defaultEndpointResolver,
        extensions: config?.extensions ?? [],
        httpAuthSchemeProvider: config?.httpAuthSchemeProvider ?? httpAuthSchemeProvider_1.defaultSSOHttpAuthSchemeProvider,
        httpAuthSchemes: config?.httpAuthSchemes ?? [
          {
            schemeId: "aws.auth#sigv4",
            identityProvider: /* @__PURE__ */ __name((ipc) => ipc.getIdentityProvider("aws.auth#sigv4"), "identityProvider"),
            signer: new core_1.AwsSdkSigV4Signer()
          },
          {
            schemeId: "smithy.api#noAuth",
            identityProvider: /* @__PURE__ */ __name((ipc) => ipc.getIdentityProvider("smithy.api#noAuth") || (async () => ({})), "identityProvider"),
            signer: new core_2.NoAuthSigner()
          }
        ],
        logger: config?.logger ?? new smithy_client_1.NoOpLogger(),
        protocol: config?.protocol ?? protocols_1.AwsRestJsonProtocol,
        protocolSettings: config?.protocolSettings ?? {
          defaultNamespace: "com.amazonaws.sso",
          errorTypeRegistries: schemas_0_1.errorTypeRegistries,
          version: "2019-06-10",
          serviceTarget: "SWBPortalService"
        },
        serviceId: config?.serviceId ?? "SSO",
        urlParser: config?.urlParser ?? url_parser_1.parseUrl,
        utf8Decoder: config?.utf8Decoder ?? util_utf8_1.fromUtf8,
        utf8Encoder: config?.utf8Encoder ?? util_utf8_1.toUtf8
      };
    }, "getRuntimeConfig");
    exports.getRuntimeConfig = getRuntimeConfig;
  }
});

// node_modules/@aws-sdk/client-sso/dist-cjs/runtimeConfig.js
var require_runtimeConfig = __commonJS({
  "node_modules/@aws-sdk/client-sso/dist-cjs/runtimeConfig.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getRuntimeConfig = void 0;
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    var package_json_1 = tslib_1.__importDefault(require_package());
    var core_1 = (init_dist_es2(), __toCommonJS(dist_es_exports2));
    var util_user_agent_node_1 = require_dist_cjs21();
    var config_resolver_1 = require_dist_cjs14();
    var hash_node_1 = require_dist_cjs22();
    var middleware_retry_1 = require_dist_cjs20();
    var node_config_provider_1 = require_dist_cjs17();
    var node_http_handler_1 = require_dist_cjs5();
    var smithy_client_1 = require_dist_cjs7();
    var util_body_length_node_1 = require_dist_cjs23();
    var util_defaults_mode_node_1 = require_dist_cjs24();
    var util_retry_1 = require_dist_cjs19();
    var runtimeConfig_shared_1 = require_runtimeConfig_shared();
    var getRuntimeConfig = /* @__PURE__ */ __name((config) => {
      (0, smithy_client_1.emitWarningIfUnsupportedVersion)(process.version);
      const defaultsMode = (0, util_defaults_mode_node_1.resolveDefaultsModeConfig)(config);
      const defaultConfigProvider = /* @__PURE__ */ __name(() => defaultsMode().then(smithy_client_1.loadConfigsForDefaultMode), "defaultConfigProvider");
      const clientSharedValues = (0, runtimeConfig_shared_1.getRuntimeConfig)(config);
      (0, core_1.emitWarningIfUnsupportedVersion)(process.version);
      const loaderConfig = {
        profile: config?.profile,
        logger: clientSharedValues.logger
      };
      return {
        ...clientSharedValues,
        ...config,
        runtime: "node",
        defaultsMode,
        authSchemePreference: config?.authSchemePreference ?? (0, node_config_provider_1.loadConfig)(core_1.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, loaderConfig),
        bodyLengthChecker: config?.bodyLengthChecker ?? util_body_length_node_1.calculateBodyLength,
        defaultUserAgentProvider: config?.defaultUserAgentProvider ?? (0, util_user_agent_node_1.createDefaultUserAgentProvider)({ serviceId: clientSharedValues.serviceId, clientVersion: package_json_1.default.version }),
        maxAttempts: config?.maxAttempts ?? (0, node_config_provider_1.loadConfig)(middleware_retry_1.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, config),
        region: config?.region ?? (0, node_config_provider_1.loadConfig)(config_resolver_1.NODE_REGION_CONFIG_OPTIONS, { ...config_resolver_1.NODE_REGION_CONFIG_FILE_OPTIONS, ...loaderConfig }),
        requestHandler: node_http_handler_1.NodeHttpHandler.create(config?.requestHandler ?? defaultConfigProvider),
        retryMode: config?.retryMode ?? (0, node_config_provider_1.loadConfig)({
          ...middleware_retry_1.NODE_RETRY_MODE_CONFIG_OPTIONS,
          default: /* @__PURE__ */ __name(async () => (await defaultConfigProvider()).retryMode || util_retry_1.DEFAULT_RETRY_MODE, "default")
        }, config),
        sha256: config?.sha256 ?? hash_node_1.Hash.bind(null, "sha256"),
        streamCollector: config?.streamCollector ?? node_http_handler_1.streamCollector,
        useDualstackEndpoint: config?.useDualstackEndpoint ?? (0, node_config_provider_1.loadConfig)(config_resolver_1.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, loaderConfig),
        useFipsEndpoint: config?.useFipsEndpoint ?? (0, node_config_provider_1.loadConfig)(config_resolver_1.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, loaderConfig),
        userAgentAppId: config?.userAgentAppId ?? (0, node_config_provider_1.loadConfig)(util_user_agent_node_1.NODE_APP_ID_CONFIG_OPTIONS, loaderConfig)
      };
    }, "getRuntimeConfig");
    exports.getRuntimeConfig = getRuntimeConfig;
  }
});

// node_modules/@aws-sdk/client-sso/dist-cjs/index.js
var require_dist_cjs28 = __commonJS({
  "node_modules/@aws-sdk/client-sso/dist-cjs/index.js"(exports) {
    "use strict";
    init_esm();
    var middlewareHostHeader = require_dist_cjs8();
    var middlewareLogger = require_dist_cjs9();
    var middlewareRecursionDetection = require_dist_cjs10();
    var middlewareUserAgent = require_dist_cjs13();
    var configResolver = require_dist_cjs14();
    var core = (init_dist_es(), __toCommonJS(dist_es_exports));
    var schema = (init_schema(), __toCommonJS(schema_exports));
    var middlewareContentLength = require_dist_cjs15();
    var middlewareEndpoint = require_dist_cjs18();
    var middlewareRetry = require_dist_cjs20();
    var smithyClient = require_dist_cjs7();
    var httpAuthSchemeProvider = require_httpAuthSchemeProvider();
    var runtimeConfig = require_runtimeConfig();
    var regionConfigResolver = require_dist_cjs25();
    var protocolHttp = require_dist_cjs();
    var schemas_0 = require_schemas_0();
    var errors = require_errors();
    var SSOServiceException = require_SSOServiceException();
    var resolveClientEndpointParameters = /* @__PURE__ */ __name((options) => {
      return Object.assign(options, {
        useDualstackEndpoint: options.useDualstackEndpoint ?? false,
        useFipsEndpoint: options.useFipsEndpoint ?? false,
        defaultSigningName: "awsssoportal"
      });
    }, "resolveClientEndpointParameters");
    var commonParams = {
      UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
      Endpoint: { type: "builtInParams", name: "endpoint" },
      Region: { type: "builtInParams", name: "region" },
      UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" }
    };
    var getHttpAuthExtensionConfiguration = /* @__PURE__ */ __name((runtimeConfig2) => {
      const _httpAuthSchemes = runtimeConfig2.httpAuthSchemes;
      let _httpAuthSchemeProvider = runtimeConfig2.httpAuthSchemeProvider;
      let _credentials = runtimeConfig2.credentials;
      return {
        setHttpAuthScheme(httpAuthScheme) {
          const index = _httpAuthSchemes.findIndex((scheme) => scheme.schemeId === httpAuthScheme.schemeId);
          if (index === -1) {
            _httpAuthSchemes.push(httpAuthScheme);
          } else {
            _httpAuthSchemes.splice(index, 1, httpAuthScheme);
          }
        },
        httpAuthSchemes() {
          return _httpAuthSchemes;
        },
        setHttpAuthSchemeProvider(httpAuthSchemeProvider2) {
          _httpAuthSchemeProvider = httpAuthSchemeProvider2;
        },
        httpAuthSchemeProvider() {
          return _httpAuthSchemeProvider;
        },
        setCredentials(credentials) {
          _credentials = credentials;
        },
        credentials() {
          return _credentials;
        }
      };
    }, "getHttpAuthExtensionConfiguration");
    var resolveHttpAuthRuntimeConfig = /* @__PURE__ */ __name((config) => {
      return {
        httpAuthSchemes: config.httpAuthSchemes(),
        httpAuthSchemeProvider: config.httpAuthSchemeProvider(),
        credentials: config.credentials()
      };
    }, "resolveHttpAuthRuntimeConfig");
    var resolveRuntimeExtensions = /* @__PURE__ */ __name((runtimeConfig2, extensions) => {
      const extensionConfiguration = Object.assign(regionConfigResolver.getAwsRegionExtensionConfiguration(runtimeConfig2), smithyClient.getDefaultExtensionConfiguration(runtimeConfig2), protocolHttp.getHttpHandlerExtensionConfiguration(runtimeConfig2), getHttpAuthExtensionConfiguration(runtimeConfig2));
      extensions.forEach((extension) => extension.configure(extensionConfiguration));
      return Object.assign(runtimeConfig2, regionConfigResolver.resolveAwsRegionExtensionConfiguration(extensionConfiguration), smithyClient.resolveDefaultRuntimeConfig(extensionConfiguration), protocolHttp.resolveHttpHandlerRuntimeConfig(extensionConfiguration), resolveHttpAuthRuntimeConfig(extensionConfiguration));
    }, "resolveRuntimeExtensions");
    var SSOClient = class extends smithyClient.Client {
      static {
        __name(this, "SSOClient");
      }
      config;
      constructor(...[configuration]) {
        const _config_0 = runtimeConfig.getRuntimeConfig(configuration || {});
        super(_config_0);
        this.initConfig = _config_0;
        const _config_1 = resolveClientEndpointParameters(_config_0);
        const _config_2 = middlewareUserAgent.resolveUserAgentConfig(_config_1);
        const _config_3 = middlewareRetry.resolveRetryConfig(_config_2);
        const _config_4 = configResolver.resolveRegionConfig(_config_3);
        const _config_5 = middlewareHostHeader.resolveHostHeaderConfig(_config_4);
        const _config_6 = middlewareEndpoint.resolveEndpointConfig(_config_5);
        const _config_7 = httpAuthSchemeProvider.resolveHttpAuthSchemeConfig(_config_6);
        const _config_8 = resolveRuntimeExtensions(_config_7, configuration?.extensions || []);
        this.config = _config_8;
        this.middlewareStack.use(schema.getSchemaSerdePlugin(this.config));
        this.middlewareStack.use(middlewareUserAgent.getUserAgentPlugin(this.config));
        this.middlewareStack.use(middlewareRetry.getRetryPlugin(this.config));
        this.middlewareStack.use(middlewareContentLength.getContentLengthPlugin(this.config));
        this.middlewareStack.use(middlewareHostHeader.getHostHeaderPlugin(this.config));
        this.middlewareStack.use(middlewareLogger.getLoggerPlugin(this.config));
        this.middlewareStack.use(middlewareRecursionDetection.getRecursionDetectionPlugin(this.config));
        this.middlewareStack.use(core.getHttpAuthSchemeEndpointRuleSetPlugin(this.config, {
          httpAuthSchemeParametersProvider: httpAuthSchemeProvider.defaultSSOHttpAuthSchemeParametersProvider,
          identityProviderConfigProvider: /* @__PURE__ */ __name(async (config) => new core.DefaultIdentityProviderConfig({
            "aws.auth#sigv4": config.credentials
          }), "identityProviderConfigProvider")
        }));
        this.middlewareStack.use(core.getHttpSigningPlugin(this.config));
      }
      destroy() {
        super.destroy();
      }
    };
    var GetRoleCredentialsCommand = class extends smithyClient.Command.classBuilder().ep(commonParams).m(function(Command, cs, config, o) {
      return [middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions())];
    }).s("SWBPortalService", "GetRoleCredentials", {}).n("SSOClient", "GetRoleCredentialsCommand").sc(schemas_0.GetRoleCredentials$).build() {
      static {
        __name(this, "GetRoleCredentialsCommand");
      }
    };
    var ListAccountRolesCommand = class extends smithyClient.Command.classBuilder().ep(commonParams).m(function(Command, cs, config, o) {
      return [middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions())];
    }).s("SWBPortalService", "ListAccountRoles", {}).n("SSOClient", "ListAccountRolesCommand").sc(schemas_0.ListAccountRoles$).build() {
      static {
        __name(this, "ListAccountRolesCommand");
      }
    };
    var ListAccountsCommand = class extends smithyClient.Command.classBuilder().ep(commonParams).m(function(Command, cs, config, o) {
      return [middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions())];
    }).s("SWBPortalService", "ListAccounts", {}).n("SSOClient", "ListAccountsCommand").sc(schemas_0.ListAccounts$).build() {
      static {
        __name(this, "ListAccountsCommand");
      }
    };
    var LogoutCommand = class extends smithyClient.Command.classBuilder().ep(commonParams).m(function(Command, cs, config, o) {
      return [middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions())];
    }).s("SWBPortalService", "Logout", {}).n("SSOClient", "LogoutCommand").sc(schemas_0.Logout$).build() {
      static {
        __name(this, "LogoutCommand");
      }
    };
    var paginateListAccountRoles = core.createPaginator(SSOClient, ListAccountRolesCommand, "nextToken", "nextToken", "maxResults");
    var paginateListAccounts = core.createPaginator(SSOClient, ListAccountsCommand, "nextToken", "nextToken", "maxResults");
    var commands = {
      GetRoleCredentialsCommand,
      ListAccountRolesCommand,
      ListAccountsCommand,
      LogoutCommand
    };
    var paginators = {
      paginateListAccountRoles,
      paginateListAccounts
    };
    var SSO = class extends SSOClient {
      static {
        __name(this, "SSO");
      }
    };
    smithyClient.createAggregatedClient(commands, SSO, { paginators });
    Object.defineProperty(exports, "$Command", {
      enumerable: true,
      get: /* @__PURE__ */ __name(function() {
        return smithyClient.Command;
      }, "get")
    });
    Object.defineProperty(exports, "__Client", {
      enumerable: true,
      get: /* @__PURE__ */ __name(function() {
        return smithyClient.Client;
      }, "get")
    });
    Object.defineProperty(exports, "SSOServiceException", {
      enumerable: true,
      get: /* @__PURE__ */ __name(function() {
        return SSOServiceException.SSOServiceException;
      }, "get")
    });
    exports.GetRoleCredentialsCommand = GetRoleCredentialsCommand;
    exports.ListAccountRolesCommand = ListAccountRolesCommand;
    exports.ListAccountsCommand = ListAccountsCommand;
    exports.LogoutCommand = LogoutCommand;
    exports.SSO = SSO;
    exports.SSOClient = SSOClient;
    exports.paginateListAccountRoles = paginateListAccountRoles;
    exports.paginateListAccounts = paginateListAccounts;
    Object.keys(schemas_0).forEach(function(k) {
      if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
        enumerable: true,
        get: /* @__PURE__ */ __name(function() {
          return schemas_0[k];
        }, "get")
      });
    });
    Object.keys(errors).forEach(function(k) {
      if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
        enumerable: true,
        get: /* @__PURE__ */ __name(function() {
          return errors[k];
        }, "get")
      });
    });
  }
});

// node_modules/@aws-sdk/credential-provider-sso/dist-cjs/loadSso-CVy8iqsZ.js
var require_loadSso_CVy8iqsZ = __commonJS({
  "node_modules/@aws-sdk/credential-provider-sso/dist-cjs/loadSso-CVy8iqsZ.js"(exports) {
    "use strict";
    init_esm();
    var clientSso = require_dist_cjs28();
    Object.defineProperty(exports, "GetRoleCredentialsCommand", {
      enumerable: true,
      get: /* @__PURE__ */ __name(function() {
        return clientSso.GetRoleCredentialsCommand;
      }, "get")
    });
    Object.defineProperty(exports, "SSOClient", {
      enumerable: true,
      get: /* @__PURE__ */ __name(function() {
        return clientSso.SSOClient;
      }, "get")
    });
  }
});

// node_modules/@aws-sdk/credential-provider-sso/dist-cjs/index.js
var require_dist_cjs29 = __commonJS({
  "node_modules/@aws-sdk/credential-provider-sso/dist-cjs/index.js"(exports) {
    init_esm();
    var propertyProvider = require_dist_cjs6();
    var sharedIniFileLoader = require_dist_cjs16();
    var client = (init_client(), __toCommonJS(client_exports));
    var tokenProviders = require_dist_cjs26();
    var isSsoProfile = /* @__PURE__ */ __name((arg) => arg && (typeof arg.sso_start_url === "string" || typeof arg.sso_account_id === "string" || typeof arg.sso_session === "string" || typeof arg.sso_region === "string" || typeof arg.sso_role_name === "string"), "isSsoProfile");
    var SHOULD_FAIL_CREDENTIAL_CHAIN = false;
    var resolveSSOCredentials = /* @__PURE__ */ __name(async ({ ssoStartUrl, ssoSession, ssoAccountId, ssoRegion, ssoRoleName, ssoClient, clientConfig, parentClientConfig, callerClientConfig, profile, filepath, configFilepath, ignoreCache, logger }) => {
      let token;
      const refreshMessage = `To refresh this SSO session run aws sso login with the corresponding profile.`;
      if (ssoSession) {
        try {
          const _token = await tokenProviders.fromSso({
            profile,
            filepath,
            configFilepath,
            ignoreCache
          })();
          token = {
            accessToken: _token.token,
            expiresAt: new Date(_token.expiration).toISOString()
          };
        } catch (e) {
          throw new propertyProvider.CredentialsProviderError(e.message, {
            tryNextLink: SHOULD_FAIL_CREDENTIAL_CHAIN,
            logger
          });
        }
      } else {
        try {
          token = await sharedIniFileLoader.getSSOTokenFromFile(ssoStartUrl);
        } catch (e) {
          throw new propertyProvider.CredentialsProviderError(`The SSO session associated with this profile is invalid. ${refreshMessage}`, {
            tryNextLink: SHOULD_FAIL_CREDENTIAL_CHAIN,
            logger
          });
        }
      }
      if (new Date(token.expiresAt).getTime() - Date.now() <= 0) {
        throw new propertyProvider.CredentialsProviderError(`The SSO session associated with this profile has expired. ${refreshMessage}`, {
          tryNextLink: SHOULD_FAIL_CREDENTIAL_CHAIN,
          logger
        });
      }
      const { accessToken } = token;
      const { SSOClient, GetRoleCredentialsCommand } = await Promise.resolve().then(function() {
        return require_loadSso_CVy8iqsZ();
      });
      const sso = ssoClient || new SSOClient(Object.assign({}, clientConfig ?? {}, {
        logger: clientConfig?.logger ?? callerClientConfig?.logger ?? parentClientConfig?.logger,
        region: clientConfig?.region ?? ssoRegion,
        userAgentAppId: clientConfig?.userAgentAppId ?? callerClientConfig?.userAgentAppId ?? parentClientConfig?.userAgentAppId
      }));
      let ssoResp;
      try {
        ssoResp = await sso.send(new GetRoleCredentialsCommand({
          accountId: ssoAccountId,
          roleName: ssoRoleName,
          accessToken
        }));
      } catch (e) {
        throw new propertyProvider.CredentialsProviderError(e, {
          tryNextLink: SHOULD_FAIL_CREDENTIAL_CHAIN,
          logger
        });
      }
      const { roleCredentials: { accessKeyId, secretAccessKey, sessionToken, expiration, credentialScope, accountId } = {} } = ssoResp;
      if (!accessKeyId || !secretAccessKey || !sessionToken || !expiration) {
        throw new propertyProvider.CredentialsProviderError("SSO returns an invalid temporary credential.", {
          tryNextLink: SHOULD_FAIL_CREDENTIAL_CHAIN,
          logger
        });
      }
      const credentials = {
        accessKeyId,
        secretAccessKey,
        sessionToken,
        expiration: new Date(expiration),
        ...credentialScope && { credentialScope },
        ...accountId && { accountId }
      };
      if (ssoSession) {
        client.setCredentialFeature(credentials, "CREDENTIALS_SSO", "s");
      } else {
        client.setCredentialFeature(credentials, "CREDENTIALS_SSO_LEGACY", "u");
      }
      return credentials;
    }, "resolveSSOCredentials");
    var validateSsoProfile = /* @__PURE__ */ __name((profile, logger) => {
      const { sso_start_url, sso_account_id, sso_region, sso_role_name } = profile;
      if (!sso_start_url || !sso_account_id || !sso_region || !sso_role_name) {
        throw new propertyProvider.CredentialsProviderError(`Profile is configured with invalid SSO credentials. Required parameters "sso_account_id", "sso_region", "sso_role_name", "sso_start_url". Got ${Object.keys(profile).join(", ")}
Reference: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html`, { tryNextLink: false, logger });
      }
      return profile;
    }, "validateSsoProfile");
    var fromSSO = /* @__PURE__ */ __name((init = {}) => async ({ callerClientConfig } = {}) => {
      init.logger?.debug("@aws-sdk/credential-provider-sso - fromSSO");
      const { ssoStartUrl, ssoAccountId, ssoRegion, ssoRoleName, ssoSession } = init;
      const { ssoClient } = init;
      const profileName = sharedIniFileLoader.getProfileName({
        profile: init.profile ?? callerClientConfig?.profile
      });
      if (!ssoStartUrl && !ssoAccountId && !ssoRegion && !ssoRoleName && !ssoSession) {
        const profiles = await sharedIniFileLoader.parseKnownFiles(init);
        const profile = profiles[profileName];
        if (!profile) {
          throw new propertyProvider.CredentialsProviderError(`Profile ${profileName} was not found.`, { logger: init.logger });
        }
        if (!isSsoProfile(profile)) {
          throw new propertyProvider.CredentialsProviderError(`Profile ${profileName} is not configured with SSO credentials.`, {
            logger: init.logger
          });
        }
        if (profile?.sso_session) {
          const ssoSessions = await sharedIniFileLoader.loadSsoSessionData(init);
          const session = ssoSessions[profile.sso_session];
          const conflictMsg = ` configurations in profile ${profileName} and sso-session ${profile.sso_session}`;
          if (ssoRegion && ssoRegion !== session.sso_region) {
            throw new propertyProvider.CredentialsProviderError(`Conflicting SSO region` + conflictMsg, {
              tryNextLink: false,
              logger: init.logger
            });
          }
          if (ssoStartUrl && ssoStartUrl !== session.sso_start_url) {
            throw new propertyProvider.CredentialsProviderError(`Conflicting SSO start_url` + conflictMsg, {
              tryNextLink: false,
              logger: init.logger
            });
          }
          profile.sso_region = session.sso_region;
          profile.sso_start_url = session.sso_start_url;
        }
        const { sso_start_url, sso_account_id, sso_region, sso_role_name, sso_session } = validateSsoProfile(profile, init.logger);
        return resolveSSOCredentials({
          ssoStartUrl: sso_start_url,
          ssoSession: sso_session,
          ssoAccountId: sso_account_id,
          ssoRegion: sso_region,
          ssoRoleName: sso_role_name,
          ssoClient,
          clientConfig: init.clientConfig,
          parentClientConfig: init.parentClientConfig,
          callerClientConfig: init.callerClientConfig,
          profile: profileName,
          filepath: init.filepath,
          configFilepath: init.configFilepath,
          ignoreCache: init.ignoreCache,
          logger: init.logger
        });
      } else if (!ssoStartUrl || !ssoAccountId || !ssoRegion || !ssoRoleName) {
        throw new propertyProvider.CredentialsProviderError('Incomplete configuration. The fromSSO() argument hash must include "ssoStartUrl", "ssoAccountId", "ssoRegion", "ssoRoleName"', { tryNextLink: false, logger: init.logger });
      } else {
        return resolveSSOCredentials({
          ssoStartUrl,
          ssoSession,
          ssoAccountId,
          ssoRegion,
          ssoRoleName,
          ssoClient,
          clientConfig: init.clientConfig,
          parentClientConfig: init.parentClientConfig,
          callerClientConfig: init.callerClientConfig,
          profile: profileName,
          filepath: init.filepath,
          configFilepath: init.configFilepath,
          ignoreCache: init.ignoreCache,
          logger: init.logger
        });
      }
    }, "fromSSO");
    exports.fromSSO = fromSSO;
    exports.isSsoProfile = isSsoProfile;
    exports.validateSsoProfile = validateSsoProfile;
  }
});
export default require_dist_cjs29();
//# sourceMappingURL=dist-cjs-GXTZE6TO.mjs.map
