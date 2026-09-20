# Global AI News Intelligence System

The shared visual language for Global AI News.

## Principles

- Readability before decoration: long-form type, generous leading, clear measure.
- Institutional confidence: thin rules, restrained color, explicit source and evidence language.
- One signal color: electric blue is reserved for action, links, and directional emphasis.
- Editorial contrast: serif headlines carry authority; grotesk and mono text support scanning.
- No generic dashboard chrome: data appears as context, timelines, maps, and evidence rather than equal card grids.
- Calm motion: transitions clarify state and hierarchy, with reduced-motion support.

`tokens.json` is the source for the light and dark theme values used by the application CSS.

## Theme tokens

The UI uses semantic HSL variables so components do not need separate color values for each mode:

| Variable | Light role | Dark role |
| --- | --- | --- |
| `--background` / `--foreground` | Warm ivory / near-black ink | Deep blue-black / warm ivory |
| `--surface` / `--surface-muted` | White cards / soft stone panels | Slate cards / deep slate panels |
| `--primary` / `--primary-foreground` | Restrained electric blue / white | Light electric blue / blue-black |
| `--secondary` / `--secondary-foreground` | Cool gray-blue / ink | Slate / ivory |
| `--muted` / `--muted-foreground` | Quiet surfaces / readable gray | Quiet slate / light gray |
| `--accent` / `--accent-foreground` | Editorial gold / ink | Warm gold / blue-black |
| `--border` / `--ring` | Thin rules / blue focus ring | Visible slate rules / bright blue focus ring |
| `--success`, `--warning`, `--danger` | Status colors with dark text or white text | Brighter status colors for dark surfaces |

`ThemeProvider` persists the reader’s choice under `global-ai-news-theme`, applies `.dark` to the document root, and follows the operating system preference until a reader chooses a mode. The header toggle is keyboard accessible and uses `color-scheme` so native form controls follow the active palette.