import React from 'react';

export type ComparisonReportSlug =
  | 'ai-assistants-compared'
  | 'ai-image-tools-compared';

interface ComparisonRow {
  product: string;
  documentedUse: string;
  sourceLabel: string;
  sourceUrl: string;
  sourceDate: string;
  limitation: string;
}

interface ComparisonRevision {
  recordedOn: string;
  summary: string;
  previousRows: ComparisonRow[];
}

interface ComparisonReport {
  title: string;
  description: string;
  intro: string;
  criteria: string;
  sourcesReviewedOn: string;
  sourceReviewCadence: string;
  nextSourceReviewDue: string;
  rows: ComparisonRow[];
  revisions: ComparisonRevision[];
  limitations: string[];
}

export const comparisonReports: Record<ComparisonReportSlug, ComparisonReport> = {
  'ai-assistants-compared': {
    title: 'AI Assistants Compared',
    description:
      'Compare documented workflows in ChatGPT, Claude, Gemini and Microsoft Copilot. A source-led guide, not a performance ranking.',
    intro:
      'This guide compares product surfaces and workflows documented by the vendors: research, file and image handling, and integration with work tools. It does not rank answer quality. We have not run a common benchmark across plans, accounts or regions.',
    criteria:
      'Criteria: user-facing work surfaces, vendor-documented capabilities, and access conditions. Feature availability and usage limits can vary by plan, account type, country and product release.',
    sourcesReviewedOn: '2026-10-14',
    sourceReviewCadence: 'Monthly',
    nextSourceReviewDue: '2026-11-13',
    rows: [
      {
        product: 'ChatGPT',
        documentedUse:
          'OpenAI documents Search for timely, source-backed answers; Deep Research for multi-step research with cited outputs; and image input, generation and natural-language edits.',
        sourceLabel: 'OpenAI capabilities overview',
        sourceUrl: 'https://help.openai.com/en/articles/9260256-chatgpt-capabilities-overview',
        sourceDate: 'Accessed 2026-10-14',
        limitation:
          'The overview is a vendor description; tools, limits and access can differ by plan and account.',
      },
      {
        product: 'Claude',
        documentedUse:
          'Anthropic documents web search with citations, file creation and editing, projects, and interactive visuals. Its support page says it does not produce raster photos or illustrations.',
        sourceLabel: 'Claude features and capabilities help',
        sourceUrl: 'https://support.claude.com/en/collections/18031719-features-and-capabilities',
        sourceDate: 'Accessed 2026-10-14',
        limitation:
          'The cited help pages describe current product behavior, not a comparative quality test; some visual features are beta.',
      },
      {
        product: 'Gemini Apps',
        documentedUse:
          'Google documents Nano Banana 2 image generation and editing, including local edits, character consistency and combining images.',
        sourceLabel: 'Gemini Apps Help',
        sourceUrl: 'https://support.google.com/gemini/answer/14286560?hl=en',
        sourceDate: 'Accessed 2026-10-14',
        limitation:
          'Google notes that availability depends on supported languages and countries, sign-in, age and account type; paid subscribers also have access to Nano Banana Pro.',
      },
      {
        product: 'Microsoft Copilot',
        documentedUse:
          'Microsoft describes Copilot inside Word, Excel, PowerPoint and Outlook, where it can assist with work across those apps and use work files, messages and meetings as context.',
        sourceLabel: 'Microsoft 365 Copilot in apps for work',
        sourceUrl: 'https://www.microsoft.com/en-in/microsoft-365-copilot/in-apps-for-work',
        sourceDate: 'Accessed 2026-10-14',
        limitation:
          'The page describes Microsoft 365 product surfaces; features depend on subscription and account eligibility.',
      },
    ],
    revisions: [
      {
        recordedOn: '2026-10-14',
        summary:
          'The ChatGPT, Gemini Apps and Microsoft Copilot descriptions and citations were updated after checking the current first-party documentation.',
        previousRows: [
          {
            product: 'ChatGPT',
            documentedUse:
              'OpenAI describes chat for web search and image generation, a work surface for creating and editing deliverables, and Codex for coding tasks.',
            sourceLabel: 'OpenAI product overview',
            sourceUrl: 'https://openai.com/chatgpt/overview/',
            sourceDate: 'Accessed 2026-10-14',
            limitation:
              'The overview is a vendor description; tools, limits and access can differ by plan and account.',
          },
          {
            product: 'Gemini Apps',
            documentedUse:
              'Google documents model selection and image generation and editing in Gemini Apps, including edits to generated images and user-uploaded images.',
            sourceLabel: 'Gemini Apps Help',
            sourceUrl: 'https://support.google.com/gemini/answer/14286560?hl=en',
            sourceDate: 'Accessed 2026-10-14',
            limitation:
              'Google notes that availability can depend on language, country, account type and plan.',
          },
          {
            product: 'Microsoft Copilot',
            documentedUse:
              'Microsoft describes Copilot workflows inside Word, Excel, PowerPoint and Outlook, including drafting, spreadsheet analysis, presentations and email summaries.',
            sourceLabel: 'Microsoft Copilot features',
            sourceUrl: 'https://www.microsoft.com/en-us/copilot/solutions/individuals',
            sourceDate: 'Accessed 2026-10-14',
            limitation:
              'The page describes Microsoft 365 product surfaces; features depend on subscription and account eligibility.',
          },
        ],
      },
    ],
    limitations: [
      'Vendor pages establish what each company says its product supports; they do not independently verify accuracy, privacy outcomes or productivity gains.',
      'This comparison does not compare model scores, price, message caps or service-level guarantees.',
      'Re-check the linked product documentation before making a purchasing decision; these products change frequently.',
    ],
  },
  'ai-image-tools-compared': {
    title: 'AI Image Tools Compared',
    description:
      'Compare documented generation and editing workflows in ChatGPT Images, Adobe Firefly, Midjourney and Gemini Apps.',
    intro:
      'The table compares capabilities described in first-party documentation, not image quality or commercial suitability. No tool is ranked, and no affiliate links are active on this page.',
    criteria:
      'Criteria: documented image-generation and editing controls, reference-image workflows, and stated access limits. Source dates identify a release/update date when the vendor provides one; otherwise they show when we checked the documentation.',
    sourcesReviewedOn: '2026-10-14',
    sourceReviewCadence: 'Monthly',
    nextSourceReviewDue: '2026-11-13',
    rows: [
      {
        product: 'ChatGPT Images 2.5',
        documentedUse:
          'OpenAI documents image generation, iterative edits, reference-photo subject preservation, sketch input and prompt sharing. The product announcement is dated September 8, 2026.',
        sourceLabel: 'OpenAI: ChatGPT Images 2.5',
        sourceUrl: 'https://openai.com/index/introducing-chatgpt-images-2-5/',
        sourceDate: 'Published 2026-09-08',
        limitation:
          'OpenAI reports the capabilities; the announcement is not an independent image-quality comparison. Availability may change.',
      },
      {
        product: 'Adobe Firefly',
        documentedUse:
          'Adobe documents image generation and editing, reference images and multiple partner models, including FLUX, Gemini, GPT Image, Imagen and Ideogram.',
        sourceLabel: 'Adobe Firefly: What’s new',
        sourceUrl: 'https://helpx.adobe.com/firefly/web/whats-new/new-features/whats-new.html',
        sourceDate: 'Accessed 2026-10-14',
        limitation:
          'Model access, credits and features depend on the current Firefly plan and release; inclusion is not an endorsement.',
      },
      {
        product: 'Midjourney',
        documentedUse:
          'Midjourney documents version selection and personalization profiles. Its version guide identifies V8.2 as the current default and describes its Edit Model.',
        sourceLabel: 'Midjourney version guide',
        sourceUrl: 'https://docs.midjourney.com/hc/en-us/articles/32199405667853-Version',
        sourceDate: 'V8.2 released 2026-07-24; accessed 2026-10-14',
        limitation:
          'This is a vendor feature description, not a controlled comparison of prompt adherence, fidelity or rights clearance.',
      },
      {
        product: 'Gemini Apps',
        documentedUse:
          'Google documents Nano Banana 2 image generation and editing, including local edits, character consistency and combining images.',
        sourceLabel: 'Google: Generate and edit images',
        sourceUrl: 'https://support.google.com/gemini/answer/14286560?hl=en',
        sourceDate: 'Accessed 2026-10-14',
        limitation:
          'Google notes that supported languages and countries, sign-in, age and school-account restrictions affect access; paid subscribers can also use Nano Banana Pro.',
      },
    ],
    revisions: [
      {
        recordedOn: '2026-10-14',
        summary:
          'The Adobe Firefly review date and Gemini Apps feature and access descriptions were updated after checking the current first-party documentation.',
        previousRows: [
          {
            product: 'Adobe Firefly',
            documentedUse:
              'Adobe documents image generation and editing, reference images and multiple partner models, including FLUX, Gemini, GPT Image, Imagen and Ideogram.',
            sourceLabel: 'Adobe Firefly: What’s new',
            sourceUrl: 'https://helpx.adobe.com/firefly/web/whats-new/new-features/whats-new.html',
            sourceDate: 'Updated 2026-09-18',
            limitation:
              'Model access, credits and features depend on the current Firefly plan and release; inclusion is not an endorsement.',
          },
          {
            product: 'Gemini Apps',
            documentedUse:
              'Google documents Nano Banana 2 image generation and editing, including local edits and edits using one or more uploaded images.',
            sourceLabel: 'Google: Generate and edit images',
            sourceUrl: 'https://support.google.com/gemini/answer/14286560?hl=en',
            sourceDate: 'Accessed 2026-10-14',
            limitation:
              'Google notes that language, country, sign-in, age, school-account and plan restrictions can affect availability and output options.',
          },
        ],
      },
    ],
    limitations: [
      'This is a feature comparison based on vendor documentation, not a benchmark or legal assessment of output rights.',
      '“Available” does not mean included in every plan or region. Verify account access, usage limits and terms directly with each provider.',
      'Product versions and terms can change after the dates shown. No ranking, commission claim or affiliate endorsement is made.',
    ],
  },
};

