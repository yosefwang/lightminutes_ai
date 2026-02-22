import {
  init_package,
  package_default,
  require_dist_cjs as require_dist_cjs23
} from "./chunk-BOXX7IAE.mjs";
import {
  AwsQueryProtocol,
  AwsSdkSigV4Signer,
  DefaultIdentityProviderConfig,
  NODE_AUTH_SCHEME_PREFERENCE_OPTIONS,
  NoAuthSigner,
  getHttpAuthSchemeEndpointRuleSetPlugin,
  getHttpSigningPlugin,
  init_dist_es,
  init_dist_es2,
  init_protocols,
  require_dist_cjs10 as require_dist_cjs16,
  require_dist_cjs11 as require_dist_cjs17,
  require_dist_cjs12 as require_dist_cjs18,
  require_dist_cjs13 as require_dist_cjs19,
  require_dist_cjs14 as require_dist_cjs20,
  require_dist_cjs15 as require_dist_cjs21,
  require_dist_cjs16 as require_dist_cjs22,
  require_dist_cjs17 as require_dist_cjs24,
  require_dist_cjs2 as require_dist_cjs7,
  require_dist_cjs3 as require_dist_cjs8,
  require_dist_cjs4 as require_dist_cjs9,
  require_dist_cjs6 as require_dist_cjs10,
  require_dist_cjs7 as require_dist_cjs12,
  require_dist_cjs8 as require_dist_cjs13,
  require_dist_cjs9 as require_dist_cjs14,
  resolveAwsSdkSigV4Config
} from "./chunk-UBXUY2U2.mjs";
import {
  require_dist_cjs as require_dist_cjs11,
  require_dist_cjs2 as require_dist_cjs15
} from "./chunk-RA5DMQQ6.mjs";
import {
  TypeRegistry,
  getSchemaSerdePlugin,
  init_schema,
  require_dist_cjs as require_dist_cjs2,
  require_dist_cjs2 as require_dist_cjs4,
  require_dist_cjs4 as require_dist_cjs5,
  require_dist_cjs8 as require_dist_cjs6
} from "./chunk-K7ZPZUY5.mjs";
import {
  require_dist_cjs
} from "./chunk-BFQRAWI6.mjs";
import {
  emitWarningIfUnsupportedVersion,
  init_client,
  setCredentialFeature
} from "./chunk-CVRFA6TN.mjs";
import {
  require_dist_cjs3
} from "./chunk-YS6GXE6O.mjs";
import {
  __esm,
  __export,
  __name,
  __toESM,
  init_esm
} from "./chunk-5QNIFE2Q.mjs";

