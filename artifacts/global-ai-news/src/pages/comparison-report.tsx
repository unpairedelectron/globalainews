import { Footer, Header, SeoHead } from '@/components/site';
import {
  ComparisonReportContent,
  comparisonReports,
  type ComparisonReportSlug,
} from '@/components/comparison-reports';

const container = 'editorial-page mx-auto max-w-[1180px] px-5 py-12 md:px-10 md:py-16';

export function ComparisonReportPage({ reportSlug }: { reportSlug: ComparisonReportSlug }) {
  const report = comparisonReports[reportSlug];
  const path = `/reports/${reportSlug}`;

  return (
    <>
      <Header />
      <SeoHead title={`${report.title} — Global AI News`} description={report.description} path={path} />
      <main className={container}>
        <nav aria-label="Breadcrumb" className="mb-8 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          <a href="/" className="hover:text-primary">Home</a>
          <span className="mx-2">/</span>
          <a href="/reports/" className="hover:text-primary">Reports</a>
          <span className="mx-2">/</span>
          <span aria-current="page">{report.title}</span>
        </nav>
        <ComparisonReportContent reportSlug={reportSlug} />
      </main>
      <Footer />
    </>
  );
}