export function ComparisonReportContent({
  reportSlug,
}: {
  reportSlug: ComparisonReportSlug;
}) {
  const report = comparisonReports[reportSlug];

  return (
    <article data-testid={`comparison-report-${reportSlug}`}>
      <p className="eyebrow text-primary">Global AI News · Comparison report</p>
      <h1 className="mt-5 max-w-5xl font-serif text-6xl leading-[.9] tracking-[-.03em] md:text-8xl">
        {report.title}
      </h1>
      <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
        {report.intro}
      </p>
      <p className="mt-5 border-l-2 border-primary pl-4 text-sm leading-6 text-muted-foreground">
        {report.criteria}
      </p>

      <div className="mt-10 overflow-x-auto border border-foreground/15">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <caption className="bg-surface-muted px-4 py-3 text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {report.title} · sources checked {report.sourcesReviewedOn} · {report.sourceReviewCadence.toLowerCase()} review · next due {report.nextSourceReviewDue}
          </caption>
          <thead className="bg-secondary/50">
            <tr>
              <th scope="col" className="w-40 border-b border-foreground/15 p-4">Product</th>
              <th scope="col" className="min-w-64 border-b border-foreground/15 p-4">Documented workflow</th>
              <th scope="col" className="min-w-52 border-b border-foreground/15 p-4">Evidence and date</th>
              <th scope="col" className="min-w-64 border-b border-foreground/15 p-4">Limitations</th>
            </tr>
          </thead>
          <tbody>
            {report.rows.map((row) => (
              <tr key={row.product} className="align-top">
                <th scope="row" className="border-b border-foreground/10 p-4 font-serif text-xl">
                  {row.product}
                </th>
                <td className="border-b border-foreground/10 p-4 leading-6">{row.documentedUse}</td>
                <td className="border-b border-foreground/10 p-4 leading-6">
                  <a
                    href={row.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline decoration-primary/40 underline-offset-2"
                  >
                    {row.sourceLabel}
                  </a>
                  <span className="mt-2 block text-xs text-muted-foreground">{row.sourceDate}</span>
                </td>
                <td className="border-b border-foreground/10 p-4 leading-6 text-muted-foreground">
                  {row.limitation}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {report.revisions.length > 0 && (
        <section className="mt-8 border-y border-foreground/15 py-5" aria-labelledby={`history-${reportSlug}`}>
          <h2 id={`history-${reportSlug}`} className="eyebrow text-primary">Previous reviews</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            Superseded descriptions and citations are retained so editors can inspect what changed.
          </p>
          <div className="mt-4 divide-y divide-foreground/10">
            {report.revisions.map((revision) => (
              <details key={revision.recordedOn} className="py-3">
                <summary className="cursor-pointer text-sm font-medium hover:text-primary">
                  Revision recorded {revision.recordedOn}
                </summary>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{revision.summary}</p>
                <div className="mt-4 grid gap-4">
                  {revision.previousRows.map((row) => (
                    <article key={row.product} className="border-l-2 border-accent pl-4">
                      <h3 className="font-serif text-lg">{row.product}</h3>
                      <p className="mt-1 text-sm leading-6">{row.documentedUse}</p>
                      <a
                        href={row.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-sm text-primary underline decoration-primary/40 underline-offset-2"
                      >
                        {row.sourceLabel}
                      </a>
                      <p className="mt-1 text-xs text-muted-foreground">{row.sourceDate}</p>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{row.limitation}</p>
                    </article>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </section>
      )}

      <section className="mt-8 border-y border-foreground/15 py-5">
        <h2 className="eyebrow text-primary">Affiliate disclosure</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          No affiliate links are currently configured on this page. The product links above go to
          vendor documentation and are not commission links.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="font-serif text-3xl">Method and limitations</h2>
        <ul className="mt-4 grid gap-3">
          {report.limitations.map((limitation) => (
            <li key={limitation} className="border-l-2 border-accent pl-4 text-sm leading-6 text-muted-foreground">
              {limitation}
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
