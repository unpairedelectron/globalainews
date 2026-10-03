import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { getGetNewsroomContentQueryKey } from '@workspace/api-client-react';
import { ClerkProvider, SignIn, SignUp, useSignIn } from '@clerk/react';
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
  EditorialInputPage,
  EntityPage,
  FocusIndexPage,
  HomePage,
  IndiaPage,
  IndustryPage,
  InsightsPage,
  ResearchPage,
  SearchPage,
  SignalsPage,
  TimelinePage,
  TopicPage,
} from '@/pages/public';
import { ReportsIndexPage } from '@/pages/reports-index';

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

export function primeNewsroomContent(snapshot: unknown): void {
  queryClient.setQueryData(getGetNewsroomContentQueryKey(), snapshot);
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
    rootBox: 'w-full min-w-0 flex justify-center',
    cardBox: 'bg-card rounded-none w-full max-w-[440px] min-w-0 overflow-x-hidden border border-border',
    card: '!shadow-none !border-0 !bg-transparent !rounded-none',
    footer: '!shadow-none !border-0 !bg-transparent !rounded-none',
    headerTitle: 'font-serif text-foreground',
    headerSubtitle: 'text-muted-foreground break-words',
    socialButtonsBlockButtonText: 'text-foreground whitespace-normal text-center',
    formFieldLabel: 'text-foreground break-words',
    footerActionLink: 'text-primary',
    footerActionText: 'text-muted-foreground',
    dividerText: 'text-muted-foreground',
    formButtonPrimary: 'w-full min-h-11 bg-primary text-primary-foreground hover:bg-primary/90',
    formFieldInput: 'w-full min-w-0 bg-background text-foreground border-border',
    footerAction: 'text-muted-foreground',
    dividerLine: 'bg-border',
    alertText: 'text-destructive',
    alert: 'border-destructive/40 bg-destructive/10',
    main: 'bg-transparent',
  },
  };
}

function SignInPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [validationError, setValidationError] = useState('');
  const [recoveryOpen, setRecoveryOpen] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const handleSubmitClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element) || !target.closest('button.cl-formButtonPrimary')) return;

      const fields = [...root.querySelectorAll<HTMLInputElement>('input:not([type="hidden"])')];
      const identifier = fields[0];
      const password = fields.find((field) => field.type === 'password');
      if (identifier?.value.trim() && password?.value.trim()) return;

      event.preventDefault();
      event.stopPropagation();
      setValidationError('Enter your email address and password to continue.');
    };

    const clearValidation = (event: Event) => {
      if (event.target instanceof HTMLInputElement) setValidationError('');
    };

    root.addEventListener('click', handleSubmitClick, true);
    root.addEventListener('input', clearValidation, true);
    return () => {
      root.removeEventListener('click', handleSubmitClick, true);
      root.removeEventListener('input', clearValidation, true);
    };
  }, []);

  return (
    <div ref={rootRef} className="flex min-h-[100dvh] w-full min-w-0 items-start justify-center overflow-x-hidden overflow-y-auto bg-background px-4 py-8 sm:items-center sm:px-6">
      {recoveryOpen ? (
        <ForgotPasswordFlow onBack={() => setRecoveryOpen(false)} />
      ) : (
        <div className="w-full max-w-[440px]">
          <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
          <button
            type="button"
            data-testid="button-forgot-password"
            onClick={() => setRecoveryOpen(true)}
            className="mt-3 w-full px-4 py-2 text-sm text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Forgot password?
          </button>
          {validationError && (
            <p
              id="global-ai-news-sign-in-validation"
              role="alert"
              aria-live="assertive"
              className="mt-3 border border-destructive bg-destructive px-4 py-3 text-center text-sm text-destructive-foreground"
            >
              {validationError}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
function ForgotPasswordFlow({ onBack }: { onBack: () => void }) {
  const { signIn, fetchStatus } = useSignIn();
  const [emailAddress, setEmailAddress] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<'email' | 'code' | 'password' | 'complete'>('email');
  const [error, setError] = useState('');

  const isFetching = fetchStatus === 'fetching';
  const showError = (value: unknown) => {
    setError(value instanceof Error ? value.message : 'We could not continue the password recovery flow. Please try again.');
  };

  const sendCode = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    if (!emailAddress.trim()) {
      setError('Enter the email address associated with your editor account.');
      return;
    }
    if (!signIn) return;
    try {
      const { error: createError } = await signIn.create({ identifier: emailAddress.trim() });
      if (createError) {
        showError(createError);
        return;
      }
      const { error: sendCodeError } = await signIn.resetPasswordEmailCode.sendCode();
      if (sendCodeError) {
        showError(sendCodeError);
        return;
      }
      setStep('code');
    } catch (value) {
      showError(value);
    }
  };

  const verifyCode = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    if (!signIn) return;
    try {
      const { error: verifyError } = await signIn.resetPasswordEmailCode.verifyCode({ code: code.trim() });
      if (verifyError) {
        showError(verifyError);
        return;
      }
      setStep('password');
    } catch (value) {
      showError(value);
    }
  };

  const submitPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    if (!signIn) return;
    try {
      const { error: passwordError } = await signIn.resetPasswordEmailCode.submitPassword({
        password,
        signOutOfOtherSessions: true,
      });
      if (passwordError) {
        showError(passwordError);
        return;
      }
      if (signIn.status === 'complete') {
        const { error: finalizeError } = await signIn.finalize({
          navigate: async ({ decorateUrl }) => {
            window.location.href = decorateUrl(`${basePath}/`);
          },
        });
        if (finalizeError) {
          showError(finalizeError);
          return;
        }
      }
      setStep('complete');
    } catch (value) {
      showError(value);
    }
  };

  const title = step === 'email'
    ? 'Reset your password'
    : step === 'code'
      ? 'Enter your recovery code'
      : step === 'password'
        ? 'Choose a new password'
        : 'Password reset requested';

  return (
    <section
      data-testid="auth-password-recovery"
      className="w-full max-w-[440px] border border-border bg-card p-6 text-foreground sm:p-8"
      aria-labelledby="password-recovery-title"
    >
      <button
        type="button"
        data-testid="button-password-recovery-back"
        onClick={onBack}
        className="mb-6 text-sm text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        Back to sign in
      </button>
      <p className="eyebrow text-muted-foreground">Account recovery</p>
      <h1 id="password-recovery-title" className="mt-2 font-serif text-3xl leading-tight">{title}</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {step === 'email'
          ? 'We’ll send a password reset code to your editor email.'
          : step === 'code'
            ? 'Enter the code from the email to continue.'
            : step === 'password'
              ? 'Use a new password for your Global AI News editor account.'
              : 'Follow the link in your email to finish signing in.'}
      </p>

      {step === 'email' && (
        <form className="mt-7 space-y-4" onSubmit={sendCode} noValidate>
          <div className="space-y-2">
            <label htmlFor="password-recovery-email" className="text-sm font-medium">Email address</label>
            <input
              id="password-recovery-email"
              data-testid="input-password-recovery-email"
              type="email"
              value={emailAddress}
              onChange={(event) => {
                setEmailAddress(event.target.value);
                setError('');
              }}
              placeholder="you@company.com"
              className="min-h-11 w-full border border-border bg-background px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              autoComplete="email"
            />
          </div>
          <button
            type="submit"
            data-testid="button-password-recovery-submit"
            disabled={isFetching}
            className="min-h-11 w-full bg-primary px-4 text-sm font-semibold text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
          >
            {isFetching ? 'Sending…' : 'Send password reset code'}
          </button>
        </form>
      )}

      {step === 'code' && (
        <form className="mt-7 space-y-4" onSubmit={verifyCode}>
          <div className="space-y-2">
            <label htmlFor="password-recovery-code" className="text-sm font-medium">Recovery code</label>
            <input
              id="password-recovery-code"
              data-testid="input-password-recovery-code"
              type="text"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              className="min-h-11 w-full border border-border bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
              autoComplete="one-time-code"
              inputMode="numeric"
            />
          </div>
          <button
            type="submit"
            data-testid="button-password-recovery-submit"
            disabled={isFetching}
            className="min-h-11 w-full bg-primary px-4 text-sm font-semibold text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
          >
            {isFetching ? 'Checking…' : 'Verify recovery code'}
          </button>
        </form>
      )}

      {step === 'password' && (
        <form className="mt-7 space-y-4" onSubmit={submitPassword}>
          <div className="space-y-2">
            <label htmlFor="password-recovery-password" className="text-sm font-medium">New password</label>
            <input
              id="password-recovery-password"
              data-testid="input-password-recovery-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="min-h-11 w-full border border-border bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
              autoComplete="new-password"
            />
          </div>
          <button
            type="submit"
            data-testid="button-password-recovery-submit"
            disabled={isFetching}
            className="min-h-11 w-full bg-primary px-4 text-sm font-semibold text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
          >
            {isFetching ? 'Saving…' : 'Set new password'}
          </button>
        </form>
      )}

      {step === 'complete' && (
        <p className="mt-7 border border-border bg-background px-4 py-3 text-sm leading-6">
          Your password has been reset. You can return to the sign-in page.
        </p>
      )}

      {error && (
        <p
          data-testid="password-recovery-error"
          role="alert"
          aria-live="assertive"
          className="mt-4 border border-destructive bg-destructive px-4 py-3 text-sm leading-6 text-destructive-foreground"
        >
          {error}
        </p>
      )}
    </section>
  );
}

function SignUpPage() {
  return (
    <div className="flex min-h-[100dvh] w-full min-w-0 items-start justify-center overflow-x-hidden overflow-y-auto bg-background px-4 py-8 sm:items-center sm:px-6">
      <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
    </div>
  );
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
    <Route path="/insights" component={InsightsPage} />
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
    {needsClerk ? <ClerkProviderWithRoutes>{routes}</ClerkProviderWithRoutes> : routes}
  </ErrorBoundary>;
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
  return <QueryClientProvider client={queryClient}><ThemeProvider initialTheme={initialTheme}><Router base={basePath}><NewsroomProvider><AppRoutes /><Toaster /></NewsroomProvider></Router></ThemeProvider></QueryClientProvider>;
}

export default App;
