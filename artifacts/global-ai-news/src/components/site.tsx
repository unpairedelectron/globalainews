import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { ArrowUpRight, Bookmark, BookmarkCheck, Menu, Moon, Search, Share2, Sun, X } from 'lucide-react';
import { useLocation } from 'wouter';
import { Link } from '@/components/canonical-link';
import { canonicalStorySlug, findStory, getPublicDateModified, getPublicStoryDek, getStoryAuthorIdentity, getStoryReadTime, timelineEvents, uniqueStoriesByCanonicalSlug } from '@/content';
import { formatEditorialDate, getLatestStory, isWithinLatestWindow } from '@/editorial-date';
import { useNewsroomSnapshot } from '@/newsroom';
import { useTheme } from '@/theme';
import { useSubscribeNewsletter } from '@workspace/api-client-react';
import { getCanonicalUrl, getSeoMetadata, getStructuredData, SITE_URL } from '@/seo-metadata';
import { getQualifiedSectionNavigation } from '@/content-rules';
import { GlobalAiNewsLockup } from '@/components/brand-mark';
import { AdSlot } from '@/components/monetization';
import { trackEvent } from '@/analytics';
import { handoffSearchQuery } from '@/search-handoff';
import { EDITORIAL_IMAGE_FALLBACK, getEditorialImagePath } from '@/editorial-images';

export const SITE = SITE_URL;

