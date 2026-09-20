# Global AI News visual baselines

These PNGs are the downloadable release-review baselines for the five key public
surfaces in both supported themes:

- `homepage`
- `article-ai-models-antibiotic-discovery`
- `industry-map`
- `brief`
- `newsroom`

The smoke test captures each route at a deterministic 1440 × 1000 viewport and
compares it with ImageMagick `compare`. A 2% pixel fuzz is applied before
counting differences, and up to 28,800 differing pixels (2% of the viewport)
are tolerated for browser antialiasing. A larger difference fails the test.

Run the normal smoke workflow to compare captures:

```sh
pnpm --filter @workspace/global-ai-news run test:smoke
```

When an intentional visual change is ready to become the new release baseline,
refresh the files explicitly:

```sh
pnpm --filter @workspace/global-ai-news run update:visual-baselines
```

Do not refresh baselines to hide an unexpected regression. When comparison
fails, the captured image is retained in `screenshots/failures/` and the test
output identifies its route, theme, and path for review. Failure artifacts are
local review output and are not committed.