# Step 1 — Architecture, Path Aliases, Env Config, Pre-commit Hooks

## Task
Establish the full project skeleton: feature folder structure, `@/` TypeScript path aliases, `react-native-config` env files, and Husky + lint-staged + commitlint pre-commit hooks.

## Files to create

### Folder scaffold (`.gitkeep` files to preserve empty dirs)
- `src/app/navigation/.gitkeep`
- `src/app/providers/.gitkeep`
- `src/features/.gitkeep`
- `src/shared/components/.gitkeep`
- `src/shared/hooks/.gitkeep`
- `src/shared/api/.gitkeep`
- `src/shared/theme/.gitkeep`
- `src/shared/utils/.gitkeep`
- `src/shared/types/.gitkeep`

### Config files (create / modify)
- `tsconfig.json` — add `baseUrl` + `paths` for `@/*` alias
- `babel.config.js` — add `babel-plugin-module-resolver` for runtime alias resolution
- `metro.config.js` — add `resolver.extraNodeModules` to mirror alias (needed for Metro bundler)
- `.env` — development defaults
- `.env.staging` — staging overrides
- `.env.production` — production overrides
- `commitlint.config.js` — enforces `type(scope): description` format
- `.lintstagedrc.js` — runs eslint + tsc on staged files
- `.husky/pre-commit` — runs lint-staged
- `.husky/commit-msg` — runs commitlint

### Package.json changes
- Add `prepare` script: `husky`
- Add devDependencies:
  - `husky` (^9)
  - `lint-staged` (^15)
  - `@commitlint/cli` + `@commitlint/config-conventional`
  - `babel-plugin-module-resolver`
- Add `react-native-config` to dependencies

## ScreenWrapper config
Not applicable — this step has no UI screens.

## State approach
Not applicable — this step has no state.

## Props drilling check
Not applicable.

## Navigation wiring
Not applicable — navigation will be wired in step 2.

## Libraries used

| Need | Library |
|---|---|
| Path alias (runtime) | `babel-plugin-module-resolver` |
| Path alias (types) | `tsconfig.json` `paths` |
| Env variables | `react-native-config` |
| Pre-commit hooks | `husky` v9 |
| Staged file linting | `lint-staged` |
| Commit message linting | `@commitlint/cli` + `@commitlint/config-conventional` |

## Dark/light mode
Not applicable.

## Path alias detail

`@/` maps to `./src/`:

```ts
// tsconfig.json paths
"@/*": ["src/*"]

// babel-plugin-module-resolver
alias: { '@': './src' }
```

Usage example:
```ts
import { Button } from '@/shared/components/Button';
import { useAuthStore } from '@/features/auth/store/authStore';
```

## Env file shape

```bash
# .env (development)
API_BASE_URL=https://jsonplaceholder.typicode.com
APP_ENV=development

# .env.staging
API_BASE_URL=https://jsonplaceholder.typicode.com
APP_ENV=staging

# .env.production
API_BASE_URL=https://jsonplaceholder.typicode.com
APP_ENV=production
```

`react-native-config` is accessed via:
```ts
import Config from 'react-native-config';
Config.API_BASE_URL // typed via @types/react-native-config or a custom types file
```

## commitlint format enforced

```
<type>(<scope>): <description>

type: feat | fix | chore | test | ci | dx | refactor | docs
scope: auth | posts | todos | navigation | theme | forms | animations |
       realtime | webview | notifications | performance | offline |
       analytics | a11y | i18n | storage | native | ci | dx
```

## Commit message
`chore(dx): architecture, path aliases, env config, pre-commit hooks`