export function SeoHead({ title, description, path, article = false, indexable = true }: { title: string; description: string; path: string; article?: boolean; indexable?: boolean }) {
  const [currentLocation] = useLocation();
  const snapshot = useNewsroomSnapshot();
  const routeMetadata = path.startsWith('/amp/')
    ? undefined
    : getSeoMetadata(path, snapshot.stories, snapshot.sources, snapshot);
  const resolvedTitle = routeMetadata?.title ?? title;
  const resolvedDescription = routeMetadata?.description ?? description;
  const resolvedPath = routeMetadata?.path ?? path;
  const resolvedArticle = article || Boolean(routeMetadata?.article);
  const articleSlug = resolvedArticle
    ? resolvedPath.match(/^\/article\/([^/]+)$/)?.[1]
    : undefined;
  const resolvedStory = articleSlug
    ? snapshot.stories.find((story) => story.slug === articleSlug)
    : undefined;
  const resolvedAuthor = resolvedStory
    ? getStoryAuthorIdentity(resolvedStory, snapshot.authors)
    : undefined;
  const currentQuery = new URLSearchParams(currentLocation.split('?')[1] ?? '');
  const routePath = path.split(/[?#]/, 1)[0].replace(/\/+$/, '') || '/';
  const isSearchResults = ['/brief', '/search'].includes(routePath) && currentQuery.has('q');
  const resolvedIndexable = indexable && routeMetadata?.indexable !== false && !isSearchResults;

  useEffect(() => {
    document.title = resolvedTitle;
    const canonical = getCanonicalUrl(resolvedPath);
    const ensure = (selector: string, create: () => HTMLElement) => {
      const found = document.head.querySelector(selector) as HTMLElement | null;
      const element = found ?? create();
      if (!found) document.head.appendChild(element);
      return element;
    };
    const upsertMeta = (attribute: 'property' | 'name', key: string, content: string) => {
      const tag = ensure(`meta[${attribute}="${key}"]`, () => {
        const el = document.createElement('meta');
        el.setAttribute(attribute, key);
        return el;
      });
      tag.setAttribute('content', content);
      return tag as HTMLMetaElement;
    };
    const descriptionTag = ensure('meta[name="description"]', () => { const el = document.createElement('meta'); el.name = 'description'; return el; }) as HTMLMetaElement;
    descriptionTag.content = resolvedDescription;
    const canonicalTag = ensure('link[rel="canonical"]', () => { const el = document.createElement('link'); el.rel = 'canonical'; return el; });
    canonicalTag.setAttribute('href', canonical);
    const robotsTag = document.head.querySelector('meta[name="robots"]');
    if (!resolvedIndexable) {
      const tag = ensure('meta[name="robots"]', () => {
        const el = document.createElement('meta');
        el.name = 'robots';
        return el;
      }) as HTMLMetaElement;
      tag.content = 'noindex,follow';
    } else if (resolvedArticle) {
      const tag = ensure('meta[name="robots"]', () => {
        const el = document.createElement('meta');
        el.name = 'robots';
        return el;
      }) as HTMLMetaElement;
      tag.content = 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1';
    } else {
      robotsTag?.remove();
    }
    [
      ['property', 'og:title', resolvedTitle],
      ['property', 'og:description', resolvedDescription],
      ['property', 'og:url', canonical],
      ['property', 'og:type', resolvedArticle ? 'article' : 'website'],
      ['property', 'og:site_name', 'Global AI News'],
      ['property', 'og:locale', 'en_IN'],
      ['name', 'twitter:title', resolvedTitle],
      ['name', 'twitter:description', resolvedDescription],
    ].forEach(([attribute, key, content]) => {
      upsertMeta(attribute as 'property' | 'name', key, content);
    });
    const findServerImageTag = (selector: string) =>
      Array.from(document.head.querySelectorAll<HTMLMetaElement>(selector))
        .find((tag) => tag.dataset.globalAiMetaPath === resolvedPath);
    const serverOgImage = findServerImageTag('meta[property="og:image"]');
    const serverOgImageAlt = findServerImageTag('meta[property="og:image:alt"]');
    const serverTwitterImage = findServerImageTag('meta[name="twitter:image"]');
    const serverTwitterImageAlt = findServerImageTag('meta[name="twitter:image:alt"]');
    let structuredImagePath = routeMetadata?.imagePath;
    if (serverOgImage?.content) {
      try {
        const serverImageUrl = new URL(serverOgImage.content, SITE);
        if (serverImageUrl.origin === new URL(SITE).origin) {
          structuredImagePath = serverImageUrl.pathname;
        }
      } catch {
        // Keep the configured route image if a malformed server tag is encountered.
      }
    }
    const imageMetadata: Array<['property' | 'name', string, string]> = routeMetadata?.imagePath
      ? [
          [
            'property',
            'og:image',
            serverOgImage?.content ?? `${SITE}${routeMetadata.imagePath}`,
          ],
          [
            'property',
            'og:image:alt',
            serverOgImageAlt?.content ?? routeMetadata.imageAlt ?? resolvedTitle,
          ],
          ['property', 'og:image:type', 'image/png'],
          [
            'name',
            'twitter:image',
            serverTwitterImage?.content ?? serverOgImage?.content ?? `${SITE}${routeMetadata.imagePath}`,
          ],
          [
            'name',
            'twitter:image:alt',
            serverTwitterImageAlt?.content ?? serverOgImageAlt?.content ?? routeMetadata.imageAlt ?? resolvedTitle,
          ],
        ]
      : [];
    ['og:image', 'og:image:alt', 'og:image:type'].forEach((property) => {
      if (!imageMetadata.some(([attribute, key]) => attribute === 'property' && key === property)) {
        document.head.querySelector(`meta[property="${property}"]`)?.remove();
      }
    });
    ['twitter:image', 'twitter:image:alt'].forEach((name) => {
      if (!imageMetadata.some(([attribute, key]) => attribute === 'name' && key === name)) {
        document.head.querySelector(`meta[name="${name}"]`)?.remove();
      }
    });
    imageMetadata.forEach(([attribute, key, content]) => {
      const tag = upsertMeta(attribute, key, content);
      if (
        ['og:image', 'og:image:alt', 'twitter:image', 'twitter:image:alt'].includes(key)
      ) {
        tag.dataset.globalAiMetaPath = resolvedPath;
      }
    });
    const twitter = ensure('meta[name="twitter:card"]', () => { const el = document.createElement('meta'); el.name = 'twitter:card'; return el; }) as HTMLMetaElement;
    twitter.content = 'summary_large_image';
     const amp = document.head.querySelector('link[rel="amphtml"]');
     if (resolvedArticle && routeMetadata?.ampPath) {
      const ampTag = (amp as HTMLLinkElement | null) ?? document.createElement('link');
      ampTag.rel = 'amphtml';
       ampTag.href = `${SITE}${routeMetadata.ampPath}`;
      if (!amp) document.head.appendChild(ampTag);
    } else if (amp) amp.remove();
    const ld = ensure('script[data-global-ai-ld]', () => { const el = document.createElement('script'); el.type = 'application/ld+json'; el.dataset.globalAiLd = 'true'; return el; });
    ld.textContent = getStructuredData({
      title: resolvedTitle,
      description: resolvedDescription,
      path: resolvedPath,
      article: resolvedArticle,
      imagePath: structuredImagePath,
      imageAlt: routeMetadata?.imageAlt,
    }, snapshot.stories, snapshot.authors, snapshot);

    const publicDateModified = resolvedStory
      ? getPublicDateModified(resolvedStory)
      : undefined;
    const articleMeta: Array<[string, string]> = resolvedStory
      ? [
          ['article:published_time', resolvedStory.date],
          ...(publicDateModified
            ? [['article:modified_time', publicDateModified] as [string, string]]
            : []),
          ...(resolvedAuthor
            ? [['article:author', getCanonicalUrl(resolvedAuthor.type === 'Person' && resolvedAuthor.slug ? `/person/${resolvedAuthor.slug}` : '/authors')] as [string, string]]
            : []),
          ['article:section', resolvedStory.category],
          ['article:tag', resolvedStory.topic],
        ]
      : [];
    ['article:published_time', 'article:modified_time', 'article:author', 'article:section', 'article:tag']
      .forEach((property) => {
        if (!articleMeta.some(([key]) => key === property)) {
          document.head.querySelector(`meta[property="${property}"]`)?.remove();
        }
      });
    articleMeta.forEach(([property, content]) => {
      upsertMeta('property', property, content);
    });
  }, [
    resolvedArticle,
    resolvedAuthor,
    resolvedDescription,
    resolvedIndexable,
    resolvedPath,
    resolvedStory,
    resolvedTitle,
    snapshot.authors,
    snapshot.stories,
  ]);
  return null;
}

const nav = [['Brief', '/brief'], ['Research', '/research'], ['Data', '/data'], ['Reports', '/reports'], ['Signals', '/signals'], ['Industry', '/industry'], ['India', '/india']];

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [location, setLocation] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const pathname = location.split('?')[0];
  const currentPathname = pathname.length > 1 ? pathname.replace(/\/+$/, '') : '/';
  const snapshot = useNewsroomSnapshot();
  const visibleNav = getQualifiedSectionNavigation(snapshot);
  const latestStory = getLatestStory(snapshot.stories);
  const showLatestStrip = ['/', '/brief'].includes(currentPathname)
    && latestStory !== undefined
    && isWithinLatestWindow(latestStory.date);
  const submit = (event: FormEvent) => { event.preventDefault(); const nextQuery = query.trim(); if (nextQuery) { trackEvent('site_search_submitted', { location: 'header' }); handoffSearchQuery(nextQuery); setLocation('/search'); } };
  return <header className="sticky top-0 z-40 border-b border-foreground/15 bg-background/95 shadow-[0_1px_0_hsl(var(--foreground)/.04)] backdrop-blur-sm">
    <div className="mx-auto flex min-h-[68px] max-w-[1440px] items-center justify-between gap-4 px-5 py-4 md:px-10">
      <Link href="/" data-testid="link-logo" aria-label="Global AI News home" className="shrink-0">
        <GlobalAiNewsLockup sealSize={30} />
      </Link>
      <nav aria-label="Main navigation" className="hidden items-center gap-4 xl:flex">{visibleNav.map(([label, href]) => <Link data-testid={`link-nav-${label.toLowerCase()}`} aria-current={currentPathname === href ? 'page' : undefined} key={href} href={href} className={`eyebrow relative flex min-h-11 items-center transition-colors hover:text-primary ${currentPathname === href ? 'text-primary after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-primary' : 'text-muted-foreground'}`}>{label}</Link>)}</nav>
      <div className="flex items-center gap-2 sm:gap-3"><button type="button" data-testid="button-theme-toggle" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} aria-pressed={theme === 'dark'} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} onClick={toggleTheme} className="grid h-11 w-11 place-items-center border border-foreground/20 hover:border-primary hover:text-primary">{theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}<span className="sr-only">{theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}</span></button><button type="button" data-testid="button-search-toggle" aria-label={searchOpen ? 'Close search' : 'Open search'} aria-expanded={searchOpen} aria-controls={searchOpen ? 'site-search-panel' : undefined} onClick={() => { setSearchOpen(!searchOpen); if (!searchOpen) setMenuOpen(false); }} className="grid h-11 w-11 place-items-center border border-foreground/20 hover:border-primary hover:text-primary">{searchOpen ? <X size={15} /> : <Search size={15} />}</button><Link href="/sign-in" data-testid="link-editor-sign-in" className="hidden min-h-11 items-center px-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary sm:inline-flex">Editor sign-in</Link><Link href="/brief#newsletter" data-testid="link-join-brief" className="hidden min-h-11 items-center bg-primary px-3 font-mono text-[10px] uppercase tracking-widest text-primary-foreground shadow-[0_5px_0_hsl(var(--primary)/.16)] transition-transform hover:-translate-y-px hover:shadow-[0_7px_0_hsl(var(--primary)/.16)] sm:flex">Join the brief</Link><button type="button" data-testid="button-mobile-menu" className="grid h-11 w-11 place-items-center border border-foreground/20 hover:border-primary hover:text-primary xl:hidden" onClick={() => { setMenuOpen(!menuOpen); if (!menuOpen) setSearchOpen(false); }} aria-expanded={menuOpen} aria-controls={menuOpen ? 'mobile-primary-navigation' : undefined} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}>{menuOpen ? <X size={18} /> : <Menu size={18} />}</button></div>
    </div>
      {(searchOpen || menuOpen) && <div className="border-t border-foreground/15 bg-card px-5 py-4 shadow-[0_8px_18px_hsl(var(--foreground)/.05)] md:px-10">
        {searchOpen && <form id="site-search-panel" data-clarity-mask="true" onSubmit={submit} className="mx-auto flex max-w-[1440px] items-center gap-3"><Search size={15} className="text-primary" /><input data-testid="input-site-search" aria-label="Search stories, entities and timelines" autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search stories, topics and authors" className="min-w-0 flex-1 bg-transparent py-2 font-mono text-xs outline-none placeholder:text-muted-foreground" /><button data-testid="button-site-search" className="min-h-11 border border-primary px-4 font-mono text-[10px] uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground">Search</button></form>}
        {menuOpen && <nav id="mobile-primary-navigation" aria-label="Mobile primary navigation" className="mx-auto grid max-w-[1440px] grid-cols-2 gap-x-4 gap-y-1 xl:hidden">{visibleNav.map(([label, href]) => <Link data-testid={`link-mobile-${label.toLowerCase()}`} aria-current={currentPathname === href ? 'page' : undefined} key={href} href={href} onClick={() => setMenuOpen(false)} className={`flex min-h-11 items-center border-t border-foreground/15 text-sm hover:text-primary ${currentPathname === href ? 'text-primary' : ''}`}>{label}</Link>)}<Link href="/sign-in" data-testid="link-mobile-editor-sign-in" onClick={() => setMenuOpen(false)} className="col-span-2 flex min-h-11 items-center border-t border-foreground/15 text-sm font-medium text-primary hover:underline">Editor sign-in</Link></nav>}
      </div>}
      {showLatestStrip && latestStory && <div className="border-t border-foreground/10 bg-foreground py-2 text-background shadow-[0_2px_0_hsl(var(--foreground)/.1)]"><div className="mx-auto flex max-w-[1440px] items-center gap-3 px-5 md:px-10"><span className="shrink-0 font-mono text-[9px] uppercase tracking-widest text-background">Latest · {formatEditorialDate(latestStory.date)}</span><Link href={`/article/${latestStory.slug}`} className="truncate text-xs hover:text-accent">{latestStory.title}</Link></div></div>}
  </header>;
}

