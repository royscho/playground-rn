# Step 7 — CI/CD, GitHub Actions & Fastlane

## Task

Wire up three GitHub Actions workflows (PR CI, staging deploy, release deploy), Fastlane lanes for iOS and Android, multi-variant builds (separate bundle ID + app name per env), and typed env schema via react-native-config.

## Files to create / modify

| File                                                | Status                         |
| --------------------------------------------------- | ------------------------------ |
| `.github/workflows/ci.yml`                          | new                            |
| `.github/workflows/staging.yml`                     | new                            |
| `.github/workflows/release.yml`                     | new                            |
| `fastlane/Fastfile`                                 | new                            |
| `fastlane/Appfile`                                  | new                            |
| `Gemfile`                                           | modified (add `fastlane`)      |
| `.env`                                              | modified (extend schema)       |
| `.env.staging`                                      | modified (extend schema)       |
| `.env.production`                                   | modified (extend schema)       |
| `src/shared/types/env.d.ts`                         | new                            |
| `android/app/build.gradle`                          | modified (add product flavors) |
| `android/app/src/staging/res/values/strings.xml`    | new                            |
| `android/app/src/production/res/values/strings.xml` | new                            |
| `docs/steps/08-cicd/design.md`                      | new                            |

iOS build configurations (Staging + Release) are set up via a Fastlane `setup_ios_configs` lane using the `xcodeproj` gem (already in Gemfile). Run once locally — not part of CI.

## ScreenWrapper config

N/A — no UI screens in this step.

## State approach

N/A — no app state changes.

## Props drilling check

N/A.

## Navigation wiring

None.

## Libraries used

| Need                     | Tool                                                                           |
| ------------------------ | ------------------------------------------------------------------------------ |
| iOS build automation     | Fastlane `build_app`, `upload_to_testflight`, `increment_build_number`         |
| Android build automation | Fastlane `gradle` action                                                       |
| iOS multi-variant        | Xcode build configurations (Staging / Release) via `xcodeproj` gem             |
| Android multi-variant    | Gradle product flavors (`staging`, `production`)                               |
| Code signing (iOS)       | Fastlane `match` (commented — requires Apple Dev account)                      |
| Sentry source maps       | `upload_symbols_to_sentry` Fastlane action                                     |
| CI runtime               | GitHub Actions (`ubuntu-latest` for Android/JS; `macos-latest` for iOS/bundle) |
| Env switching            | `react-native-config` + `ENVFILE` env var                                      |
| Dependency audit         | `yarn audit`                                                                   |
| Coverage gate            | Jest `--coverageThreshold`                                                     |

## Env schema

Same keys across all three files — values differ per environment:

```bash
# .env / .env.staging / .env.production
API_BASE_URL=https://jsonplaceholder.typicode.com
APP_ENV=development          # development | staging | production
SENTRY_DSN=
SENTRY_ORG=
SENTRY_PROJECT=
CODEPUSH_SERVER_URL=http://localhost:3000
SOCKET_IO_URL=http://localhost:4000
```

TypeScript typed via `src/shared/types/env.d.ts`:

```ts
declare module 'react-native-config' {
  export interface NativeConfig {
    API_BASE_URL: string;
    APP_ENV: 'development' | 'staging' | 'production';
    SENTRY_DSN: string;
    SENTRY_ORG: string;
    SENTRY_PROJECT: string;
    CODEPUSH_SERVER_URL: string;
    SOCKET_IO_URL: string;
  }
  const Config: NativeConfig;
  export default Config;
}
```

Vars also available natively on iOS via `Info.plist` `$(VAR_NAME)` references — react-native-config exports them as Xcode build settings automatically.

## Multi-variant builds

### iOS — build configurations

Two configurations in `ios/Playground.xcodeproj`:

| Config    | Bundle ID                | Display name   |
| --------- | ------------------------ | -------------- |
| `Staging` | `com.playground.staging` | Playground STG |
| `Release` | `com.playground`         | Playground     |

Set up via `fastlane ios setup_ios_configs` (one-time, local only). Uses the `xcodeproj` gem to duplicate the Release configuration and set per-config bundle ID + display name overrides in `Info.plist`.

Fastlane `staging` lane uses `configuration: "Staging"` + `ENVFILE=.env.staging`.
Fastlane `beta` lane uses `configuration: "Release"` + `ENVFILE=.env.production`.

### Android — product flavors

`android/app/build.gradle`:

```groovy
flavorDimensions "env"
productFlavors {
    staging {
        dimension "env"
        applicationId "com.playground.staging"
        versionNameSuffix "-staging"
        resValue "string", "app_name", "Playground STG"
    }
    production {
        dimension "env"
        applicationId "com.playground"
        resValue "string", "app_name", "Playground"
    }
}
```

