# Global AI News: how to write an article that ranks and gets read

Every article is one Markdown file in `src/content/articles/<slug>.md`. The file name is the URL: `/article/<slug>/` (or `/reports/<slug>/` for `type: "guide"`).

## 1. Front matter template

```yaml
---
title: "Gemini 4 Carbon: Who Gets Google’s Cyber Model First, and What Its Benchmarks Really Show"
seoTitle: "Gemini 4 Carbon: Access, Benchmarks and What’s Missing"   # <= 60 chars, used in <title>
description: "Google DeepMind is giving Gemini 4 Carbon to cyber defenders first, with no date for a wider release. We explain the access tiers and where each benchmark score comes from."  # 120–160 chars
category: "models"        # models | policy | india | infrastructure | safety | business | research | guides
tags: ["Google DeepMind", "Gemini", "Cybersecurity"]
date: "2026-11-05T07:30:00Z"   # publish time; future dates stay hidden until a rebuild after that time
updated: "2026-11-06"          # only for substantive updates
reviewer: "Aman Mishra"        # only a real person who actually checked the piece
image: "/images/articles/<slug>/hero-1200x675.webp"   # 1200x675, < 150 KB
imageAlt: "Describe what the image shows"
takeaways:
  - "Three to five full-sentence facts a reader could repeat to a colleague."
  - "Lead with the number, date or decision. No hedging words in takeaways."
  - "Each takeaway must be supported in the body."
---
```

`npm run build` refuses to publish an article whose front matter is missing or out of range, and fails on duplicate titles or descriptions, broken internal links and images without alt text.

## 2. Headlines that earn the click (and match what people search)

Write the headline a reader would type into Google, then add the hook.

| Pattern | Example |
|---|---|
| **Named thing + “Explained” + the real question** | India’s AI Rules Explained: What Is Already Law, and What Is Still Only Expected |
| **The number + what it really means** | GitHub Octoverse 2026: AI Agents Now Start 40% of Pull Requests. Here’s What That Really Means |
| **Direct question readers are asking** | Should You Give an AI Agent Your Password? |
| **X vs Y (year)** | ChatGPT vs Claude vs Gemini vs Copilot: AI Assistants Compared (2026) |
| **Date guide** | EU AI Act Deadlines 2026–2028: The Date-by-Date Guide |
| **Myth-busting** | Did AI Really Cause the Microsoft Job Cuts? What the Evidence Shows |

Rules:
- Put the main entity (company, product, law) in the first five words.
- Use specific numbers and dates. “40%”, “10,000”, “2 December 2026” are better than “many” or “soon”.
- The headline must be fully supported by the article. Never imply something the sources don’t say.
- Avoid: “Preprint links …”, “… remains the test”, “… is not one deadline”. Those phrases are accurate but nobody searches for them.

## 3. Article structure

1. **The bottom line** (first H2): answer the headline question in the first 2–3 sentences, with the key number or date. Google often uses this as the snippet.
2. **Key facts / what happened**: dates, numbers, who said what. A table works well.
3. **The explainer sections**: H2s phrased like the questions readers have (“Who controls the board?”, “Which systems follow the 2027 date?”).
4. **What this means for…** developers, businesses, readers in India, and so on.
5. **What we don’t know yet / what to watch next**: 3–5 bullets.
6. **FAQ**: 4–6 real questions as H3s, each answered in 2–4 sentences. These win “People also ask”.
7. **Sources**: a numbered list with publisher, title, date and URL. Cite as `[1]`, `[2]` in the text.
8. **Methodology note**: how the piece was researched; say if research or drafting was AI-assisted.

Length: 1,200–2,500 words for explainers, 2,000–4,000 for big reference pieces. Length is not the goal; answering the question completely is.

## 4. Tone: confident, precise, not defensive

The 2026 drafts were accurate but over-hedged. Readers and Google both reward clear answers.

- Say each caveat **once**, where it matters, not in every paragraph.
- Attribute instead of hedging: “Google says…” is enough. You don’t also need “this is a vendor claim, not independent verification” after every sentence.
- Prefer active voice and short sentences. Lead paragraphs with the fact, not the qualification.
- Bad: “This does not establish that every downstream action is appropriate, nor does it…”
- Good: “A broker hides the password. It doesn’t decide what the agent is allowed to do. That still needs scoped permissions.”

## 5. Internal linking

- Link to 2–4 related Global AI News articles in the body where they genuinely help, using descriptive anchor text (“our guide to EU AI Act deadlines”, not “click here”).
- Only link to articles that are already live on (or before) your article’s publish date. `npm run test:schedule` will catch mistakes.
- The layout already adds category links, breadcrumbs, share buttons and “Read next”.
- No hero image? Run `node scripts/make-cards.mjs` to generate a branded hero and social card.

## 6. Images

- Hero: 1200×675 WebP, under 150 KB. Charts and illustrations are fine; don’t present AI images as photos of real events.
- In-body charts: SVG in `public/images/articles/<slug>/`, with a `<details><summary>View data</summary>` table under each.
- Every image needs meaningful alt text.

## 7. Publishing checklist

- [ ] Headline answers a real search query and is supported by the article
- [ ] `seoTitle` ≤ 60 characters; `description` 120–160 characters
- [ ] Bottom line answers the question in the first 3 sentences
- [ ] 3–5 takeaways, each backed by the body
- [ ] Every number has a date, unit and source
- [ ] FAQ with 4–6 questions
- [ ] Sources list complete; links work
- [ ] 2–4 internal links
- [ ] No links to articles that aren't published yet
- [ ] `npm run build` and `npm run test:schedule` pass