export function Footer() {
  const snapshot = useNewsroomSnapshot();
  const latestStory = getLatestStory(snapshot.stories);
  return <footer className="mt-24 border-t border-foreground/15 bg-surface-muted/35"><div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-14 md:grid-cols-[1.7fr_1fr_1fr_1fr_1fr] md:px-10"><div><GlobalAiNewsLockup sealSize={38} /><p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">Evidence-led stories, research and data for people who need to understand what changed in AI.</p></div><div><p className="eyebrow text-primary">Explore</p><div className="mt-4 grid gap-3 text-sm">{nav.map(([label, href]) => <Link data-testid={`link-footer-${label.toLowerCase()}`} key={href} href={href} className="w-fit border-b border-transparent hover:border-primary hover:text-primary">{label}</Link>)}</div></div><div><p className="eyebrow text-primary">Topics</p><div className="mt-4 grid gap-3 text-sm"><Link href="/industry" className="w-fit hover:text-primary">Industry map</Link><Link href="/models" className="w-fit hover:text-primary">Models</Link><Link href="/policy" className="w-fit hover:text-primary">Policy</Link><Link href="/essays" className="w-fit hover:text-primary">Essays</Link><Link href="/ask" className="w-fit hover:text-primary">Ask Global</Link></div></div><div><p className="eyebrow text-primary">Standards</p><div className="mt-4 grid gap-3 text-sm"><Link href="/about-us" className="w-fit hover:text-primary">About</Link><Link href="/authors" className="w-fit hover:text-primary">Authors</Link><Link href="/code-of-ethics" className="w-fit hover:text-primary">Editorial standards</Link><Link href="/corrections" className="w-fit hover:text-primary">Corrections</Link><Link href="/contact-us" className="w-fit hover:text-primary">Contact</Link><Link href="/privacy" className="w-fit hover:text-primary">Privacy notice</Link><Link href="/terms" className="w-fit hover:text-primary">Terms of use</Link><Link href="/archive" className="w-fit hover:text-primary">Archive</Link></div></div><div><p className="eyebrow text-primary">Latest edition</p><p className="mt-4 font-serif text-3xl">{latestStory ? formatEditorialDate(latestStory.date) : 'No edition yet'}</p><Link href="/brief" className="mt-3 inline-flex min-h-11 items-center text-sm text-primary hover:underline">Read the Daily Brief <ArrowUpRight size={14} className="ml-2" /></Link></div></div><div className="mx-auto flex max-w-[1440px] flex-col gap-2 border-t border-foreground/15 px-5 py-5 text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between md:px-10"><span>© {new Date().getFullYear()} Global AI News</span><span>Independent newsroom · No noise by design</span></div></footer>;
}

