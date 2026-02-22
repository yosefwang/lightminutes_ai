import {
  require_dist_cjs6 as require_dist_cjs
} from "./chunk-UBXUY2U2.mjs";
import {
  require_dist_cjs as require_dist_cjs2
} from "./chunk-RA5DMQQ6.mjs";
import {
  __commonJS,
  __esm,
  __name,
  init_esm
} from "./chunk-5QNIFE2Q.mjs";

// node_modules/@aws-sdk/nested-clients/package.json
var package_default;
var init_package = __esm({
  "node_modules/@aws-sdk/nested-clients/package.json"() {
    package_default = {
      name: "@aws-sdk/nested-clients",
      version: "3.993.0",
      description: "Nested clients for AWS SDK packages.",
      main: "./dist-cjs/index.js",
      module: "./dist-es/index.js",
      types: "./dist-types/index.d.ts",
      scripts: {
        build: "yarn lint && concurrently 'yarn:build:types' 'yarn:build:es' && yarn build:cjs",
        "build:cjs": "node ../../scripts/compilation/inline nested-clients",
        "build:es": "tsc -p tsconfig.es.json",
        "build:include:deps": 'yarn g:turbo run build -F="$npm_package_name"',
        "build:types": "tsc -p tsconfig.types.json",
        "build:types:downlevel": "downlevel-dts dist-types dist-types/ts3.4",
        clean: "premove dist-cjs dist-es dist-types tsconfig.cjs.tsbuildinfo tsconfig.es.tsbuildinfo tsconfig.types.tsbuildinfo",
        lint: "node ../../scripts/validation/submodules-linter.js --pkg nested-clients",
        test: "yarn g:vitest run",
        "test:watch": "yarn g:vitest watch"
      },
      engines: {
        node: ">=20.0.0"
      },
      sideEffects: false,
      author: {
        name: "AWS SDK for JavaScript Team",
        url: "https://aws.amazon.com/javascript/"
      },
      license: "Apache-2.0",
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
        concurrently: "7.0.0",
        "downlevel-dts": "0.10.1",
        premove: "4.0.0",
        typescript: "~5.8.3"
      },
      typesVersions: {
        "<4.0": {
          "dist-types/*": [
            "dist-types/ts3.4/*"
          ]
        }
      },
      files: [
        "./signin.d.ts",
        "./signin.js",
        "./sso-oidc.d.ts",
        "./sso-oidc.js",
        "./sts.d.ts",
        "./sts.js",
        "dist-*/**"
      ],
      browser: {
        "./dist-es/submodules/signin/runtimeConfig": "./dist-es/submodules/signin/runtimeConfig.browser",
        "./dist-es/submodules/sso-oidc/runtimeConfig": "./dist-es/submodules/sso-oidc/runtimeConfig.browser",
        "./dist-es/submodules/sts/runtimeConfig": "./dist-es/submodules/sts/runtimeConfig.browser"
      },
      "react-native": {},
      homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/packages/nested-clients",
      repository: {
        type: "git",
        url: "https://github.com/aws/aws-sdk-js-v3.git",
        directory: "packages/nested-clients"
      },
      exports: {
        "./package.json": "./package.json",
        "./sso-oidc": {
          types: "./dist-types/submodules/sso-oidc/index.d.ts",
          module: "./dist-es/submodules/sso-oidc/index.js",
          node: "./dist-cjs/submodules/sso-oidc/index.js",
          import: "./dist-es/submodules/sso-oidc/index.js",
          require: "./dist-cjs/submodules/sso-oidc/index.js"
        },
        "./sts": {
          types: "./dist-types/submodules/sts/index.d.ts",
          module: "./dist-es/submodules/sts/index.js",
          node: "./dist-cjs/submodules/sts/index.js",
          import: "./dist-es/submodules/sts/index.js",
          require: "./dist-cjs/submodules/sts/index.js"
        },
        "./signin": {
          types: "./dist-types/submodules/signin/index.d.ts",
          module: "./dist-es/submodules/signin/index.js",
          node: "./dist-cjs/submodules/signin/index.js",
          import: "./dist-es/submodules/signin/index.js",
          require: "./dist-cjs/submodules/signin/index.js"
        }
      }
    };
  }
});

// node_modules/@aws-sdk/nested-clients/node_modules/@aws-sdk/util-endpoints/dist-cjs/index.js
var require_dist_cjs3 = __commonJS({
  "node_modules/@aws-sdk/nested-clients/node_modules/@aws-sdk/util-endpoints/dist-cjs/index.js"(exports) {
    "use strict";
    init_esm();
    var utilEndpoints = require_dist_cjs();
    var urlParser = require_dist_cjs2();
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

export {
  init_package,
  package_default,
  require_dist_cjs3 as require_dist_cjs
};
//# sourceMappingURL=chunk-BOXX7IAE.mjs.map