// node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/auth/httpAuthSchemeProvider.js
function createAwsAuthSigv4HttpAuthOption(authParameters) {
  return {
    schemeId: "aws.auth#sigv4",
    signingProperties: {
      name: "sts",
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
function createSmithyApiNoAuthHttpAuthOption(authParameters) {
  return {
    schemeId: "smithy.api#noAuth"
  };
}
var import_util_middleware, defaultSTSHttpAuthSchemeParametersProvider, defaultSTSHttpAuthSchemeProvider, resolveStsAuthConfig, resolveHttpAuthSchemeConfig;
var init_httpAuthSchemeProvider = __esm({
  "node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/auth/httpAuthSchemeProvider.js"() {
    init_esm();
    init_dist_es2();
    import_util_middleware = __toESM(require_dist_cjs2());
    init_STSClient();
    defaultSTSHttpAuthSchemeParametersProvider = /* @__PURE__ */ __name(async (config, context, input) => {
      return {
        operation: (0, import_util_middleware.getSmithyContext)(context).operation,
        region: await (0, import_util_middleware.normalizeProvider)(config.region)() || (() => {
          throw new Error("expected `region` to be configured for `aws.auth#sigv4`");
        })()
      };
    }, "defaultSTSHttpAuthSchemeParametersProvider");
    __name(createAwsAuthSigv4HttpAuthOption, "createAwsAuthSigv4HttpAuthOption");
    __name(createSmithyApiNoAuthHttpAuthOption, "createSmithyApiNoAuthHttpAuthOption");
    defaultSTSHttpAuthSchemeProvider = /* @__PURE__ */ __name((authParameters) => {
      const options = [];
      switch (authParameters.operation) {
        case "AssumeRoleWithWebIdentity": {
          options.push(createSmithyApiNoAuthHttpAuthOption(authParameters));
          break;
        }
        default: {
          options.push(createAwsAuthSigv4HttpAuthOption(authParameters));
        }
      }
      return options;
    }, "defaultSTSHttpAuthSchemeProvider");
    resolveStsAuthConfig = /* @__PURE__ */ __name((input) => Object.assign(input, {
      stsClientCtor: STSClient
    }), "resolveStsAuthConfig");
    resolveHttpAuthSchemeConfig = /* @__PURE__ */ __name((config) => {
      const config_0 = resolveStsAuthConfig(config);
      const config_1 = resolveAwsSdkSigV4Config(config_0);
      return Object.assign(config_1, {
        authSchemePreference: (0, import_util_middleware.normalizeProvider)(config.authSchemePreference ?? [])
      });
    }, "resolveHttpAuthSchemeConfig");
  }
});

// node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/endpoint/EndpointParameters.js
var resolveClientEndpointParameters, commonParams;
var init_EndpointParameters = __esm({
  "node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/endpoint/EndpointParameters.js"() {
    init_esm();
    resolveClientEndpointParameters = /* @__PURE__ */ __name((options) => {
      return Object.assign(options, {
        useDualstackEndpoint: options.useDualstackEndpoint ?? false,
        useFipsEndpoint: options.useFipsEndpoint ?? false,
        useGlobalEndpoint: options.useGlobalEndpoint ?? false,
        defaultSigningName: "sts"
      });
    }, "resolveClientEndpointParameters");
    commonParams = {
      UseGlobalEndpoint: { type: "builtInParams", name: "useGlobalEndpoint" },
      UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
      Endpoint: { type: "builtInParams", name: "endpoint" },
      Region: { type: "builtInParams", name: "region" },
      UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" }
    };
  }
});

// node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/endpoint/ruleset.js
var F, G, H, I, J, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, A, B, C, D, E, _data, ruleSet;
var init_ruleset = __esm({
  "node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/endpoint/ruleset.js"() {
    init_esm();
    F = "required";
    G = "type";
    H = "fn";
    I = "argv";
    J = "ref";
    a = false;
    b = true;
    c = "booleanEquals";
    d = "stringEquals";
    e = "sigv4";
    f = "sts";
    g = "us-east-1";
    h = "endpoint";
    i = "https://sts.{Region}.{PartitionResult#dnsSuffix}";
    j = "tree";
    k = "error";
    l = "getAttr";
    m = { [F]: false, [G]: "string" };
    n = { [F]: true, "default": false, [G]: "boolean" };
    o = { [J]: "Endpoint" };
    p = { [H]: "isSet", [I]: [{ [J]: "Region" }] };
    q = { [J]: "Region" };
    r = { [H]: "aws.partition", [I]: [q], "assign": "PartitionResult" };
    s = { [J]: "UseFIPS" };
    t = { [J]: "UseDualStack" };
    u = { "url": "https://sts.amazonaws.com", "properties": { "authSchemes": [{ "name": e, "signingName": f, "signingRegion": g }] }, "headers": {} };
    v = {};
    w = { "conditions": [{ [H]: d, [I]: [q, "aws-global"] }], [h]: u, [G]: h };
    x = { [H]: c, [I]: [s, true] };
    y = { [H]: c, [I]: [t, true] };
    z = { [H]: l, [I]: [{ [J]: "PartitionResult" }, "supportsFIPS"] };
    A = { [J]: "PartitionResult" };
    B = { [H]: c, [I]: [true, { [H]: l, [I]: [A, "supportsDualStack"] }] };
    C = [{ [H]: "isSet", [I]: [o] }];
    D = [x];
    E = [y];
    _data = { version: "1.0", parameters: { Region: m, UseDualStack: n, UseFIPS: n, Endpoint: m, UseGlobalEndpoint: n }, rules: [{ conditions: [{ [H]: c, [I]: [{ [J]: "UseGlobalEndpoint" }, b] }, { [H]: "not", [I]: C }, p, r, { [H]: c, [I]: [s, a] }, { [H]: c, [I]: [t, a] }], rules: [{ conditions: [{ [H]: d, [I]: [q, "ap-northeast-1"] }], endpoint: u, [G]: h }, { conditions: [{ [H]: d, [I]: [q, "ap-south-1"] }], endpoint: u, [G]: h }, { conditions: [{ [H]: d, [I]: [q, "ap-southeast-1"] }], endpoint: u, [G]: h }, { conditions: [{ [H]: d, [I]: [q, "ap-southeast-2"] }], endpoint: u, [G]: h }, w, { conditions: [{ [H]: d, [I]: [q, "ca-central-1"] }], endpoint: u, [G]: h }, { conditions: [{ [H]: d, [I]: [q, "eu-central-1"] }], endpoint: u, [G]: h }, { conditions: [{ [H]: d, [I]: [q, "eu-north-1"] }], endpoint: u, [G]: h }, { conditions: [{ [H]: d, [I]: [q, "eu-west-1"] }], endpoint: u, [G]: h }, { conditions: [{ [H]: d, [I]: [q, "eu-west-2"] }], endpoint: u, [G]: h }, { conditions: [{ [H]: d, [I]: [q, "eu-west-3"] }], endpoint: u, [G]: h }, { conditions: [{ [H]: d, [I]: [q, "sa-east-1"] }], endpoint: u, [G]: h }, { conditions: [{ [H]: d, [I]: [q, g] }], endpoint: u, [G]: h }, { conditions: [{ [H]: d, [I]: [q, "us-east-2"] }], endpoint: u, [G]: h }, { conditions: [{ [H]: d, [I]: [q, "us-west-1"] }], endpoint: u, [G]: h }, { conditions: [{ [H]: d, [I]: [q, "us-west-2"] }], endpoint: u, [G]: h }, { endpoint: { url: i, properties: { authSchemes: [{ name: e, signingName: f, signingRegion: "{Region}" }] }, headers: v }, [G]: h }], [G]: j }, { conditions: C, rules: [{ conditions: D, error: "Invalid Configuration: FIPS and custom endpoint are not supported", [G]: k }, { conditions: E, error: "Invalid Configuration: Dualstack and custom endpoint are not supported", [G]: k }, { endpoint: { url: o, properties: v, headers: v }, [G]: h }], [G]: j }, { conditions: [p], rules: [{ conditions: [r], rules: [{ conditions: [x, y], rules: [{ conditions: [{ [H]: c, [I]: [b, z] }, B], rules: [{ endpoint: { url: "https://sts-fips.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: v, headers: v }, [G]: h }], [G]: j }, { error: "FIPS and DualStack are enabled, but this partition does not support one or both", [G]: k }], [G]: j }, { conditions: D, rules: [{ conditions: [{ [H]: c, [I]: [z, b] }], rules: [{ conditions: [{ [H]: d, [I]: [{ [H]: l, [I]: [A, "name"] }, "aws-us-gov"] }], endpoint: { url: "https://sts.{Region}.amazonaws.com", properties: v, headers: v }, [G]: h }, { endpoint: { url: "https://sts-fips.{Region}.{PartitionResult#dnsSuffix}", properties: v, headers: v }, [G]: h }], [G]: j }, { error: "FIPS is enabled but this partition does not support FIPS", [G]: k }], [G]: j }, { conditions: E, rules: [{ conditions: [B], rules: [{ endpoint: { url: "https://sts.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: v, headers: v }, [G]: h }], [G]: j }, { error: "DualStack is enabled but this partition does not support DualStack", [G]: k }], [G]: j }, w, { endpoint: { url: i, properties: v, headers: v }, [G]: h }], [G]: j }], [G]: j }, { error: "Invalid Configuration: Missing Region", [G]: k }] };
    ruleSet = _data;
  }
});

// node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/endpoint/endpointResolver.js
var import_util_endpoints, import_util_endpoints2, cache, defaultEndpointResolver;
var init_endpointResolver = __esm({
  "node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/endpoint/endpointResolver.js"() {
    init_esm();
    import_util_endpoints = __toESM(require_dist_cjs23());
    import_util_endpoints2 = __toESM(require_dist_cjs10());
    init_ruleset();
    cache = new import_util_endpoints2.EndpointCache({
      size: 50,
      params: ["Endpoint", "Region", "UseDualStack", "UseFIPS", "UseGlobalEndpoint"]
    });
    defaultEndpointResolver = /* @__PURE__ */ __name((endpointParams, context = {}) => {
      return cache.get(endpointParams, () => (0, import_util_endpoints2.resolveEndpoint)(ruleSet, {
        endpointParams,
        logger: context.logger
      }));
    }, "defaultEndpointResolver");
    import_util_endpoints2.customEndpointFunctions.aws = import_util_endpoints.awsEndpointFunctions;
  }
});

// node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/models/STSServiceException.js
var import_smithy_client, STSServiceException;
var init_STSServiceException = __esm({
  "node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/models/STSServiceException.js"() {
    init_esm();
    import_smithy_client = __toESM(require_dist_cjs6());
    STSServiceException = class _STSServiceException extends import_smithy_client.ServiceException {
      static {
        __name(this, "STSServiceException");
      }
      constructor(options) {
        super(options);
        Object.setPrototypeOf(this, _STSServiceException.prototype);
      }
    };
  }
});

// node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/models/errors.js
var ExpiredTokenException, MalformedPolicyDocumentException, PackedPolicyTooLargeException, RegionDisabledException, IDPRejectedClaimException, InvalidIdentityTokenException, IDPCommunicationErrorException;
var init_errors = __esm({
  "node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/models/errors.js"() {
    init_esm();
    init_STSServiceException();
    ExpiredTokenException = class _ExpiredTokenException extends STSServiceException {
      static {
        __name(this, "ExpiredTokenException");
      }
      name = "ExpiredTokenException";
      $fault = "client";
      constructor(opts) {
        super({
          name: "ExpiredTokenException",
          $fault: "client",
          ...opts
        });
        Object.setPrototypeOf(this, _ExpiredTokenException.prototype);
      }
    };
    MalformedPolicyDocumentException = class _MalformedPolicyDocumentException extends STSServiceException {
      static {
        __name(this, "MalformedPolicyDocumentException");
      }
      name = "MalformedPolicyDocumentException";
      $fault = "client";
      constructor(opts) {
        super({
          name: "MalformedPolicyDocumentException",
          $fault: "client",
          ...opts
        });
        Object.setPrototypeOf(this, _MalformedPolicyDocumentException.prototype);
      }
    };
    PackedPolicyTooLargeException = class _PackedPolicyTooLargeException extends STSServiceException {
      static {
        __name(this, "PackedPolicyTooLargeException");
      }
      name = "PackedPolicyTooLargeException";
      $fault = "client";
      constructor(opts) {
        super({
          name: "PackedPolicyTooLargeException",
          $fault: "client",
          ...opts
        });
        Object.setPrototypeOf(this, _PackedPolicyTooLargeException.prototype);
      }
    };
    RegionDisabledException = class _RegionDisabledException extends STSServiceException {
      static {
        __name(this, "RegionDisabledException");
      }
      name = "RegionDisabledException";
      $fault = "client";
      constructor(opts) {
        super({
          name: "RegionDisabledException",
          $fault: "client",
          ...opts
        });
        Object.setPrototypeOf(this, _RegionDisabledException.prototype);
      }
    };
    IDPRejectedClaimException = class _IDPRejectedClaimException extends STSServiceException {
      static {
        __name(this, "IDPRejectedClaimException");
      }
      name = "IDPRejectedClaimException";
      $fault = "client";
      constructor(opts) {
        super({
          name: "IDPRejectedClaimException",
          $fault: "client",
          ...opts
        });
        Object.setPrototypeOf(this, _IDPRejectedClaimException.prototype);
      }
    };
    InvalidIdentityTokenException = class _InvalidIdentityTokenException extends STSServiceException {
      static {
        __name(this, "InvalidIdentityTokenException");
      }
      name = "InvalidIdentityTokenException";
      $fault = "client";
      constructor(opts) {
        super({
          name: "InvalidIdentityTokenException",
          $fault: "client",
          ...opts
        });
        Object.setPrototypeOf(this, _InvalidIdentityTokenException.prototype);
      }
    };
    IDPCommunicationErrorException = class _IDPCommunicationErrorException extends STSServiceException {
      static {
        __name(this, "IDPCommunicationErrorException");
      }
      name = "IDPCommunicationErrorException";
      $fault = "client";
      constructor(opts) {
        super({
          name: "IDPCommunicationErrorException",
          $fault: "client",
          ...opts
        });
        Object.setPrototypeOf(this, _IDPCommunicationErrorException.prototype);
      }
    };
  }
});

// node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/schemas/schemas_0.js
var _A, _AKI, _AR, _ARI, _ARR, _ARRs, _ARU, _ARWWI, _ARWWIR, _ARWWIRs, _Au, _C, _CA, _DS, _E, _EI, _ETE, _IDPCEE, _IDPRCE, _IITE, _K, _MPDE, _P, _PA, _PAr, _PC, _PCLT, _PCr, _PDT, _PI, _PPS, _PPTLE, _Pr, _RA, _RDE, _RSN, _SAK, _SFWIT, _SI, _SN, _ST, _T, _TC, _TTK, _Ta, _V, _WIT, _a, _aKST, _aQE, _c, _cTT, _e, _hE, _m, _pDLT, _s, _tLT, n0, _s_registry, STSServiceException$, n0_registry, ExpiredTokenException$, IDPCommunicationErrorException$, IDPRejectedClaimException$, InvalidIdentityTokenException$, MalformedPolicyDocumentException$, PackedPolicyTooLargeException$, RegionDisabledException$, errorTypeRegistries, accessKeySecretType, clientTokenType, AssumedRoleUser$, AssumeRoleRequest$, AssumeRoleResponse$, AssumeRoleWithWebIdentityRequest$, AssumeRoleWithWebIdentityResponse$, Credentials$, PolicyDescriptorType$, ProvidedContext$, Tag$, policyDescriptorListType, ProvidedContextsListType, tagKeyListType, tagListType, AssumeRole$, AssumeRoleWithWebIdentity$;
var init_schemas_0 = __esm({
  "node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/schemas/schemas_0.js"() {
    init_esm();
    init_schema();
    init_errors();
    init_STSServiceException();
    _A = "Arn";
    _AKI = "AccessKeyId";
    _AR = "AssumeRole";
    _ARI = "AssumedRoleId";
    _ARR = "AssumeRoleRequest";
    _ARRs = "AssumeRoleResponse";
    _ARU = "AssumedRoleUser";
    _ARWWI = "AssumeRoleWithWebIdentity";
    _ARWWIR = "AssumeRoleWithWebIdentityRequest";
    _ARWWIRs = "AssumeRoleWithWebIdentityResponse";
    _Au = "Audience";
    _C = "Credentials";
    _CA = "ContextAssertion";
    _DS = "DurationSeconds";
    _E = "Expiration";
    _EI = "ExternalId";
    _ETE = "ExpiredTokenException";
    _IDPCEE = "IDPCommunicationErrorException";
    _IDPRCE = "IDPRejectedClaimException";
    _IITE = "InvalidIdentityTokenException";
    _K = "Key";
    _MPDE = "MalformedPolicyDocumentException";
    _P = "Policy";
    _PA = "PolicyArns";
    _PAr = "ProviderArn";
    _PC = "ProvidedContexts";
    _PCLT = "ProvidedContextsListType";
    _PCr = "ProvidedContext";
    _PDT = "PolicyDescriptorType";
    _PI = "ProviderId";
    _PPS = "PackedPolicySize";
    _PPTLE = "PackedPolicyTooLargeException";
    _Pr = "Provider";
    _RA = "RoleArn";
    _RDE = "RegionDisabledException";
    _RSN = "RoleSessionName";
    _SAK = "SecretAccessKey";
    _SFWIT = "SubjectFromWebIdentityToken";
    _SI = "SourceIdentity";
    _SN = "SerialNumber";
    _ST = "SessionToken";
    _T = "Tags";
    _TC = "TokenCode";
    _TTK = "TransitiveTagKeys";
    _Ta = "Tag";
    _V = "Value";
    _WIT = "WebIdentityToken";
    _a = "arn";
    _aKST = "accessKeySecretType";
    _aQE = "awsQueryError";
    _c = "client";
    _cTT = "clientTokenType";
    _e = "error";
    _hE = "httpError";
    _m = "message";
    _pDLT = "policyDescriptorListType";
    _s = "smithy.ts.sdk.synthetic.com.amazonaws.sts";
    _tLT = "tagListType";
    n0 = "com.amazonaws.sts";
    _s_registry = TypeRegistry.for(_s);
    STSServiceException$ = [-3, _s, "STSServiceException", 0, [], []];
    _s_registry.registerError(STSServiceException$, STSServiceException);
    n0_registry = TypeRegistry.for(n0);
    ExpiredTokenException$ = [
      -3,
      n0,
      _ETE,
      { [_aQE]: [`ExpiredTokenException`, 400], [_e]: _c, [_hE]: 400 },
      [_m],
      [0]
    ];
    n0_registry.registerError(ExpiredTokenException$, ExpiredTokenException);
    IDPCommunicationErrorException$ = [
      -3,
      n0,
      _IDPCEE,
      { [_aQE]: [`IDPCommunicationError`, 400], [_e]: _c, [_hE]: 400 },
      [_m],
      [0]
    ];
    n0_registry.registerError(IDPCommunicationErrorException$, IDPCommunicationErrorException);
    IDPRejectedClaimException$ = [
      -3,
      n0,
      _IDPRCE,
      { [_aQE]: [`IDPRejectedClaim`, 403], [_e]: _c, [_hE]: 403 },
      [_m],
      [0]
    ];
    n0_registry.registerError(IDPRejectedClaimException$, IDPRejectedClaimException);
    InvalidIdentityTokenException$ = [
      -3,
      n0,
      _IITE,
      { [_aQE]: [`InvalidIdentityToken`, 400], [_e]: _c, [_hE]: 400 },
      [_m],
      [0]
    ];
    n0_registry.registerError(InvalidIdentityTokenException$, InvalidIdentityTokenException);
    MalformedPolicyDocumentException$ = [
      -3,
      n0,
      _MPDE,
      { [_aQE]: [`MalformedPolicyDocument`, 400], [_e]: _c, [_hE]: 400 },
      [_m],
      [0]
    ];
    n0_registry.registerError(MalformedPolicyDocumentException$, MalformedPolicyDocumentException);
    PackedPolicyTooLargeException$ = [
      -3,
      n0,
      _PPTLE,
      { [_aQE]: [`PackedPolicyTooLarge`, 400], [_e]: _c, [_hE]: 400 },
      [_m],
      [0]
    ];
    n0_registry.registerError(PackedPolicyTooLargeException$, PackedPolicyTooLargeException);
    RegionDisabledException$ = [
      -3,
      n0,
      _RDE,
      { [_aQE]: [`RegionDisabledException`, 403], [_e]: _c, [_hE]: 403 },
      [_m],
      [0]
    ];
    n0_registry.registerError(RegionDisabledException$, RegionDisabledException);
    errorTypeRegistries = [_s_registry, n0_registry];
    accessKeySecretType = [0, n0, _aKST, 8, 0];
    clientTokenType = [0, n0, _cTT, 8, 0];
    AssumedRoleUser$ = [3, n0, _ARU, 0, [_ARI, _A], [0, 0], 2];
    AssumeRoleRequest$ = [
      3,
      n0,
      _ARR,
      0,
      [_RA, _RSN, _PA, _P, _DS, _T, _TTK, _EI, _SN, _TC, _SI, _PC],
      [0, 0, () => policyDescriptorListType, 0, 1, () => tagListType, 64 | 0, 0, 0, 0, 0, () => ProvidedContextsListType],
      2
    ];
    AssumeRoleResponse$ = [
      3,
      n0,
      _ARRs,
      0,
      [_C, _ARU, _PPS, _SI],
      [[() => Credentials$, 0], () => AssumedRoleUser$, 1, 0]
    ];
    AssumeRoleWithWebIdentityRequest$ = [
      3,
      n0,
      _ARWWIR,
      0,
      [_RA, _RSN, _WIT, _PI, _PA, _P, _DS],
      [0, 0, [() => clientTokenType, 0], 0, () => policyDescriptorListType, 0, 1],
      3
    ];
    AssumeRoleWithWebIdentityResponse$ = [
      3,
      n0,
      _ARWWIRs,
      0,
      [_C, _SFWIT, _ARU, _PPS, _Pr, _Au, _SI],
      [[() => Credentials$, 0], 0, () => AssumedRoleUser$, 1, 0, 0, 0]
    ];
    Credentials$ = [
      3,
      n0,
      _C,
      0,
      [_AKI, _SAK, _ST, _E],
      [0, [() => accessKeySecretType, 0], 0, 4],
      4
    ];
    PolicyDescriptorType$ = [3, n0, _PDT, 0, [_a], [0]];
    ProvidedContext$ = [3, n0, _PCr, 0, [_PAr, _CA], [0, 0]];
    Tag$ = [3, n0, _Ta, 0, [_K, _V], [0, 0], 2];
    policyDescriptorListType = [1, n0, _pDLT, 0, () => PolicyDescriptorType$];
    ProvidedContextsListType = [1, n0, _PCLT, 0, () => ProvidedContext$];
    tagKeyListType = 64 | 0;
    tagListType = [1, n0, _tLT, 0, () => Tag$];
    AssumeRole$ = [9, n0, _AR, 0, () => AssumeRoleRequest$, () => AssumeRoleResponse$];
    AssumeRoleWithWebIdentity$ = [
      9,
      n0,
      _ARWWI,
      0,
      () => AssumeRoleWithWebIdentityRequest$,
      () => AssumeRoleWithWebIdentityResponse$
    ];
  }
});

// node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/runtimeConfig.shared.js
var import_smithy_client2, import_url_parser, import_util_base64, import_util_utf8, getRuntimeConfig;
var init_runtimeConfig_shared = __esm({
  "node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/runtimeConfig.shared.js"() {
    init_esm();
    init_dist_es2();
    init_protocols();
    init_dist_es();
    import_smithy_client2 = __toESM(require_dist_cjs6());
    import_url_parser = __toESM(require_dist_cjs11());
    import_util_base64 = __toESM(require_dist_cjs4());
    import_util_utf8 = __toESM(require_dist_cjs3());
    init_httpAuthSchemeProvider();
    init_endpointResolver();
    init_schemas_0();
    getRuntimeConfig = /* @__PURE__ */ __name((config) => {
      return {
        apiVersion: "2011-06-15",
        base64Decoder: config?.base64Decoder ?? import_util_base64.fromBase64,
        base64Encoder: config?.base64Encoder ?? import_util_base64.toBase64,
        disableHostPrefix: config?.disableHostPrefix ?? false,
        endpointProvider: config?.endpointProvider ?? defaultEndpointResolver,
        extensions: config?.extensions ?? [],
        httpAuthSchemeProvider: config?.httpAuthSchemeProvider ?? defaultSTSHttpAuthSchemeProvider,
        httpAuthSchemes: config?.httpAuthSchemes ?? [
          {
            schemeId: "aws.auth#sigv4",
            identityProvider: /* @__PURE__ */ __name((ipc) => ipc.getIdentityProvider("aws.auth#sigv4"), "identityProvider"),
            signer: new AwsSdkSigV4Signer()
          },
          {
            schemeId: "smithy.api#noAuth",
            identityProvider: /* @__PURE__ */ __name((ipc) => ipc.getIdentityProvider("smithy.api#noAuth") || (async () => ({})), "identityProvider"),
            signer: new NoAuthSigner()
          }
        ],
        logger: config?.logger ?? new import_smithy_client2.NoOpLogger(),
        protocol: config?.protocol ?? AwsQueryProtocol,
        protocolSettings: config?.protocolSettings ?? {
          defaultNamespace: "com.amazonaws.sts",
          errorTypeRegistries,
          xmlNamespace: "https://sts.amazonaws.com/doc/2011-06-15/",
          version: "2011-06-15",
          serviceTarget: "AWSSecurityTokenServiceV20110615"
        },
        serviceId: config?.serviceId ?? "STS",
        urlParser: config?.urlParser ?? import_url_parser.parseUrl,
        utf8Decoder: config?.utf8Decoder ?? import_util_utf8.fromUtf8,
        utf8Encoder: config?.utf8Encoder ?? import_util_utf8.toUtf8
      };
    }, "getRuntimeConfig");
  }
});

// node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/runtimeConfig.js
var import_util_user_agent_node, import_config_resolver, import_hash_node, import_middleware_retry, import_node_config_provider, import_node_http_handler, import_smithy_client3, import_util_body_length_node, import_util_defaults_mode_node, import_util_retry, getRuntimeConfig2;
var init_runtimeConfig = __esm({
  "node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/runtimeConfig.js"() {
    init_esm();
    init_package();
    init_dist_es2();
    import_util_user_agent_node = __toESM(require_dist_cjs19());
    import_config_resolver = __toESM(require_dist_cjs13());
    init_dist_es();
    import_hash_node = __toESM(require_dist_cjs20());
    import_middleware_retry = __toESM(require_dist_cjs18());
    import_node_config_provider = __toESM(require_dist_cjs15());
    import_node_http_handler = __toESM(require_dist_cjs5());
    import_smithy_client3 = __toESM(require_dist_cjs6());
    import_util_body_length_node = __toESM(require_dist_cjs21());
    import_util_defaults_mode_node = __toESM(require_dist_cjs22());
    import_util_retry = __toESM(require_dist_cjs17());
    init_runtimeConfig_shared();
    getRuntimeConfig2 = /* @__PURE__ */ __name((config) => {
      (0, import_smithy_client3.emitWarningIfUnsupportedVersion)(process.version);
      const defaultsMode = (0, import_util_defaults_mode_node.resolveDefaultsModeConfig)(config);
      const defaultConfigProvider = /* @__PURE__ */ __name(() => defaultsMode().then(import_smithy_client3.loadConfigsForDefaultMode), "defaultConfigProvider");
      const clientSharedValues = getRuntimeConfig(config);
      emitWarningIfUnsupportedVersion(process.version);
      const loaderConfig = {
        profile: config?.profile,
        logger: clientSharedValues.logger
      };
      return {
        ...clientSharedValues,
        ...config,
        runtime: "node",
        defaultsMode,
        authSchemePreference: config?.authSchemePreference ?? (0, import_node_config_provider.loadConfig)(NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, loaderConfig),
        bodyLengthChecker: config?.bodyLengthChecker ?? import_util_body_length_node.calculateBodyLength,
        defaultUserAgentProvider: config?.defaultUserAgentProvider ?? (0, import_util_user_agent_node.createDefaultUserAgentProvider)({ serviceId: clientSharedValues.serviceId, clientVersion: package_default.version }),
        httpAuthSchemes: config?.httpAuthSchemes ?? [
          {
            schemeId: "aws.auth#sigv4",
            identityProvider: /* @__PURE__ */ __name((ipc) => ipc.getIdentityProvider("aws.auth#sigv4") || (async (idProps) => await config.credentialDefaultProvider(idProps?.__config || {})()), "identityProvider"),
            signer: new AwsSdkSigV4Signer()
          },
          {
            schemeId: "smithy.api#noAuth",
            identityProvider: /* @__PURE__ */ __name((ipc) => ipc.getIdentityProvider("smithy.api#noAuth") || (async () => ({})), "identityProvider"),
            signer: new NoAuthSigner()
          }
        ],
        maxAttempts: config?.maxAttempts ?? (0, import_node_config_provider.loadConfig)(import_middleware_retry.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, config),
        region: config?.region ?? (0, import_node_config_provider.loadConfig)(import_config_resolver.NODE_REGION_CONFIG_OPTIONS, { ...import_config_resolver.NODE_REGION_CONFIG_FILE_OPTIONS, ...loaderConfig }),
        requestHandler: import_node_http_handler.NodeHttpHandler.create(config?.requestHandler ?? defaultConfigProvider),
        retryMode: config?.retryMode ?? (0, import_node_config_provider.loadConfig)({
          ...import_middleware_retry.NODE_RETRY_MODE_CONFIG_OPTIONS,
          default: /* @__PURE__ */ __name(async () => (await defaultConfigProvider()).retryMode || import_util_retry.DEFAULT_RETRY_MODE, "default")
        }, config),
        sha256: config?.sha256 ?? import_hash_node.Hash.bind(null, "sha256"),
        streamCollector: config?.streamCollector ?? import_node_http_handler.streamCollector,
        useDualstackEndpoint: config?.useDualstackEndpoint ?? (0, import_node_config_provider.loadConfig)(import_config_resolver.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, loaderConfig),
        useFipsEndpoint: config?.useFipsEndpoint ?? (0, import_node_config_provider.loadConfig)(import_config_resolver.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, loaderConfig),
        userAgentAppId: config?.userAgentAppId ?? (0, import_node_config_provider.loadConfig)(import_util_user_agent_node.NODE_APP_ID_CONFIG_OPTIONS, loaderConfig)
      };
    }, "getRuntimeConfig");
  }
});

// node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/auth/httpAuthExtensionConfiguration.js
var getHttpAuthExtensionConfiguration, resolveHttpAuthRuntimeConfig;
var init_httpAuthExtensionConfiguration = __esm({
  "node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/auth/httpAuthExtensionConfiguration.js"() {
    init_esm();
    getHttpAuthExtensionConfiguration = /* @__PURE__ */ __name((runtimeConfig) => {
      const _httpAuthSchemes = runtimeConfig.httpAuthSchemes;
      let _httpAuthSchemeProvider = runtimeConfig.httpAuthSchemeProvider;
      let _credentials = runtimeConfig.credentials;
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
        setHttpAuthSchemeProvider(httpAuthSchemeProvider) {
          _httpAuthSchemeProvider = httpAuthSchemeProvider;
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
    resolveHttpAuthRuntimeConfig = /* @__PURE__ */ __name((config) => {
      return {
        httpAuthSchemes: config.httpAuthSchemes(),
        httpAuthSchemeProvider: config.httpAuthSchemeProvider(),
        credentials: config.credentials()
      };
    }, "resolveHttpAuthRuntimeConfig");
  }
});

// node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/runtimeExtensions.js
var import_region_config_resolver, import_protocol_http, import_smithy_client4, resolveRuntimeExtensions;
var init_runtimeExtensions = __esm({
  "node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/runtimeExtensions.js"() {
    init_esm();
    import_region_config_resolver = __toESM(require_dist_cjs24());
    import_protocol_http = __toESM(require_dist_cjs());
    import_smithy_client4 = __toESM(require_dist_cjs6());
    init_httpAuthExtensionConfiguration();
    resolveRuntimeExtensions = /* @__PURE__ */ __name((runtimeConfig, extensions) => {
      const extensionConfiguration = Object.assign((0, import_region_config_resolver.getAwsRegionExtensionConfiguration)(runtimeConfig), (0, import_smithy_client4.getDefaultExtensionConfiguration)(runtimeConfig), (0, import_protocol_http.getHttpHandlerExtensionConfiguration)(runtimeConfig), getHttpAuthExtensionConfiguration(runtimeConfig));
      extensions.forEach((extension) => extension.configure(extensionConfiguration));
      return Object.assign(runtimeConfig, (0, import_region_config_resolver.resolveAwsRegionExtensionConfiguration)(extensionConfiguration), (0, import_smithy_client4.resolveDefaultRuntimeConfig)(extensionConfiguration), (0, import_protocol_http.resolveHttpHandlerRuntimeConfig)(extensionConfiguration), resolveHttpAuthRuntimeConfig(extensionConfiguration));
    }, "resolveRuntimeExtensions");
  }
});

// node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/STSClient.js
var import_middleware_host_header, import_middleware_logger, import_middleware_recursion_detection, import_middleware_user_agent, import_config_resolver2, import_middleware_content_length, import_middleware_endpoint, import_middleware_retry2, import_smithy_client5, STSClient;
var init_STSClient = __esm({
  "node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/STSClient.js"() {
    init_esm();
    import_middleware_host_header = __toESM(require_dist_cjs7());
    import_middleware_logger = __toESM(require_dist_cjs8());
    import_middleware_recursion_detection = __toESM(require_dist_cjs9());
    import_middleware_user_agent = __toESM(require_dist_cjs12());
    import_config_resolver2 = __toESM(require_dist_cjs13());
    init_dist_es();
    init_schema();
    import_middleware_content_length = __toESM(require_dist_cjs14());
    import_middleware_endpoint = __toESM(require_dist_cjs16());
    import_middleware_retry2 = __toESM(require_dist_cjs18());
    import_smithy_client5 = __toESM(require_dist_cjs6());
    init_httpAuthSchemeProvider();
    init_EndpointParameters();
    init_runtimeConfig();
    init_runtimeExtensions();
    STSClient = class extends import_smithy_client5.Client {
      static {
        __name(this, "STSClient");
      }
      config;
      constructor(...[configuration]) {
        const _config_0 = getRuntimeConfig2(configuration || {});
        super(_config_0);
        this.initConfig = _config_0;
        const _config_1 = resolveClientEndpointParameters(_config_0);
        const _config_2 = (0, import_middleware_user_agent.resolveUserAgentConfig)(_config_1);
        const _config_3 = (0, import_middleware_retry2.resolveRetryConfig)(_config_2);
        const _config_4 = (0, import_config_resolver2.resolveRegionConfig)(_config_3);
        const _config_5 = (0, import_middleware_host_header.resolveHostHeaderConfig)(_config_4);
        const _config_6 = (0, import_middleware_endpoint.resolveEndpointConfig)(_config_5);
        const _config_7 = resolveHttpAuthSchemeConfig(_config_6);
        const _config_8 = resolveRuntimeExtensions(_config_7, configuration?.extensions || []);
        this.config = _config_8;
        this.middlewareStack.use(getSchemaSerdePlugin(this.config));
        this.middlewareStack.use((0, import_middleware_user_agent.getUserAgentPlugin)(this.config));
        this.middlewareStack.use((0, import_middleware_retry2.getRetryPlugin)(this.config));
        this.middlewareStack.use((0, import_middleware_content_length.getContentLengthPlugin)(this.config));
        this.middlewareStack.use((0, import_middleware_host_header.getHostHeaderPlugin)(this.config));
        this.middlewareStack.use((0, import_middleware_logger.getLoggerPlugin)(this.config));
        this.middlewareStack.use((0, import_middleware_recursion_detection.getRecursionDetectionPlugin)(this.config));
        this.middlewareStack.use(getHttpAuthSchemeEndpointRuleSetPlugin(this.config, {
          httpAuthSchemeParametersProvider: defaultSTSHttpAuthSchemeParametersProvider,
          identityProviderConfigProvider: /* @__PURE__ */ __name(async (config) => new DefaultIdentityProviderConfig({
            "aws.auth#sigv4": config.credentials
          }), "identityProviderConfigProvider")
        }));
        this.middlewareStack.use(getHttpSigningPlugin(this.config));
      }
      destroy() {
        super.destroy();
      }
    };
  }
});

// node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/commands/AssumeRoleCommand.js
var import_middleware_endpoint2, import_smithy_client6, AssumeRoleCommand;
var init_AssumeRoleCommand = __esm({
  "node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/commands/AssumeRoleCommand.js"() {
    init_esm();
    import_middleware_endpoint2 = __toESM(require_dist_cjs16());
    import_smithy_client6 = __toESM(require_dist_cjs6());
    init_EndpointParameters();
    init_schemas_0();
    AssumeRoleCommand = class extends import_smithy_client6.Command.classBuilder().ep(commonParams).m(function(Command, cs, config, o2) {
      return [(0, import_middleware_endpoint2.getEndpointPlugin)(config, Command.getEndpointParameterInstructions())];
    }).s("AWSSecurityTokenServiceV20110615", "AssumeRole", {}).n("STSClient", "AssumeRoleCommand").sc(AssumeRole$).build() {
      static {
        __name(this, "AssumeRoleCommand");
      }
    };
  }
});

// node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/commands/AssumeRoleWithWebIdentityCommand.js
var import_middleware_endpoint3, import_smithy_client7, AssumeRoleWithWebIdentityCommand;
var init_AssumeRoleWithWebIdentityCommand = __esm({
  "node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/commands/AssumeRoleWithWebIdentityCommand.js"() {
    init_esm();
    import_middleware_endpoint3 = __toESM(require_dist_cjs16());
    import_smithy_client7 = __toESM(require_dist_cjs6());
    init_EndpointParameters();
    init_schemas_0();
    AssumeRoleWithWebIdentityCommand = class extends import_smithy_client7.Command.classBuilder().ep(commonParams).m(function(Command, cs, config, o2) {
      return [(0, import_middleware_endpoint3.getEndpointPlugin)(config, Command.getEndpointParameterInstructions())];
    }).s("AWSSecurityTokenServiceV20110615", "AssumeRoleWithWebIdentity", {}).n("STSClient", "AssumeRoleWithWebIdentityCommand").sc(AssumeRoleWithWebIdentity$).build() {
      static {
        __name(this, "AssumeRoleWithWebIdentityCommand");
      }
    };
  }
});

// node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/STS.js
var import_smithy_client8, commands, STS;
var init_STS = __esm({
  "node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/STS.js"() {
    init_esm();
    import_smithy_client8 = __toESM(require_dist_cjs6());
    init_AssumeRoleCommand();
    init_AssumeRoleWithWebIdentityCommand();
    init_STSClient();
    commands = {
      AssumeRoleCommand,
      AssumeRoleWithWebIdentityCommand
    };
    STS = class extends STSClient {
      static {
        __name(this, "STS");
      }
    };
    (0, import_smithy_client8.createAggregatedClient)(commands, STS);
  }
});

// node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/commands/index.js
var init_commands = __esm({
  "node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/commands/index.js"() {
    init_esm();
    init_AssumeRoleCommand();
    init_AssumeRoleWithWebIdentityCommand();
  }
});

// node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/models/models_0.js
var init_models_0 = __esm({
  "node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/models/models_0.js"() {
    init_esm();
  }
});

// node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/defaultStsRoleAssumers.js
var import_region_config_resolver2, getAccountIdFromAssumedRoleUser, resolveRegion, getDefaultRoleAssumer, getDefaultRoleAssumerWithWebIdentity, isH2;
var init_defaultStsRoleAssumers = __esm({
  "node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/defaultStsRoleAssumers.js"() {
    init_esm();
    init_client();
    import_region_config_resolver2 = __toESM(require_dist_cjs24());
    init_AssumeRoleCommand();
    init_AssumeRoleWithWebIdentityCommand();
    getAccountIdFromAssumedRoleUser = /* @__PURE__ */ __name((assumedRoleUser) => {
      if (typeof assumedRoleUser?.Arn === "string") {
        const arnComponents = assumedRoleUser.Arn.split(":");
        if (arnComponents.length > 4 && arnComponents[4] !== "") {
          return arnComponents[4];
        }
      }
      return void 0;
    }, "getAccountIdFromAssumedRoleUser");
    resolveRegion = /* @__PURE__ */ __name(async (_region, _parentRegion, credentialProviderLogger, loaderConfig = {}) => {
      const region = typeof _region === "function" ? await _region() : _region;
      const parentRegion = typeof _parentRegion === "function" ? await _parentRegion() : _parentRegion;
      let stsDefaultRegion = "";
      const resolvedRegion = region ?? parentRegion ?? (stsDefaultRegion = await (0, import_region_config_resolver2.stsRegionDefaultResolver)(loaderConfig)());
      credentialProviderLogger?.debug?.("@aws-sdk/client-sts::resolveRegion", "accepting first of:", `${region} (credential provider clientConfig)`, `${parentRegion} (contextual client)`, `${stsDefaultRegion} (STS default: AWS_REGION, profile region, or us-east-1)`);
      return resolvedRegion;
    }, "resolveRegion");
    getDefaultRoleAssumer = /* @__PURE__ */ __name((stsOptions, STSClient2) => {
      let stsClient;
      let closureSourceCreds;
      return async (sourceCreds, params) => {
        closureSourceCreds = sourceCreds;
        if (!stsClient) {
          const { logger = stsOptions?.parentClientConfig?.logger, profile = stsOptions?.parentClientConfig?.profile, region, requestHandler = stsOptions?.parentClientConfig?.requestHandler, credentialProviderLogger, userAgentAppId = stsOptions?.parentClientConfig?.userAgentAppId } = stsOptions;
          const resolvedRegion = await resolveRegion(region, stsOptions?.parentClientConfig?.region, credentialProviderLogger, {
            logger,
            profile
          });
          const isCompatibleRequestHandler = !isH2(requestHandler);
          stsClient = new STSClient2({
            ...stsOptions,
            userAgentAppId,
            profile,
            credentialDefaultProvider: /* @__PURE__ */ __name(() => async () => closureSourceCreds, "credentialDefaultProvider"),
            region: resolvedRegion,
            requestHandler: isCompatibleRequestHandler ? requestHandler : void 0,
            logger
          });
        }
        const { Credentials, AssumedRoleUser } = await stsClient.send(new AssumeRoleCommand(params));
        if (!Credentials || !Credentials.AccessKeyId || !Credentials.SecretAccessKey) {
          throw new Error(`Invalid response from STS.assumeRole call with role ${params.RoleArn}`);
        }
        const accountId = getAccountIdFromAssumedRoleUser(AssumedRoleUser);
        const credentials = {
          accessKeyId: Credentials.AccessKeyId,
          secretAccessKey: Credentials.SecretAccessKey,
          sessionToken: Credentials.SessionToken,
          expiration: Credentials.Expiration,
          ...Credentials.CredentialScope && { credentialScope: Credentials.CredentialScope },
          ...accountId && { accountId }
        };
        setCredentialFeature(credentials, "CREDENTIALS_STS_ASSUME_ROLE", "i");
        return credentials;
      };
    }, "getDefaultRoleAssumer");
    getDefaultRoleAssumerWithWebIdentity = /* @__PURE__ */ __name((stsOptions, STSClient2) => {
      let stsClient;
      return async (params) => {
        if (!stsClient) {
          const { logger = stsOptions?.parentClientConfig?.logger, profile = stsOptions?.parentClientConfig?.profile, region, requestHandler = stsOptions?.parentClientConfig?.requestHandler, credentialProviderLogger, userAgentAppId = stsOptions?.parentClientConfig?.userAgentAppId } = stsOptions;
          const resolvedRegion = await resolveRegion(region, stsOptions?.parentClientConfig?.region, credentialProviderLogger, {
            logger,
            profile
          });
          const isCompatibleRequestHandler = !isH2(requestHandler);
          stsClient = new STSClient2({
            ...stsOptions,
            userAgentAppId,
            profile,
            region: resolvedRegion,
            requestHandler: isCompatibleRequestHandler ? requestHandler : void 0,
            logger
          });
        }
        const { Credentials, AssumedRoleUser } = await stsClient.send(new AssumeRoleWithWebIdentityCommand(params));
        if (!Credentials || !Credentials.AccessKeyId || !Credentials.SecretAccessKey) {
          throw new Error(`Invalid response from STS.assumeRoleWithWebIdentity call with role ${params.RoleArn}`);
        }
        const accountId = getAccountIdFromAssumedRoleUser(AssumedRoleUser);
        const credentials = {
          accessKeyId: Credentials.AccessKeyId,
          secretAccessKey: Credentials.SecretAccessKey,
          sessionToken: Credentials.SessionToken,
          expiration: Credentials.Expiration,
          ...Credentials.CredentialScope && { credentialScope: Credentials.CredentialScope },
          ...accountId && { accountId }
        };
        if (accountId) {
          setCredentialFeature(credentials, "RESOLVED_ACCOUNT_ID", "T");
        }
        setCredentialFeature(credentials, "CREDENTIALS_STS_ASSUME_ROLE_WEB_ID", "k");
        return credentials;
      };
    }, "getDefaultRoleAssumerWithWebIdentity");
    isH2 = /* @__PURE__ */ __name((requestHandler) => {
      return requestHandler?.metadata?.handlerProtocol === "h2";
    }, "isH2");
  }
});

// node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/defaultRoleAssumers.js
var getCustomizableStsClientCtor, getDefaultRoleAssumer2, getDefaultRoleAssumerWithWebIdentity2, decorateDefaultCredentialProvider;
var init_defaultRoleAssumers = __esm({
  "node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/defaultRoleAssumers.js"() {
    init_esm();
    init_defaultStsRoleAssumers();
    init_STSClient();
    getCustomizableStsClientCtor = /* @__PURE__ */ __name((baseCtor, customizations) => {
      if (!customizations)
        return baseCtor;
      else
        return class CustomizableSTSClient extends baseCtor {
          static {
            __name(this, "CustomizableSTSClient");
          }
          constructor(config) {
            super(config);
            for (const customization of customizations) {
              this.middlewareStack.use(customization);
            }
          }
        };
    }, "getCustomizableStsClientCtor");
    getDefaultRoleAssumer2 = /* @__PURE__ */ __name((stsOptions = {}, stsPlugins) => getDefaultRoleAssumer(stsOptions, getCustomizableStsClientCtor(STSClient, stsPlugins)), "getDefaultRoleAssumer");
    getDefaultRoleAssumerWithWebIdentity2 = /* @__PURE__ */ __name((stsOptions = {}, stsPlugins) => getDefaultRoleAssumerWithWebIdentity(stsOptions, getCustomizableStsClientCtor(STSClient, stsPlugins)), "getDefaultRoleAssumerWithWebIdentity");
    decorateDefaultCredentialProvider = /* @__PURE__ */ __name((provider) => (input) => provider({
      roleAssumer: getDefaultRoleAssumer2(input),
      roleAssumerWithWebIdentity: getDefaultRoleAssumerWithWebIdentity2(input),
      ...input
    }), "decorateDefaultCredentialProvider");
  }
});

// node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/index.js
var sts_exports = {};
__export(sts_exports, {
  AssumeRole$: () => AssumeRole$,
  AssumeRoleCommand: () => AssumeRoleCommand,
  AssumeRoleRequest$: () => AssumeRoleRequest$,
  AssumeRoleResponse$: () => AssumeRoleResponse$,
  AssumeRoleWithWebIdentity$: () => AssumeRoleWithWebIdentity$,
  AssumeRoleWithWebIdentityCommand: () => AssumeRoleWithWebIdentityCommand,
  AssumeRoleWithWebIdentityRequest$: () => AssumeRoleWithWebIdentityRequest$,
  AssumeRoleWithWebIdentityResponse$: () => AssumeRoleWithWebIdentityResponse$,
  AssumedRoleUser$: () => AssumedRoleUser$,
  Credentials$: () => Credentials$,
  ExpiredTokenException: () => ExpiredTokenException,
  ExpiredTokenException$: () => ExpiredTokenException$,
  IDPCommunicationErrorException: () => IDPCommunicationErrorException,
  IDPCommunicationErrorException$: () => IDPCommunicationErrorException$,
  IDPRejectedClaimException: () => IDPRejectedClaimException,
  IDPRejectedClaimException$: () => IDPRejectedClaimException$,
  InvalidIdentityTokenException: () => InvalidIdentityTokenException,
  InvalidIdentityTokenException$: () => InvalidIdentityTokenException$,
  MalformedPolicyDocumentException: () => MalformedPolicyDocumentException,
  MalformedPolicyDocumentException$: () => MalformedPolicyDocumentException$,
  PackedPolicyTooLargeException: () => PackedPolicyTooLargeException,
  PackedPolicyTooLargeException$: () => PackedPolicyTooLargeException$,
  PolicyDescriptorType$: () => PolicyDescriptorType$,
  ProvidedContext$: () => ProvidedContext$,
  RegionDisabledException: () => RegionDisabledException,
  RegionDisabledException$: () => RegionDisabledException$,
  STS: () => STS,
  STSClient: () => STSClient,
  STSServiceException: () => STSServiceException,
  STSServiceException$: () => STSServiceException$,
  Tag$: () => Tag$,
  __Client: () => import_smithy_client5.Client,
  decorateDefaultCredentialProvider: () => decorateDefaultCredentialProvider,
  errorTypeRegistries: () => errorTypeRegistries,
  getDefaultRoleAssumer: () => getDefaultRoleAssumer2,
  getDefaultRoleAssumerWithWebIdentity: () => getDefaultRoleAssumerWithWebIdentity2
});
var init_sts = __esm({
  "node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/index.js"() {
    init_esm();
    init_STSClient();
    init_STS();
    init_commands();
    init_schemas_0();
    init_errors();
    init_models_0();
    init_defaultRoleAssumers();
    init_STSServiceException();
  }
});

export {
  STSServiceException,
  ExpiredTokenException,
  MalformedPolicyDocumentException,
  PackedPolicyTooLargeException,
  RegionDisabledException,
  IDPRejectedClaimException,
  InvalidIdentityTokenException,
  IDPCommunicationErrorException,
  STSServiceException$,
  ExpiredTokenException$,
  IDPCommunicationErrorException$,
  IDPRejectedClaimException$,
  InvalidIdentityTokenException$,
  MalformedPolicyDocumentException$,
  PackedPolicyTooLargeException$,
  RegionDisabledException$,
  errorTypeRegistries,
  AssumedRoleUser$,
  AssumeRoleRequest$,
  AssumeRoleResponse$,
  AssumeRoleWithWebIdentityRequest$,
  AssumeRoleWithWebIdentityResponse$,
  Credentials$,
  PolicyDescriptorType$,
  ProvidedContext$,
  Tag$,
  AssumeRole$,
  AssumeRoleWithWebIdentity$,
  import_smithy_client5 as import_smithy_client,
  STSClient,
  AssumeRoleCommand,
  AssumeRoleWithWebIdentityCommand,
  STS,
  getDefaultRoleAssumer2 as getDefaultRoleAssumer,
  getDefaultRoleAssumerWithWebIdentity2 as getDefaultRoleAssumerWithWebIdentity,
  decorateDefaultCredentialProvider,
  sts_exports,
  init_sts
};
//# sourceMappingURL=chunk-WMJKHVOP.mjs.map