export function Newsletter({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const subscribe = useSubscribeNewsletter();
  return <section id="newsletter" className={`relative isolate overflow-hidden border-y border-primary bg-primary text-primary-foreground shadow-[inset_0_1px_0_hsl(var(--primary-foreground)/.16)] ${compact ? 'p-6' : 'p-8 md:p-12'}`}><div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full border border-primary-foreground/20" /><div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-14 h-44 w-44 rounded-full border border-accent/50" /><div className="relative max-w-2xl"><p className="eyebrow text-primary-foreground">The Daily Brief · email edition</p><h2 className={`display mt-3 leading-[.92] ${compact ? 'text-4xl' : 'text-5xl md:text-7xl'}`}>Know what<br />changed.</h2><p className="mt-5 max-w-md text-sm leading-6 text-primary-foreground">One considered email for the people who need to understand the AI industry.</p>{message ? <p data-testid="status-newsletter-success" className="mt-7 border border-primary-foreground/35 px-4 py-3 text-sm">{message}</p> : <form data-clarity-mask="true" onSubmit={(event) => { event.preventDefault(); const website = String(new FormData(event.currentTarget).get('website') ?? ''); subscribe.mutate({ data: { email, website } }, { onSuccess: (result) => { setMessage(result.message); trackEvent('newsletter_subscribed', { location: compact ? 'compact' : 'full' }); }, onError: () => setMessage('We could not save that subscription. Please try again.') }); }} className="mt-7 flex max-w-md flex-col gap-2 sm:flex-row"><input name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px]" /><input data-testid="input-newsletter-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" className="min-w-0 flex-1 border border-primary-foreground/40 bg-primary/20 px-4 py-3 text-sm outline-none placeholder:text-primary-foreground focus:border-primary-foreground focus:bg-primary/30" /><button data-testid="button-newsletter-submit" disabled={subscribe.isPending} className="bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-[0_4px_0_hsl(var(--foreground)/.12)] transition-transform hover:-translate-y-px disabled:opacity-60">{subscribe.isPending ? 'Joining…' : 'Get the brief'}</button></form>}{subscribe.isError && !message && <p data-testid="status-newsletter-error" className="mt-3 text-sm text-primary-foreground">We could not save that subscription. Please try again.</p>}</div></section>;
}

export function SectionLabel({ children, aside }: { children: ReactNode; aside?: ReactNode }) { return <div className="section-label mb-5 flex items-center justify-between border-b border-foreground/15 pb-3"><p className="eyebrow flex items-center text-primary"><span aria-hidden="true" className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />{children}</p>{aside && <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{aside}</span>}</div>; }

export function StoryImage({ slug, alt, className, loading = 'lazy', fetchPriority }: { slug: string; alt: string; className: string; loading?: 'eager' | 'lazy'; fetchPriority?: 'high' | 'low' | 'auto' }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [slug]);
  const imagePath = failed ? EDITORIAL_IMAGE_FALLBACK : getEditorialImagePath(slug);
  return <img src={imagePath} alt={alt} width={1200} height={675} loading={loading} fetchPriority={fetchPriority} className={`story-image ${className}`} onError={() => setFailed(true)} />;
}

