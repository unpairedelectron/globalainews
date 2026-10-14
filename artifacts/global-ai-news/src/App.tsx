import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { lazy, Suspense } from 'react';
import { getGetNewsroomContentQueryKey } from '@workspace/api-client-react';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from '@/components/error-boundary';
import { NewsroomProvider } from '@/newsroom';
import { ThemeProvider, type Theme } from '@/theme';
import { Router, Route, Switch, useLocation } from 'wouter';
import NotFound from '@/pages/not-found';
const queryClient = new QueryClient();
const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
const HomePage = lazy(() => import('./pages/public').then((module) => ({ default: module.HomePage })));
const BriefPage = lazy(() => import('./pages/public').then((module) => ({ default: module.BriefPage })));
const SearchPage = lazy(() => import('./pages/public').then((module) => ({ default: module.SearchPage })));
const SignalsPage = lazy(() => import('./pages/public').then((module) => ({ default: module.SignalsPage })));
const ResearchPage = lazy(() => import('./pages/public').then((module) => ({ default: module.ResearchPage })));
const IndustryPage = lazy(() => import('./pages/public').then((module) => ({ default: module.IndustryPage })));
const FocusIndexPage = lazy(() => import('./pages/public').then((module) => ({ default: module.FocusIndexPage })));
const IndiaPage = lazy(() => import('./pages/public').then((module) => ({ default: module.IndiaPage })));
const AskPage = lazy(() => import('./pages/public').then((module) => ({ default: module.AskPage })));
const ArticlePage = lazy(() => import('./pages/public').then((module) => ({ default: module.ArticlePage })));
const AmpArticlePage = lazy(() => import('./pages/public').then((module) => ({ default: module.AmpArticlePage })));
const TopicPage = lazy(() => import('./pages/public').then((module) => ({ default: module.TopicPage })));
const EntityPage = lazy(() => import('./pages/public').then((module) => ({ default: module.EntityPage })));
const TimelinePage = lazy(() => import('./pages/public').then((module) => ({ default: module.TimelinePage })));
const EditorialInputPage = lazy(() => import('./pages/public').then((module) => ({ default: module.EditorialInputPage })));
const ReportsIndexPage = lazy(() => import('./pages/reports-index').then((module) => ({ default: module.ReportsIndexPage })));
const ComparisonReportPage = lazy(() => import('./pages/comparison-report').then((module) => ({ default: module.ComparisonReportPage })));
const ResearchIndexPage = lazy(() => import('./pages/authority-pages').then((module) => ({ default: module.ResearchIndexPage })));
const ResearchRecordPage = lazy(() => import('./pages/authority-pages').then((module) => ({ default: module.ResearchRecordPage })));
const DataIndexPage = lazy(() => import('./pages/authority-pages').then((module) => ({ default: module.DataIndexPage })));
const DataProductPage = lazy(() => import('./pages/authority-pages').then((module) => ({ default: module.DataProductPage })));
const SourceRecordPage = lazy(() => import('./pages/authority-pages').then((module) => ({ default: module.SourceRecordPage })));
const TopicsIndexPage = lazy(() => import('./pages/authority-pages').then((module) => ({ default: module.TopicsIndexPage })));
const ClerkProviderWithRoutes = lazy(() => import('./clerk-routes').then((module) => ({
  default: module.ClerkProviderWithRoutes,
})));
const SignInPage = lazy(() => import('./clerk-routes').then((module) => ({
  default: module.SignInPage,
})));
const SignUpPage = lazy(() => import('./clerk-routes').then((module) => ({
  default: module.SignUpPage,
})));
const ClerkInsightsPage = lazy(() => import('./clerk-routes').then((module) => ({
  default: module.ClerkInsightsPage,
})));

export function primeNewsroomContent(snapshot: unknown): void {
  queryClient.setQueryData(getGetNewsroomContentQueryKey(), snapshot);
}

