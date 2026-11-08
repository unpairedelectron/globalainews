# Deploying the new Global AI News site: GitHub → Replit → live

Follow the steps in order. Each step says how to check it worked before you move on.

```
[1] Push to GitHub → [2] Merge into main → [3] Replit pulls main → [4] Edit settings
→ [5] Build and preview in Replit → [6] Republish → [7] Check live site → [8] Google
```

---

## Step 1: Get the changes onto GitHub

The changes are on the branch **`claude/fervent-dijkstra-w85ppw`**. Claude's push was refused because Claude doesn't have access to the repo. Use either option.

### Option A (easiest): give Claude access, then let Claude push
1. Open https://claude.ai/connect-github and connect (or reconnect) your GitHub account.
2. Open https://github.com/apps/claude/installations/select_target, choose the account that owns **unpairedelectron/globalainews**, and grant access to that repository.
3. Tell Claude: "access fixed, push now".

### Option B: push it yourself from your computer
Download `globalainews-overhaul.bundle` (sent in the chat), then:

```bash
git clone https://github.com/unpairedelectron/globalainews.git
```
```bash
cd globalainews
```
```bash
git fetch /path/to/globalainews-overhaul.bundle claude/fervent-dijkstra-w85ppw:claude/fervent-dijkstra-w85ppw
```
```bash
git push -u origin claude/fervent-dijkstra-w85ppw
```

✅ **Check:** https://github.com/unpairedelectron/globalainews/branches lists `claude/fervent-dijkstra-w85ppw`.

---

## Step 2: Merge into `main` on GitHub

1. Open https://github.com/unpairedelectron/globalainews/compare/main...claude/fervent-dijkstra-w85ppw
2. Click **Create pull request**, then **Merge pull request**, then **Confirm merge**.

✅ **Check:** https://github.com/unpairedelectron/globalainews/tree/main has a `site/` folder plus `SITE-OVERHAUL.md` and `DEPLOY-ON-REPLIT.md`.

---

## Step 3: Pull the latest `main` into Replit

1. Open your Replit project at https://replit.com (the one that publishes globalainews.in).
2. Open the **Shell** (left sidebar → **Tools** → **Shell**, or search "Shell" in the search bar).
3. First check that Replit has no unsaved local changes:
   ```bash
   git status
   ```
   - If it says **"nothing to commit, working tree clean"**, continue.
   - If files are listed, save them first so nothing is lost:
     ```bash
     git stash
     ```
4. Get the latest code:
   ```bash
   git checkout main
   ```
   ```bash
   git pull origin main
   ```

(You can also use the **Git** tool in the left sidebar: **Fetch**, then **Pull**. The Shell commands above do the same thing.)

✅ **Check:**
```bash
ls site && git log --oneline -3
```
You should see `site/` contents and the commit *"Rebuild Global AI News as a static, AdSense-ready news site"*.

---

## Step 4: Confirm your details (2 minutes)

In Replit's file tree, open **`site/src/site.config.ts`** and check:

| Setting | Current value | What to do |
|---|---|---|
| `publisher.name` | Shiv Shakti Mishra | Keep, or change to the real owner or company |
| `publisher.location` | Pune, Maharashtra, India | Keep or change |
| `publisher.email` | samfischer14aug@gmail.com | Keep, or use a domain email such as editor@globalainews.in |

Articles also show **"Reviewed by Aman Mishra"**. If that's not right, delete the `reviewer:` line from the top of each file in `site/src/content/articles/`.

If you changed anything, commit it so GitHub stays in sync:
```bash
git add -A && git commit -m "Confirm publisher details" && git push origin main
```

---

## Step 5: Build and preview in Replit (dev)

1. In the Shell, run the same build that production uses:
   ```bash
   cd site && npm ci --no-audit --no-fund && npm run build
   ```
   ✅ **Check:** the last lines say **`Checked 35 pages.`** and **`SEO checks passed.`**
   ❌ If you see `ERROR ...`, copy the output and send it to Claude.

2. Start the production server locally and test redirects:
   ```bash
   PORT=3000 node server.mjs
   ```
   Open a **second** Shell tab and run:
   ```bash
   curl -s -o /dev/null -w "%{http_code}\n" localhost:3000/
   ```
   ```bash
   curl -s -o /dev/null -w "%{http_code} -> %{redirect_url}\n" localhost:3000/article/antibiotic/
   ```
   ✅ **Check:** the first prints `200`; the second prints `301 -> .../article/ai-models-antibiotic-discovery/`.
   Stop the server with **Ctrl + C** in the first tab.

