/**
 * Pages with complete server-rendered content and native-link navigation.
 * Keep their first response in the DOM rather than mounting the different SPA shell.
 */
export const STATIC_PRERENDER_ROUTES: ReadonlySet<string> = new Set([
  '/about-us',
  '/reports',
]);