function AppRoutes() {
  const [location] = useLocation();
  const pathname = location.split(/[?#]/, 1)[0];
  const needsClerk = pathname === '/insights'
    || pathname.startsWith('/sign-in')
    || pathname.startsWith('/sign-up');
  const routes = <Switch>
    <Route path="/sign-in/*?" component={SignInPage} />
    <Route path="/sign-up/*?" component={SignUpPage} />
    <Route path="/" component={HomePage} />
    <Route path="/brief" component={BriefPage} />
    <Route path="/search" component={SearchPage} />
    <Route path="/signals" component={SignalsPage} />
    <Route path="/research"><ResearchIndexPage /></Route>
    <Route path="/research/:slug" component={ResearchRecordPage} />
    <Route path="/data"><DataIndexPage /></Route>
    <Route path="/data/:slug" component={DataProductPage} />
    <Route path="/source/:slug" component={SourceRecordPage} />
    <Route path="/essays"><ResearchPage essay /></Route>
    <Route path="/industry" component={IndustryPage} />
    <Route path="/models"><FocusIndexPage kind="models" /></Route>
    <Route path="/policy"><FocusIndexPage kind="policy" /></Route>
    <Route path="/india" component={IndiaPage} />
    <Route path="/ask" component={AskPage} />
    <Route path="/article/:slug" component={ArticlePage} />
    <Route path="/amp/article/:slug" component={AmpArticlePage} />
    <Route path="/topic/ai"><TopicPage kind="ai" /></Route>
    <Route path="/topic/india"><TopicPage kind="india" /></Route>
    <Route path="/insights" component={ClerkInsightsPage} />
    <Route path="/company/:slug"><EntityPage kind="company" /></Route>
    <Route path="/lab/:slug"><EntityPage kind="lab" /></Route>
    <Route path="/model/:slug"><EntityPage kind="model" /></Route>
    <Route path="/person/:slug"><EntityPage kind="person" /></Route>
    <Route path="/technology/:slug"><EntityPage kind="technology" /></Route>
    <Route path="/policy/:slug"><EntityPage kind="policy" /></Route>
    <Route path="/institution/:slug"><EntityPage kind="institution" /></Route>
    <Route path="/dataset/:slug"><EntityPage kind="dataset" /></Route>
    <Route path="/infrastructure/:slug"><EntityPage kind="infrastructure" /></Route>
    <Route path="/timeline/:slug" component={TimelinePage} />
    <Route path="/reports/ai-assistants-compared"><ComparisonReportPage reportSlug="ai-assistants-compared" /></Route>
    <Route path="/reports/ai-image-tools-compared"><ComparisonReportPage reportSlug="ai-image-tools-compared" /></Route>
    <Route path="/reports" component={ReportsIndexPage} />
    <Route path="/topics" component={TopicsIndexPage} />
    <Route path="/archive"><EditorialInputPage title="Archive" path="/archive" /></Route>
    <Route path="/about-us"><EditorialInputPage title="About us" path="/about-us" /></Route>
    <Route path="/code-of-ethics"><EditorialInputPage title="Code of ethics" path="/code-of-ethics" /></Route>
    <Route path="/corrections"><EditorialInputPage title="Corrections" path="/corrections" /></Route>
    <Route path="/contact-us"><EditorialInputPage title="Contact us" path="/contact-us" /></Route>
    <Route path="/privacy"><EditorialInputPage title="Privacy notice" path="/privacy" /></Route>
    <Route path="/terms"><EditorialInputPage title="Terms of use" path="/terms" /></Route>
    <Route path="/authors"><EditorialInputPage title="Authors" path="/authors" /></Route>
    <Route component={NotFound} />
  </Switch>;

  return <ErrorBoundary resetKey={location}>
    <Suspense fallback={<main role="status" className="flex min-h-[100dvh] items-center justify-center bg-background p-6 text-sm text-muted-foreground">{needsClerk ? 'Loading editor workspace…' : 'Loading page…'}</main>}>
      {needsClerk ? <ClerkProviderWithRoutes>{routes}</ClerkProviderWithRoutes> : routes}
    </Suspense>
  </ErrorBoundary>;
}

function App({ initialTheme }: { initialTheme: Theme }) {
  return <QueryClientProvider client={queryClient}><ThemeProvider initialTheme={initialTheme}><Router base={basePath}><NewsroomProvider><AppRoutes /><Toaster /></NewsroomProvider></Router></ThemeProvider></QueryClientProvider>;
}

export default App;