import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { ClerkProvider, SignIn, SignUp } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { shadcn } from '@clerk/themes';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from '@/components/error-boundary';
import { NewsroomProvider } from '@/newsroom';
import { ThemeProvider, useTheme, type Theme } from '@/theme';
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
const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

if (!clerkPubKey) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY.');
}

function getClerkAppearance(theme: Theme) {
  const dark = theme === 'dark';
  return {
  theme: shadcn,
  cssLayerName: 'clerk',
  options: {
    logoPlacement: 'inside' as const,
    logoLinkUrl: basePath || '/',
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: dark ? '#79a6ff' : '#1557d6',
    colorForeground: dark ? '#f1efe9' : '#11161a',
    colorMutedForeground: dark ? '#b3bbc0' : '#5b6064',
    colorDanger: dark ? '#ee8d87' : '#a23d38',
    colorBackground: dark ? '#11161a' : '#f6f4ef',
    colorInput: dark ? '#1a2126' : '#ffffff',
    colorInputForeground: dark ? '#f1efe9' : '#11161a',
    colorNeutral: dark ? '#485058' : '#c8c6bf',
    fontFamily: 'DM Sans, sans-serif',
    borderRadius: '0.15rem',
  },
  elements: {
    rootBox: 'w-full flex justify-center',
    cardBox: 'bg-card rounded-none w-[440px] max-w-full overflow-hidden border border-border',
    card: '!shadow-none !border-0 !bg-transparent !rounded-none',
    footer: '!shadow-none !border-0 !bg-transparent !rounded-none',
    headerTitle: 'font-serif text-foreground',
    headerSubtitle: 'text-muted-foreground',
    socialButtonsBlockButtonText: 'text-foreground',
    formFieldLabel: 'text-foreground',
    footerActionLink: 'text-primary',
    footerActionText: 'text-muted-foreground',
    dividerText: 'text-muted-foreground',
    formButtonPrimary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    formFieldInput: 'bg-background text-foreground border-border',
    footerAction: 'text-muted-foreground',
    dividerLine: 'bg-border',
    alertText: 'text-destructive',
    alert: 'border-destructive/40 bg-destructive/10',
    main: 'bg-transparent',
  },
  };
}

function SignInPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
      <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
      <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
    </div>
  );
}

function AppRoutes() {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}><Switch>
    <Route path="/sign-in/*?" component={SignInPage} />
    <Route path="/sign-up/*?" component={SignUpPage} />
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

function ClerkProviderWithRoutes({ children }: { children: ReactNode }) {
  const [, setLocation] = useLocation();
  const { theme } = useTheme();
  return <ClerkProvider
    publishableKey={clerkPubKey}
    proxyUrl={clerkProxyUrl}
    appearance={getClerkAppearance(theme)}
    signInUrl={`${basePath}/sign-in`}
    signUpUrl={`${basePath}/sign-up`}
    localization={{
      signIn: {
        start: {
          title: 'Global AI News editor sign-in',
          subtitle: 'Sign in to manage the release desk.',
        },
      },
      signUp: {
        start: {
          title: 'Create editor access',
          subtitle: 'Set up an account for the Global AI News release desk.',
        },
      },
    }}
    routerPush={(to) => setLocation(to.startsWith(basePath) ? to.slice(basePath.length) || '/' : to)}
    routerReplace={(to) => setLocation(to.startsWith(basePath) ? to.slice(basePath.length) || '/' : to, { replace: true })}
  >
    {children}
  </ClerkProvider>;
}

function App({ initialTheme }: { initialTheme: Theme }) {
  return <QueryClientProvider client={queryClient}><ThemeProvider initialTheme={initialTheme}><Router base={basePath}><ClerkProviderWithRoutes><NewsroomProvider><AppRoutes /></NewsroomProvider><Toaster /></ClerkProviderWithRoutes></Router></ThemeProvider></QueryClientProvider>;
}

export default App;