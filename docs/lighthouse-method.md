# Standard Lighthouse method

## Fixed lab profile

- Lighthouse 13.6.0 with Chromium 152.
- Use the same shared `audit:preview` harness, category selection, viewport, and network profile for every comparison.
- Mobile viewport: 360 × 800 CSS pixels. Desktop viewport: 1350 × 940 CSS pixels.
- Simulated network: 150 ms RTT, 1,600 Kbps download, and 750 Kbps upload.
- Simulated CPU slowdown: 4×.
- Run five measured navigations per route/device/environment and report the median for category scores, FCP, LCP, TBT, CLS, and Speed Index.
- Do not use development-server results or mix results from different Lighthouse/Chromium versions.

Lighthouse navigation runs do not produce a valid field INP measurement. Report INP as unavailable unless route-level field data is present; do not substitute TBT and call it INP. These routes do not use React hydration: client routes mount with `createRoot`, while Reports and About are static-first and do not mount React. Report hydration as not applicable; use client boot/main-thread measures for client-rendered routes.

## Local and deployed runs

From `artifacts/global-ai-news`, run the production-like local build and preview:

```sh
LIGHTHOUSE_RUNS=5 pnpm run audit:preview
```

For the deployed baseline, use the primary deployed URL returned by the deployment service. Current primary URL: `https://www.globalainews.in`.

```sh
LIGHTHOUSE_ROUTES='/,/brief/,/reports/,/topic/india/,/topic/ai/,/about-us/,/code-of-ethics/,/corrections/,/research/' \
PREVIEW_AUDIT_URL=https://www.globalainews.in LIGHTHOUSE_RUNS=5 pnpm run audit:preview
```

No deployment is performed by either command. The current deployed build returns 404 for the ten local staging routes, so the deployed matrix covers the nine public routes; all ten staged articles are measured in the local production-like matrix. `LIGHTHOUSE_DEVICES=mobile` may be used for mobile-only diagnostic runs; route filters must not be used to narrow a required route matrix. Final reports use all available routes and both devices unless the task explicitly requests a narrower result.

The runner preserves the existing pass thresholds: Performance 95, Accessibility 95, and Best Practices 70 for both devices. It reports scores and Web Vitals even when a threshold fails. Record LCP, TBT, CLS, the LCP element and the highest-impact failed performance audits when diagnosing a route. Keep any temporary raw reports outside checked-in source files.