export function EditorialImage({ treatment = 'editorial-abstract', alt, caption, large = false, storySlug }: { treatment?: string; alt: string; caption?: string; large?: boolean; storySlug?: string }) {
  return <figure className={`editorial-visual overflow-hidden border border-foreground/15 ${storySlug ? '' : large ? 'min-h-[300px] md:min-h-[540px]' : 'min-h-[180px]'}`}>
    {storySlug
      ? <StoryImage slug={storySlug} alt={alt} className="article-hero-image" loading={large ? 'eager' : 'lazy'} fetchPriority={large ? 'high' : undefined} />
      : <div role="img" aria-label={alt} className="relative h-full min-h-[inherit] overflow-hidden p-6 md:p-10"><div className="editorial-visual-ring absolute right-10 top-10 h-28 w-28 rounded-full border" /><div className="editorial-visual-accent absolute right-20 top-20 h-16 w-16 rounded-full border" /><div className="editorial-visual-rule absolute bottom-12 left-12 h-px w-3/4" /><div className="editorial-visual-accent absolute bottom-20 left-20 h-px w-1/2 rotate-[-14deg]" /><div className="relative flex h-full min-h-[inherit] flex-col justify-between"><span className="editorial-visual-muted eyebrow">{treatment.replace('-', ' ')} / field note</span><div><p className="max-w-sm font-serif text-4xl leading-[.9] md:text-6xl">{treatment === 'data-graphic' ? 'The map follows the constraint.' : 'A new map of the invisible.'}</p><p className="editorial-visual-muted mt-4 max-w-xs text-xs leading-5">Global AI News · editorial visual</p></div></div></div>}
    {caption && <figcaption className="editorial-visual-caption border-t px-6 py-3 text-xs">Editorial illustration · {caption}</figcaption>}
  </figure>;
}

