# Changelog

## [2.3.6](https://github.com/keq-request/keq-cache/compare/v2.3.5...v2.3.6) (2025-12-10)


### Bug Fixes

* oidc npm publish ([f858014](https://github.com/keq-request/keq-cache/commit/f858014ce492d574e76b381e009b1a76f11a68c2))

## [2.3.5](https://github.com/keq-request/keq-cache/compare/v2.3.4...v2.3.5) (2025-12-10)


### Bug Fixes

* oidc npm publish ([67c0bfa](https://github.com/keq-request/keq-cache/commit/67c0bfa4486ad03a1c34934500f83c9f69ae7418))

## [2.3.4](https://github.com/keq-request/keq-cache/compare/v2.3.3...v2.3.4) (2025-12-10)


### Bug Fixes

* oidc npm publish ([9e63498](https://github.com/keq-request/keq-cache/commit/9e63498134003b419594b605344a7d54318e1872))

## [2.3.3](https://github.com/keq-request/keq-cache/compare/v2.3.2...v2.3.3) (2025-12-10)


### Bug Fixes

* oidc npm publish ([2132165](https://github.com/keq-request/keq-cache/commit/2132165470d4bb8b64eaa5809ed66e31ad3c47c2))

## [2.3.2](https://github.com/keq-request/keq-cache/compare/v2.3.1...v2.3.2) (2025-12-10)


### Bug Fixes

* unable publish ([1473eb5](https://github.com/keq-request/keq-cache/commit/1473eb5a0572fa73a151f40631f579214a59483b))

## [2.3.1](https://github.com/keq-request/keq-cache/compare/v2.3.0...v2.3.1) (2025-12-10)


### Performance Improvements

* humanize print table ([0fac0bf](https://github.com/keq-request/keq-cache/commit/0fac0bf1f34989eb37908f9522f49882bad9e36e))

## [2.3.0](https://github.com/keq-request/keq-cache/compare/v2.2.1...v2.3.0) (2025-12-09)


### Features

* add print method to display cache data ([513c519](https://github.com/keq-request/keq-cache/commit/513c51908cc18f6f9271e649fd80492b3a4ffcf2))

## [2.2.1](https://github.com/keq-request/keq-cache/compare/v2.2.0...v2.2.1) (2025-11-05)


### Performance Improvements

* add context to onCacheHit and onCacheMiss ([fa20404](https://github.com/keq-request/keq-cache/commit/fa2040482d585794cda2196b5e1cde57bb555759))

## [2.2.0](https://github.com/keq-request/keq-cache/compare/v2.1.3...v2.2.0) (2025-10-24)


### Features

* add onCacheHit and onCacheMiss hook ([b8e0a3d](https://github.com/keq-request/keq-cache/commit/b8e0a3d5268398320e5ff80428492eccb20d2d6f))


### Bug Fixes

* global configuration is not be inherited if use .options ([35a973c](https://github.com/keq-request/keq-cache/commit/35a973c45858aedcac5a08fdec6fb3e78fde316a))


### Performance Improvements

* rules.pattern accept boolean and default true ([270425d](https://github.com/keq-request/keq-cache/commit/270425d992c3b5b5c30e0644ffa3482d44019751))

## [2.1.3](https://github.com/keq-request/keq-cache/compare/v2.1.2...v2.1.3) (2025-09-25)


### Bug Fixes

* update Strategy enum to include CACHE_FIRST and deprecate CATCH_FIRST ([e69cef7](https://github.com/keq-request/keq-cache/commit/e69cef775af9bf0f2512102c0f3acf62b36dcef3))

## [2.1.2](https://github.com/keq-request/keq-cache/compare/v2.1.1...v2.1.2) (2025-09-25)


### Bug Fixes

* wrong esm import ([f10cf47](https://github.com/keq-request/keq-cache/commit/f10cf4769144a8c205209437388565f1dc7c7096))

## [2.1.1](https://github.com/keq-request/keq-cache/compare/v2.1.0...v2.1.1) (2025-07-11)


### Bug Fixes

* missing .js ext ([609631a](https://github.com/keq-request/keq-cache/commit/609631af7334fa41f42b9607137c61be1435e29e))

## [2.1.0](https://github.com/keq-request/keq-cache/compare/v2.0.0...v2.1.0) (2025-07-03)


### Features

* add MultiTierStorage ([07a293b](https://github.com/keq-request/keq-cache/commit/07a293b75689c33ee05f31bd3446856244f83aa4))
* add TierStorage ([02ceb48](https://github.com/keq-request/keq-cache/commit/02ceb4885f8a413fddd9fa732c0a2223a809b1f5))
* custom strategy ([3053306](https://github.com/keq-request/keq-cache/commit/3053306cfa408b9ed72a1d5fbbb9d4bbdfe7e816))


### Bug Fixes

* wrong class name ([91989ea](https://github.com/keq-request/keq-cache/commit/91989eaeb1241d16128f08351f95b7b1b1c9fd22))

## [2.0.0](https://github.com/keq-request/keq-cache/compare/v1.2.2...v2.0.0) (2025-05-26)


### ⚠ BREAKING CHANGES

* maxStorageSize and threshold is removed, please use size parameter of Storage

### Features

* custom storage support ([bebd310](https://github.com/keq-request/keq-cache/commit/bebd3106c735fcb5b12142a3d1c19025806a2098))


### Bug Fixes

* memory storage does not specify the isolation scope ([99da6d7](https://github.com/keq-request/keq-cache/commit/99da6d7c23b2b91eb12075195a5d55ae1021fab0))

## [1.2.2](https://github.com/keq-request/keq-cache/compare/v1.2.1...v1.2.2) (2025-04-27)


### Performance Improvements

* skip cache if indexed-db not work ([45ccbd8](https://github.com/keq-request/keq-cache/commit/45ccbd8d42ce7bf14fc03f98b7a8ce162c61e43d)), closes [#10](https://github.com/keq-request/keq-cache/issues/10)

## [1.2.1](https://github.com/keq-request/keq-cache/compare/v1.2.0...v1.2.1) (2025-04-23)


### Bug Fixes

* should not add proxy to indexed db ([02b5442](https://github.com/keq-request/keq-cache/commit/02b54429856f4e343cd04d98cfb78a1d99e31249))

## [1.2.0](https://github.com/keq-request/keq-cache/compare/v1.1.0...v1.2.0) (2025-04-22)


### Features

* add exclude options used exlcude the response should not be cached ([4f6aa79](https://github.com/keq-request/keq-cache/commit/4f6aa793b4aa671695ee1e792dcf1de83b66b37b))


### Bug Fixes

* response is consumed abnormally ([3b6d204](https://github.com/keq-request/keq-cache/commit/3b6d204f94982219e27f751b162396bd1ff27548))

## [1.1.0](https://github.com/keq-request/keq-cache/compare/v1.0.6...v1.1.0) (2025-04-18)


### Features

* add onNetworkResponse event ([d9b94d0](https://github.com/keq-request/keq-cache/commit/d9b94d0e5d3dd172d48c8228ba51ad32d1eeee41))

## [1.0.6](https://github.com/keq-request/keq-cache/compare/v1.0.5...v1.0.6) (2025-04-16)


### Bug Fixes

* cannot find idb package ([b33e267](https://github.com/keq-request/keq-cache/commit/b33e267b7eb845e9e78c2ccb5d2a33db0ee7973a))

## [1.0.5](https://github.com/keq-request/keq-cache/compare/v1.0.4...v1.0.5) (2025-04-16)


### Bug Fixes

* cannot find idb package ([031f453](https://github.com/keq-request/keq-cache/commit/031f45358713cff0fe95a13613c2bf8b72fcb5c8))

## [1.0.4](https://github.com/keq-request/keq-cache/compare/v1.0.3...v1.0.4) (2024-11-25)


### Bug Fixes

* indexed-db not work ([187ed1f](https://github.com/keq-request/keq-cache/commit/187ed1ff399ca681a683c2b4d615963aced202b8))

## [1.0.3](https://github.com/keq-request/keq-cache/compare/v1.0.2...v1.0.3) (2024-11-19)


### Bug Fixes

* update import statements to include file extensions for esm ([f7118ee](https://github.com/keq-request/keq-cache/commit/f7118eeb2913ce48dc2bc53c99b831d52ecb8098))

## [1.0.2](https://github.com/keq-request/keq-cache/compare/v1.0.1...v1.0.2) (2024-11-19)


### Bug Fixes

* update import statements to include file extensions for esm ([49ed02f](https://github.com/keq-request/keq-cache/commit/49ed02f64e15f14a04c8f54281b913545db97af2))

## 1.0.1 (2024-11-18)


### Bug Fixes

* ctx.options.cache not working ([4f327eb](https://github.com/keq-request/keq-cache/commit/4f327eb887698b51cb44ebe4742f9e79a94fa30d))
* update cache strategy handling to enforce required strategy option ([7798327](https://github.com/keq-request/keq-cache/commit/77983270544286046ab47df11b39c054fa84164e))


### Miscellaneous Chores

* release 1.0.1 ([6dcfd9d](https://github.com/keq-request/keq-cache/commit/6dcfd9d94ad82f0726d5c4031291ece719bd766c))
