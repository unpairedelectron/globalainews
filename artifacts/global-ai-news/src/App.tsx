import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { lazy, Suspense } from 'react';
import { getGetNewsroomContentQueryKey } from '@workspace/api-client-react';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from '@/components/error-boundary';
import { NewsroomProvider } from '@/newsroom';
import { ThemeProvider, type Theme } from '@/theme';
import { Router, Route, Switch, useLocation } from 'wouter';
import NotFound from '@/pages/not-found';
import {
  AmpArticlePage,
  ArticlePage,
  AskPage,
  BriefPage,
  EditorialInputPage,
  EntityPage,
  FocusIndexPage,
  HomePage,
  IndiaPage,
  IndustryPage,
  ResearchPage,
  SearchPage,
  SignalsPage,
  TimelinePage,
  TopicPage,
} from '@/pages/public';
import { ReportsIndexPage } from '@/pages/reports-index';

const queryClient = new QueryClient();
const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
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
    <Route path="/research"><ResearchPage /></Route>
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
    <Route path="/timeline/:slug" component={TimelinePage} />
    <Route path="/reports" component={ReportsIndexPage} />
    <Route path="/topics"><EditorialInputPage title="Topics" path="/topics" /></Route>
    <Route path="/archive"><EditorialInputPage title="Archive" path="/archive" /></Route>
    <Route path="/about-us"><EditorialInputPage title="About us" path="/about-us" /></Route>
    <Route path="/code-of-ethics"><EditorialInputPage title="Code of ethics" path="/code-of-ethics" /></Route>
    <Route path="/corrections"><EditorialInputPage title="Corrections" path="/corrections" /></Route>
    <Route path="/contact-us"><EditorialInputPage title="Contact us" path="/contact-us" /></Route>
    <Route component={NotFound} />
  </Switch>;

  return <ErrorBoundary resetKey={location}>
    {needsClerk ? (
      <Suspense fallback={<main role="status" className="flex min-h-[100dvh] items-center justify-center bg-background p-6 text-sm text-muted-foreground">Loading editor workspace…</main>}>
        <ClerkProviderWithRoutes>{routes}</ClerkProviderWithRoutes>
      </Suspense>
    ) : routes}
  </ErrorBoundary>;
}

function App({ initialTheme }: { initialTheme: Theme }) {
  return <QueryClientProvider client={queryClient}><ThemeProvider initialTheme={initialTheme}><Router base={basePath}><NewsroomProvider><AppRoutes /><Toaster /></NewsroomProvider></Router></ThemeProvider></QueryClientProvider>;
}

export default App;