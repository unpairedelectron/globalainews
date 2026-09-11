import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from '@/components/error-boundary';
import { NewsroomProvider } from '@/newsroom';
import { Router, Route, Switch, useLocation } from 'wouter';
import NotFound from '@/pages/not-found';
import {
  AmpArticlePage,
  ArticlePage,
  AskPage,
  BriefPage,
  EntityPage,
  FocusIndexPage,
  HomePage,
  IndiaPage,
  IndustryPage,
  InsightsPage,
  ResearchPage,
  SignalsPage,
  TimelinePage,
  TopicPage,
} from '@/pages/public';

const queryClient = new QueryClient();

function AppRoutes() {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}><Switch>
    <Route path="/" component={HomePage} />
    <Route path="/brief" component={BriefPage} />
    <Route path="/signals" component={SignalsPage} />
    <Route path="/research"><ResearchPage /></Route>
    <Route path="/essays"><ResearchPage essay /></Route>
    <Route path="/industry" component={IndustryPage} />
    <Route path="/models"><FocusIndexPage kind="models" /></Route>
    <Route path="/policy"><FocusIndexPage kind="policy" /></Route>
    <Route path="/india" component={IndiaPage} />
    <Route path="/ask" component={AskPage} />
    <Route path="/article/ai-models-antibiotic-discovery" component={ArticlePage} />
    <Route path="/article/:slug" component={ArticlePage} />
    <Route path="/amp/article/ai-models-antibiotic-discovery/" component={AmpArticlePage} />
    <Route path="/topic/ai"><TopicPage kind="ai" /></Route>
    <Route path="/topic/india"><TopicPage kind="india" /></Route>
    <Route path="/insights" component={InsightsPage} />
    <Route path="/company/:slug"><EntityPage kind="company" /></Route>
    <Route path="/lab/:slug"><EntityPage kind="lab" /></Route>
    <Route path="/model/:slug"><EntityPage kind="model" /></Route>
    <Route path="/person/:slug"><EntityPage kind="person" /></Route>
    <Route path="/technology/:slug"><EntityPage kind="technology" /></Route>
    <Route path="/policy/:slug"><EntityPage kind="policy" /></Route>
    <Route path="/timeline/:slug" component={TimelinePage} />
    <Route component={NotFound} />
  </Switch></ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><NewsroomProvider><Router base={import.meta.env.BASE_URL.replace(/\/$/, '')}><AppRoutes /></Router><Toaster /></NewsroomProvider></TooltipProvider></QueryClientProvider>;
}

export default App;