export function StoryRow({ slug, rank, compact = false }: { slug: string; rank?: number; compact?: boolean }) {
  const snapshot = useNewsroomSnapshot();
  const story = uniqueStoriesByCanonicalSlug(snapshot.stories)
    .find((item) => canonicalStorySlug(item.slug) === canonicalStorySlug(slug))
    ?? findStory(slug);
  const [saved, setSaved] = useState(false);
  if (!story) return null;
  const author = getStoryAuthorIdentity(story, snapshot.authors);
  const authorLabel = author?.type === 'Person' && author.slug
    ? <Link data-testid={`link-story-author-${story.slug}`} href={`/person/${author.slug}`} className="underline decoration-foreground/30 underline-offset-2 hover:text-primary">{author.name}</Link>
    : author?.name;
  const dek = getPublicStoryDek(story);
  return <article data-testid={`card-story-${slug}`} className={`group -mx-3 border-t border-foreground/15 px-3 py-5 transition-colors hover:bg-primary/[.035] ${compact ? '' : 'md:py-7'}`}><div className="grid grid-cols-[auto_minmax(0,1fr)_auto] gap-4"><span className="font-serif text-3xl leading-none text-primary/70">{rank ? `0${rank}` : '—'}</span><div className="min-w-0"><StoryImage slug={story.slug} alt={story.imageTreatment.alt} className="mb-4 aspect-[16/9] w-full object-cover" /><div className="flex flex-wrap items-center gap-2"><span className="eyebrow text-primary">{story.category}</span><span className="h-1 w-1 rounded-full bg-accent" /><span className="text-xs text-muted-foreground">{getStoryReadTime(story)}</span></div><Link data-testid={`link-story-${slug}`} href={`/article/${story.slug}`} className="mt-2 block max-w-2xl font-serif text-2xl leading-[.98] transition-colors group-hover:text-primary md:text-3xl">{story.title}</Link>{dek && <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">{dek}</p>}<p className="mt-4 text-xs text-muted-foreground">By {authorLabel} · <time dateTime={story.date}>{formatEditorialDate(story.date)}</time></p></div><button data-testid={`button-bookmark-${slug}`} type="button" aria-label={saved ? 'Remove bookmark' : 'Bookmark story'} onClick={() => { const nextSaved = !saved; setSaved(nextSaved); trackEvent(nextSaved ? 'story_bookmarked' : 'story_unbookmarked', { story_slug: story.slug }); }} className="inline-flex min-h-11 min-w-11 self-start items-center justify-center rounded-full text-muted-foreground hover:bg-primary/10 hover:text-primary">{saved ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}</button></div></article>;
}

export function EvidencePanel({ storySlug }: { storySlug: string }) {
  const story = findStory(storySlug);
  if (!story) return null;
  const evidence = story.evidenceSummary;
  return <section className="border-y border-foreground/15 py-6"><SectionLabel>Evidence</SectionLabel><div className="grid gap-5 text-sm sm:grid-cols-3"><div><p className="eyebrow text-muted-foreground">Primary sources</p><p className="mt-2 text-2xl font-semibold">{evidence.primarySources}</p></div><div><p className="eyebrow text-muted-foreground">Independent confirmations</p><p className="mt-2 text-2xl font-semibold">{evidence.independentConfirmations}</p></div><div><p className="eyebrow text-muted-foreground">Editorial confidence</p><p className="mt-2 text-2xl font-semibold text-success">{evidence.confidence}</p></div></div><p className="mt-5 max-w-xl text-sm leading-6 text-muted-foreground">{evidence.note}</p></section>;
}

export function EntityLinks({ slugs }: { slugs: string[] }) {
  const snapshot = useNewsroomSnapshot();
  return <div className="flex flex-wrap gap-x-5 gap-y-3">{slugs.map((slug) => {
    const entity = snapshot.entities.find((item) => item.slug === slug);
    const author = entity?.kind === 'person' ? snapshot.authors.find((item) => item.slug === slug) : undefined;
    if (!entity || (author && author.verifiedForPublication !== true)) return null;
    return <Link data-testid={`link-entity-${slug}`} key={slug} href={`/${entity.kind}/${entity.slug}`} className="border-b border-primary/40 pb-1 text-sm hover:text-primary">{entity.name} <ArrowUpRight size={12} className="inline" /></Link>;
  })}</div>;
}

export function TimelineList({ slugs }: { slugs: string[] }) {
  return <div className="grid gap-0">{slugs.map((slug) => { const event = timelineEvents.find((item) => item.slug === slug); return event ? <Link data-testid={`link-timeline-${slug}`} href={`/timeline/${slug}`} key={slug} className="grid grid-cols-[110px_1fr] gap-4 border-t border-foreground/15 py-4 text-sm hover:text-primary"><time dateTime={event.date} className="font-mono text-[10px] text-muted-foreground">{formatEditorialDate(event.date)}</time><span><b className="font-medium">{event.title}</b><span className="mt-1 block text-xs leading-5 text-muted-foreground">{event.description}</span></span></Link> : null; })}</div>;
}
