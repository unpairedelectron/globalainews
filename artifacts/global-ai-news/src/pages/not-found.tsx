import { Link } from 'wouter';

export default function NotFound() {
  return <main className="mx-auto flex min-h-[100dvh] max-w-[900px] flex-col justify-center px-5 py-16"><p className="eyebrow text-primary">404 · Signal lost</p><h1 className="mt-6 max-w-2xl font-serif text-7xl leading-[.84] md:text-[9rem]">This page<br /><em className="text-primary">moved on.</em></h1><p className="mt-7 max-w-md text-lg leading-7 text-muted-foreground">The URL is not part of the current record. Return to the newsroom and follow the signal.</p><Link href="/" className="mt-8 inline-block w-fit bg-foreground px-4 py-3 text-sm text-background">Return to Global AI News</Link></main>;
}