Staging build task: `bundleStagingRelease`. Production build task: `bundleProductionRelease`.

Per-flavor `strings.xml` overrides app name (backup for launchers that read it directly):

- `android/app/src/staging/res/values/strings.xml` → `<string name="app_name">Playground STG</string>`
- `android/app/src/production/res/values/strings.xml` → `<string name="app_name">Playground</string>`

## Workflow breakdown

### `ci.yml` — triggers on PR and push to `main`

Jobs run in parallel. `lint`, `typecheck`, `test`, `audit` on `ubuntu-latest`. `bundle` on `macos-latest`.

```
lint       → yarn lint
typecheck  → yarn tsc --noEmit
test       → yarn test --ci --coverage --coverageThreshold='{"global":{"lines":70}}'
audit      → yarn audit --level moderate
bundle     → ENVFILE=.env npx react-native-bundle-visualizer --platform ios --dev false  (informational — no hard size gate)
```

PR blocks on lint/typecheck/test/audit failure. Bundle job fails only if bundle cannot be built.

### `staging.yml` — triggers on push to `main`

Parallel: `macos-latest` (iOS) + `ubuntu-latest` (Android).

- iOS: `ENVFILE=.env.staging fastlane ios staging` → `.ipa` as GitHub artifact
- Android: `ENVFILE=.env.staging fastlane android staging` → `.aab` as GitHub artifact
- Store upload lanes commented out by default

### `release.yml` — triggers on git tag `v*.*.*`

Parallel: `macos-latest` (iOS) + `ubuntu-latest` (Android).

- iOS: `ENVFILE=.env.production fastlane ios beta` → build + Sentry source maps + (commented) TestFlight
- Android: `ENVFILE=.env.production fastlane android deploy` → build + (commented) Play Internal
- OTA: commented — requires code-push-server setup

## Fastlane lanes

### `Fastfile`

```ruby
platform :ios do
  lane :setup_ios_configs do
    # One-time local setup: creates Staging build configuration with separate bundle ID
    # Run: bundle exec fastlane ios setup_ios_configs
    require 'xcodeproj'
    project = Xcodeproj::Project.open('ios/Playground.xcodeproj')
    # ... duplicate Release → Staging, set bundle ID override, set display name
    project.save
  end

  lane :test do
    run_tests(scheme: "PlaygroundTests")
  end

  lane :staging do
    # ENVFILE=.env.staging set by caller (CI or local)
    increment_build_number(xcodeproj: "ios/Playground.xcodeproj")
    build_app(scheme: "Playground", configuration: "Staging", export_method: "development")
    # upload_to_testflight  ← uncomment when Apple Dev account ready
  end

  lane :beta do
    # ENVFILE=.env.production set by caller
    increment_build_number(xcodeproj: "ios/Playground.xcodeproj")
    build_app(scheme: "Playground", configuration: "Release")
    # upload_to_testflight  ← uncomment when Apple Dev account ready
    upload_symbols_to_sentry(
      auth_token: ENV["SENTRY_AUTH_TOKEN"],
      org_slug: ENV["SENTRY_ORG"],
      project_slug: ENV["SENTRY_PROJECT"],
    )
  end
end

platform :android do
  lane :staging do
    # ENVFILE=.env.staging set by caller
    gradle(task: "bundle", flavor: "staging", build_type: "Release", project_dir: "android/")
    # upload_to_play_store(track: "internal")  ← uncomment when Play account ready
  end

  lane :deploy do
    # ENVFILE=.env.production set by caller
    gradle(task: "bundle", flavor: "production", build_type: "Release", project_dir: "android/")
    # upload_to_play_store(track: "internal")  ← uncomment when Play account ready
  end
end
```

### `Appfile`

```ruby
app_identifier("com.playground")
apple_id(ENV["APPLE_ID"])
team_id(ENV["APPLE_TEAM_ID"])
```

### Gemfile additions

```ruby
gem 'fastlane'
```

(`xcodeproj` already present in Gemfile)

## Secrets required (GitHub Actions)

None required for CI (lint/test/typecheck/bundle). Staging and release lanes need:

| Secret              | Used in                       |
| ------------------- | ----------------------------- |
| `APPLE_ID`          | Fastlane Appfile              |
| `APPLE_TEAM_ID`     | Fastlane Appfile              |
| `MATCH_PASSWORD`    | Fastlane match (when enabled) |
| `SENTRY_AUTH_TOKEN` | Sentry source map upload      |
| `SENTRY_ORG`        | Sentry source map upload      |
| `SENTRY_PROJECT`    | Sentry source map upload      |

All upload/signing steps commented by default — CI and local lanes run without secrets.

## Dark/light mode

N/A.

## Commit message

`ci: GitHub Actions workflows, Fastlane lanes, and multi-variant builds`
