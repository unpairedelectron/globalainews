#!/usr/bin/env bash
# Read-only verification of the Global AI News overhaul. Usage: bash verify.sh [BASE_URL]
BASE="${1:-https://www.globalainews.in}"
P=0; F=0; W=0
ok(){ echo "PASS  $1"; P=$((P+1)); }
bad(){ echo "FAIL  $1"; F=$((F+1)); }
info(){ echo "INFO  $1"; W=$((W+1)); }
code(){ curl -s -o /dev/null -w "%{http_code}" "$BASE$1"; }
get(){ curl -s "$BASE$1"; }

echo "== A. Repository (run inside the Replit workspace) =="
if [ -d .git ]; then
  for c in 2679976 70629ad; do git merge-base --is-ancestor $c HEAD 2>/dev/null && ok "commit $c is in HEAD" || bad "commit $c missing from HEAD"; done
  n=$(ls site/src/content/articles/*.md 2>/dev/null | wc -l); [ "$n" -ge 23 ] && ok "$n article files" || bad "article files: $n (expected at least 23)"
  for f in site/server.mjs site/redirects.mjs site/src/site.config.ts site/package-lock.json SITE-OVERHAUL.md DEPLOY-ON-REPLIT.md; do [ -f "$f" ] && ok "file $f" || bad "missing $f"; done
  A=artifacts/global-ai-news/.replit-artifact/artifact.toml
  grep -q 'cd site && npm ci --no-audit --no-fund && npm run build' $A && ok "artifact build uses site/" || bad "artifact build command not updated"
  grep -q '"node", "site/server.mjs"' $A && ok "artifact runs node site/server.mjs" || bad "artifact run command not updated"
  grep -q 'cd site && npm ci --no-audit --no-fund && npm run build' .replit && ok ".replit Run builds site/" || bad ".replit Run still old"
else info "not in a git workspace; skipping repo checks"; fi

echo "== B. Pages that must return 200 =="
for u in / /latest/ /models/ /policy/ /india/ /infrastructure/ /safety/ /business/ /research/ /reports/ \
  /about-us/ /editorial-policy/ /contact-us/ /privacy/ /terms/ /disclaimer/ \
  /article/anthropic-s1-governance-who-controls/ /article/gated-frontier-models-gemini-4-carbon/ \
  /article/github-octoverse-2026-agents-pull-requests/ /article/india-ai-consultation-paper-what-is-law/ \
  /article/india-ai-compute-access-2026/ /article/weekly-deep-dive-cost-of-intelligence/ /article/reliability-is-the-new-ai-moat/ \
  /article/study-finds-word-cues-can-override-game-theory-choices-in-llms/ /article/ai-models-antibiotic-discovery/ \
  /article/quiet-race-watermark-everything-ai-makes/ /article/small-models-serious-workflows/ \
  /reports/ai-assistants-compared/ /reports/ai-image-tools-compared/ /reports/coding-agent-benchmarks-compared/ \
  /reports/hosted-vs-open-weight-models/ /reports/indiaai-vs-commercial-cloud/ /reports/provenance-controls-compared/ \
  /sitemap.xml /news-sitemap.xml /feed.xml /robots.txt /ads.txt; do
  c=$(code $u); [ "$c" = 200 ] && ok "$u 200" || bad "$u returned $c"; done

echo "== C. Trust pages indexable (no noindex) =="
for u in /about-us/ /editorial-policy/ /contact-us/ /privacy/ /terms/ /disclaimer/; do
  get $u | grep -q 'name="robots" content="noindex' && bad "$u is noindex" || ok "$u indexable"; done
get /privacy/ | grep -q 'adssettings.google.com' && ok "privacy policy has Google ad-cookie opt-out" || bad "privacy policy missing AdSense disclosure"

echo "== D. New site is live (not the old React app) =="
H=$(get /)
echo "$H" | grep -q 'id="root"></div>' && bad "home page is still the old React shell" || ok "home is static HTML (old app gone)"
echo "$H" | grep -q 'AI news, explained with the sources' && ok "new tagline present" || bad "new tagline missing"
echo "$H" | grep -q 'adsbygoogle.js?client=ca-pub-3766621537317806' && ok "AdSense script on home" || bad "AdSense script missing on home"
echo "$H" | grep -q 'name="google-adsense-account" content="ca-pub-3766621537317806"' && ok "AdSense account meta" || bad "AdSense account meta missing"
for n in "Mira Patel" "Jonas Rhee" "Ananya Rao" "Ishaan Mehta" "Lena Hoff" "David Okafor"; do
  echo "$H" | grep -q "$n" && bad "fake author '$n' on home" || true; done; ok "no fake author names on home"

echo "== E. Article page quality =="
A=$(get /article/anthropic-s1-governance-who-controls/)
echo "$A" | grep -q '"@type":"NewsArticle"' && ok "NewsArticle JSON-LD" || bad "NewsArticle JSON-LD missing"
echo "$A" | grep -q '"@type":"BreadcrumbList"' && ok "Breadcrumb JSON-LD" || bad "Breadcrumb JSON-LD missing"
echo "$A" | grep -q 'Key takeaways' && ok "Key takeaways box" || bad "Key takeaways missing"
echo "$A" | grep -q 'Long-Term Benefit Trust' && ok "full article text in raw HTML" || bad "article text not in HTML"
echo "$A" | grep -q 'rel="canonical" href="https://www.globalainews.in/article/anthropic-s1-governance-who-controls/"' && ok "canonical correct" || bad "canonical wrong"
echo "$A" | grep -q 'property="og:image"' && ok "og:image present" || bad "og:image missing"
echo "$A" | grep -q 'adsbygoogle.js' && ok "AdSense script on article" || bad "AdSense missing on article"
echo "$A" | grep -q 'Global AI News Desk' && ok "desk byline" || bad "desk byline missing"
c=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/images/articles/anthropic-s1-governance-who-controls/class-rights-matrix.svg"); [ "$c" = 200 ] && ok "article chart image loads" || bad "chart image $c"

echo "== F. Redirects (301) =="
chk(){ r=$(curl -s -o /dev/null -w "%{http_code} %{redirect_url}" "$BASE$1"); case "$r" in "301 "*"$2") ok "$1 -> $2";; *) bad "$1 gave '$r' (expected 301 -> $2)";; esac; }
chk /article/antibiotic/ /article/ai-models-antibiotic-discovery/
chk /article/indias-public-ai-stack/ /article/india-ai-compute-access-2026/
chk /article/founders-first-million-model-calls/ /article/reliability-is-the-new-ai-moat/
chk /amp/article/small-models-serious-workflows/ /article/small-models-serious-workflows/
chk /code-of-ethics/ /editorial-policy/
chk /brief/ /latest/
chk /contact/ /contact-us/
chk /models /models/
c=$(code /this-page-does-not-exist/); [ "$c" = 404 ] && ok "unknown URL returns 404" || bad "unknown URL returned $c"
if [ "$BASE" = "https://www.globalainews.in" ]; then
  r=$(curl -s -o /dev/null -w "%{http_code} %{redirect_url}" https://globalainews.in/); case "$r" in 30*" https://www.globalainews.in/") ok "apex -> www";; *) bad "apex gave '$r'";; esac
fi

echo "== G. Crawl files =="
ads=$(get /ads.txt); [ "$(echo "$ads" | tr -d '\r\n')" = "google.com, pub-3766621537317806, DIRECT, f08c47fec0942fa0" ] && ok "ads.txt exact" || bad "ads.txt: $ads"
R=$(get /robots.txt); echo "$R" | grep -q 'Sitemap: https://www.globalainews.in/sitemap.xml' && ok "robots lists sitemap" || bad "robots missing sitemap"
echo "$R" | grep -qx 'Disallow: /' && bad "robots blocks the whole site" || ok "robots does not block site"
S=$(get /sitemap.xml); n=$(echo "$S" | grep -o '<loc>' | wc -l); [ "$n" -ge 33 ] && ok "sitemap has $n URLs (>=33)" || bad "sitemap has $n URLs"
echo "$S" | grep -q glucosmart && bad "glucosmart in sitemap" || ok "glucosmart not in sitemap"
get /feed.xml | grep -q '<rss' && ok "RSS feed valid" || bad "RSS feed invalid"

echo "== H. GlucoSmart page kept but hidden =="
G=$(get /glucosmart-privacy/)
echo "$G" | grep -q 'GlucoSmart Privacy Policy' && ok "glucosmart page exists" || bad "glucosmart page missing"
echo "$G" | grep -q 'content="noindex' && ok "glucosmart noindex" || bad "glucosmart indexable"
echo "$G" | grep -q 'adsbygoogle.js' && bad "glucosmart shows ads" || ok "glucosmart has no ads"

echo "== I. Scheduled articles (appear after the first republish on/after each date) =="
now=$(date -u +%s)
for e in hyperscaler-capex-2026-reconciled:2026-11-09 openai-containment-incident-offline-training:2026-11-11 \
  indiaai-10000-gpu-tender-explained:2026-11-13 eu-ai-act-december-2026-deadlines:2026-11-16 \
  ai-in-workforce-plans-october-2026:2026-11-18 ai-agents-delegated-access-banks-passwords:2026-11-20; do
  s=${e%%:*}; d=${e##*:}; t=$(date -u -d "${d}T07:30:00Z" +%s); c=$(code /article/$s/)
  if [ $now -lt $t ]; then [ "$c" = 404 ] && ok "$s hidden until $d" || bad "$s visible before $d ($c)";
  else [ "$c" = 200 ] && ok "$s live" || info "$s due $d but returns $c: Republish to publish it"; fi
done

c=$(code /healthz); [ "$c" = 200 ] && ok "/healthz 200" || info "/healthz returned $c (fine on Replit: the edge does not expose it; the internal health check is what matters)"
echo "== J. Performance headers =="
curl -s -D - -o /dev/null -H 'Accept-Encoding: gzip' "$BASE/" | grep -qi '^content-encoding: gzip' && ok "gzip enabled" || info "no gzip header (a proxy may compress instead)"

echo; echo "RESULT: $P passed, $F failed, $W info"
[ $F -eq 0 ]
