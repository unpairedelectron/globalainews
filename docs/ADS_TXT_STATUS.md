# ads.txt status

The application serves the configured publisher declaration as `text/plain; charset=utf-8` at `/ads.txt`. Release builds verify that the source file exactly matches `ADSENSE_PUBLISHER_ID`, and the smoke test checks the generated output and both canonical hosts.

## Checks to complete outside the code

1. In Replit Domains, confirm that both `globalainews.in` and `www.globalainews.in` are linked to this app.
2. In AdSense, use **Check for updates** after the app owner chooses to publish this change.

No deployment or production setting was changed as part of this work.
