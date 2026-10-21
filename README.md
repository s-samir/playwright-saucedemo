# SauceDemo Automation Training Project (Playwright + TypeScript)

Page Object Model, custom fixtures and `.env`-driven config for https://www.saucedemo.com.

## Setup

```bash
npm install
npx playwright install        # downloads Chromium, Firefox and WebKit
# .env is included (SauceDemo's credentials are public). Keep using .env.example as the committed template.
```

## Run

| Command | What it does |
|---|---|
| `npm test` | Full suite on Chromium, plus the `@smoke` tests on Firefox and WebKit |
| `npm run test:smoke` | Only `@smoke` tests, on all three browsers |
| `npm run test:chromium` | Everything, Chromium only |
| `npm run test:ui` | Interactive UI mode (best for learning and debugging) |
| `npm run snapshots:update` | Create/refresh visual baselines (required before `visual.spec.ts` can pass) |
| `npm run report` | Open the HTML report |
| `npm run typecheck` | `tsc --noEmit` |

## Layout

```
pages/       Page objects (locators + actions, no test logic)
fixtures/    Extended `test` that provides page objects, loginAs() and loggedInInventoryPage
utils/       env.ts (.env access), testData.ts, helpers.ts, flows.ts, assertions.ts, types.ts
tests/       auth/ inventory/ product-details/ cart/ checkout/ e2e/ navigation/
             special-users/ non-functional/ smoke/
```

## Things worth knowing

- **Known-defect tests use `test.fail()`.** The special users (`problem_user`, `performance_glitch_user`,
  `error_user`, `visual_user`), whitespace-only checkout fields and empty-cart checkout assert the *correct*
  behavior and are marked as expected failures. They show green while the defect exists. If one reports
  "expected to fail but passed", the app was fixed: delete its `test.fail(...)` line.
- **Accessibility** (`axe-core`) fails only on *critical* violations; the full list is attached to each test in the HTML report.
- **Visual snapshots** are OS-specific. Generate baselines on the machine/CI image that will run the suite.
- **Selectors** use SauceDemo's `data-test` attributes (`testIdAttribute: 'data-test'` in the config).
  If a site change breaks one, fix it in the page object only; tests do not contain selectors.