3. See it in the browser: press **Run** at the top. The Run button now builds the new site. Then open the **Preview** (Webview) for "Global AI News", which serves the new site on port 19819. If the preview still shows the old site, run this in the Shell and open the Preview again:
   ```bash
   cd ~/workspace/site && npx astro dev --host 0.0.0.0 --port 19819
   ```
   ✅ **Check in the preview:**
   - The home page shows the "Anthropic’s IPO Filing Explained…" lead story.
   - The top menu shows Latest · AI Models · Policy & Regulation · India AI · …
   - The footer has About us, Editorial policy, Contact, Privacy policy, Terms of use, Disclaimer.
   - Open any article: you see "Key takeaways", charts, and a Sources list at the end.

---

## Step 6: Republish on Replit

1. Click **Publish** (top right of the Replit workspace). This opens the **Publishing** pane.
2. Check that the deployment is the one linked to **www.globalainews.in** (shown under domains).
3. Click **Republish** (or **Publish** if that's the only button).
4. Watch the build logs. The web build runs `cd site && npm ci && npm run build`.
   ✅ **Check:** the logs contain **`SEO checks passed.`** and the status becomes **Published / Running**.
   ❌ If it fails, copy the log and send it to Claude. The live site stays on the old version until a build succeeds, so a failed build does not take the site down.

---

## Step 7: Check the live site

Open each link (use a private/incognito window to avoid cached pages):

| Link | You should see |
|---|---|
| https://www.globalainews.in/ | The new home page |
| https://www.globalainews.in/article/anthropic-s1-governance-who-controls/ | Article with Key takeaways and Sources |
| https://www.globalainews.in/privacy/ | Privacy policy |
| https://www.globalainews.in/about-us/ | About page |
| https://www.globalainews.in/sitemap.xml | XML list of about 33 URLs |
| https://www.globalainews.in/ads.txt | `google.com, pub-3766621537317806, DIRECT, f08c47fec0942fa0` |
| https://www.globalainews.in/robots.txt | Lists both sitemaps |
| https://www.globalainews.in/article/antibiotic/ | Redirects to the ProteoGPT article |
| https://globalainews.in/ | Redirects to https://www.globalainews.in/ |

Also run:
- **Google Rich Results Test:** https://search.google.com/test/rich-results with an article URL. ✅ It should detect "Article" and "Breadcrumbs".
- **PageSpeed Insights:** https://pagespeed.web.dev/ with the home page and one article.

---

## Step 8: Tell Google (same day)

### Search Console: https://search.google.com/search-console
1. Select the property for globalainews.in. If you only have a URL-prefix property, add a **Domain** property (`globalainews.in`) as well.
2. **Security & Manual actions → Manual actions:** if there is a penalty, click **Request review** and explain: fake author profiles removed, privacy/terms/about/contact published, thin pages removed or redirected, 23 sourced articles, editorial policy added.
3. **Sitemaps:** remove old entries, then submit `sitemap.xml` and `news-sitemap.xml`.
4. **URL Inspection:** paste each URL below and click **Request indexing**: the home page, `/about-us/`, `/privacy/`, `/editorial-policy/`, and your 5–10 best articles.
5. Check **Pages** weekly for new "Not found (404)" errors and send them to Claude to add redirects.

### AdSense: https://www.google.com/adsense/
1. **Privacy & messaging → European regulations → Create message → Publish.** This is required for visitors in Europe and the UK, and the new privacy policy says it's shown.
2. **Ads → By site → globalainews.in:** make sure **Auto ads** is on.
3. **Sites:** check ads.txt status says **Authorized** (it can take a few days after publishing).
4. **Don't request a review yet.** Publish 3–4 new articles a week for about 4 weeks, until there are 35 or more, then click **Request review**.

---

## Step 9: Scheduled articles go live automatically

Articles with a future `date` publish themselves: the production server checks every 5 minutes and rebuilds the site when a publish time passes. You don't need to Republish. Afterwards, request indexing for the new article in Search Console → URL Inspection.

Replit autoscale can sleep when there's no traffic. The rebuild then happens a few seconds after the next visitor arrives, so the first visitor may still see the previous version.

## Adding a new article later

1. Create `site/src/content/articles/<your-slug>.md` (copy an existing one; see `site/CONTENT-GUIDE.md`).
2. In the Shell, run `cd site && npm run build && npm run test:schedule` and check that everything passes.
3. Commit and push: `git add -A && git commit -m "Add article: <title>" && git push origin main`
4. **Publish → Republish.**

## If something goes wrong: rollback

The old app's code was not deleted. To switch back, run this in the Replit Shell (`6188ea0` is the last commit before the rebuild):
```bash
git checkout 6188ea0 -- artifacts/global-ai-news/.replit-artifact/artifact.toml .replit
```
Then **Publish → Republish**.
