export interface EditorialPageSection {
  heading: string;
  body: string;
}

export interface EditorialPageCopy {
  description: string;
  intro: string;
  sections: EditorialPageSection[];
  relatedLinks?: { label: string; href: string }[];
}

export const editorialPageCopy: Record<string, EditorialPageCopy> = {
  '/archive': {
    description: 'Browse published Global AI News stories by publication date. Draft and scheduled records are excluded.',
    intro: 'The archive lists published stories from the maintained newsroom snapshot. Draft and scheduled records are not included.',
    sections: [],
  },
  '/about-us': {
    description: 'What Global AI News covers and how its reporting connects to sources, research and data.',
    intro: 'Global AI News covers the companies, systems, research and public policy shaping the AI economy.',
    sections: [
      { heading: 'What we cover', body: 'Our coverage follows the people, companies, products, research, policy and infrastructure shaping artificial intelligence. We focus on what changed, the evidence behind the change, and the practical limits of what public information can establish. A claim about a launch, a commitment, a deployment and a measured outcome are not interchangeable; our reporting aims to keep those distinctions visible.' },
      { heading: 'What we publish', body: 'The newsroom publishes reported stories, research records, maintained reports and data products. Stories explain a development and link to supporting source records. Research records describe a question, method, findings and limitations. Data products organize dated observations with units and source trails. Reports, including product comparisons, describe their criteria and limits rather than presenting vendor claims as independent performance tests.' },
      { heading: 'How evidence is presented', body: 'Article citations connect readers to the records used for material claims. Source pages identify the originating publisher and available date or type information. A citation establishes where a claim came from; it does not by itself prove that the claim is accurate. Where a source does not establish an outcome, a complete dataset or a like-for-like comparison, the page should say so.' },
      { heading: 'Dates and revisions', body: 'Publication date and material update date serve different purposes. Published stories display the dates supplied by the maintained newsroom record. Research records can include dated update history, and maintained comparisons preserve superseded descriptions and citations where a material review changes them. These records are not a promise that every page has been reviewed on a fixed schedule.' },
      { heading: 'Who speaks for the publication', body: 'Until individual contributor details are verified for publication, articles are attributed to the Global AI News Editorial Desk rather than to an unverified personal profile. The Authors directory lists public bylines and does not publish unapproved biographies or credentials.' },
      { heading: 'How to use this site', body: 'Use the Reports and Research sections for maintained analysis, the Data section for documented observations, and the Archive to browse published stories. Follow citations to read the source in context, check the displayed dates, and consider each page’s stated limitations before relying on a claim.' },
    ],
    relatedLinks: [
      { label: 'Code of Ethics', href: '/code-of-ethics' },
      { label: 'Corrections', href: '/corrections' },
      { label: 'Contact', href: '/contact-us' },
    ],
  },
  '/code-of-ethics': {
    description: 'Global AI News standards for sourcing, attribution, evidence labels and transparent limitations.',
    intro: 'Our editorial standard is to make important claims checkable and to distinguish evidence from interpretation.',
    sections: [
      { heading: 'Sourcing and attribution', body: 'Material factual claims should be linked to the source record that supports them. We identify the publisher and, where the maintained record supports it, whether a source is primary or independent. We preserve source dates and link to the original public material when available. A source count alone is not proof: several reports repeating one announcement do not necessarily provide several independent confirmations.' },
      { heading: 'Evidence, definitions and uncertainty', body: 'We preserve definitions, dates, units and stated limitations that affect how a claim should be read. Announced capacity, contracted capacity, installed systems, available service and measured use describe different stages. We do not treat them as equivalent measurements unless the underlying source establishes that relationship.' },
      { heading: 'Claims, analysis and estimates', body: 'Readers should be able to distinguish a source’s statement from our description of it and from an editorial inference. Where a figure is an estimate, a report relies on vendor documentation, or the public record does not answer a question, the page should label that boundary instead of presenting an inference as a verified outcome.' },
      { heading: 'Comparisons and product coverage', body: 'A feature comparison based on vendor documentation is not a benchmark of quality, safety, privacy or value. Pages should identify their comparison criteria, source dates, access limits and material caveats. Inclusion is not an endorsement, and a documented feature should not be described as available to every account or region unless the evidence supports that statement.' },
      { heading: 'Attribution and identity', body: 'We publish personal contributor profiles only after their identity and biography are verified for publication. Until then, the publication desk is the byline. We do not infer a contributor’s credentials or role from an unverified name in a source or internal record.' },
      { heading: 'Corrections and updates', body: 'Publication dates and material update dates are kept distinct. Research records may include a dated update history; an updated date is not a substitute for explaining a correction. The public corrections page describes the current limits of the submission process and does not claim an active public corrections log or response service.' },
      { heading: 'AI-assisted work', body: 'AI assistance may support research or drafting, but it does not replace checking source material, reviewing whether a claim is supported, or taking editorial responsibility for published work. Reported facts, analysis and synthesis should remain distinguishable to readers.' },
      { heading: 'Commercial transparency', body: 'Advertising, sponsorship, affiliate relationships and product inclusion should not be presented in ways that imply independent endorsement. Where a page contains a commercial relationship, that relationship should be disclosed clearly on the relevant page. The existence of a vendor link or a product mention does not by itself establish a commission or endorsement.' },
    ],
    relatedLinks: [
      { label: 'About Global AI News', href: '/about-us' },
      { label: 'Corrections', href: '/corrections' },
      { label: 'Contact', href: '/contact-us' },
    ],
  },
  '/corrections': {
    description: 'How Global AI News distinguishes publication dates, material updates and correction records.',
    intro: 'Accuracy matters more than preserving an earlier version of a claim. This page explains the current limits of the public correction route.',
    sections: [
      { heading: 'Corrections, updates and new information', body: 'A correction addresses information that was materially wrong or misleading when published. An update adds later information or reflects a changed record. A new development may warrant a separate story rather than silently changing the account of an earlier event. These distinctions help readers understand whether the evidence changed, the underlying event changed, or the original description needed repair.' },
      { heading: 'What the site currently records', body: 'Published story records can carry a publication date and a separate material update date. Research records can show dated update-history entries, and maintained reports can retain previous descriptions and citations. These features make some changes inspectable, but they are not a complete, site-wide corrections ledger and do not guarantee a full public record for every edit.' },
      { heading: 'How to report an error', body: 'No approved public corrections or contact channel is available. This page does not accept submissions; there is no linked inbox or connected form. The Daily Brief subscription is only for newsletter delivery and is not a way to report an issue. A publisher-approved submission route is still needed. Please do not send private or sensitive information through the newsletter form.' },
      { heading: 'What happens after a report', body: 'Because there is no verified public submission route, this page cannot receive a report, confirm receipt, or provide a case status. No review deadline, investigation service, response time or correction outcome is promised. A contact route and an approved review process must be established before the site can make those commitments.' },
      { heading: 'What is not currently promised', body: 'No response time, investigation service or public correction log is presented as active. The publication will not claim those processes exist until their details and delivery path are verified. The dates and histories visible on particular stories or research records should not be read as evidence that a separate correction was made unless the page explicitly describes it.' },
    ],
    relatedLinks: [
      { label: 'Code of Ethics', href: '/code-of-ethics' },
      { label: 'About Global AI News', href: '/about-us' },
      { label: 'Contact', href: '/contact-us' },
    ],
  },
  '/contact-us': {
    description: 'Global AI News has no approved public contact address or working contact form.',
    intro: 'No approved public contact address or working contact form has been verified. This page cannot accept messages.',
    sections: [
      { heading: 'Contact details', body: 'No public email address or connected contact form is available here. This page cannot accept messages, route a request to a particular person, or confirm delivery. It does not promise a response time or a contact service. A publisher-approved contact channel is required before contact details can be added.' },
      { heading: 'Editorial feedback and corrections', body: 'There is currently no verified public route for general editorial feedback, corrections, source suggestions, or questions about a published page. The Corrections page explains the specific limits of the current error-reporting process. It is a disclosure page, not a working submission form.' },
      { heading: 'Newsletter subscriptions', body: 'The Daily Brief signup is only for newsletter delivery. It asks for an email address to manage the requested subscription; it does not send corrections or editorial feedback to the newsroom, and it is not a substitute for an approved contact route. Do not enter a message or sensitive information into the email field.' },
      { heading: 'Where to find information', body: 'Readers can browse published coverage in the Archive, find source-linked research and data in their dedicated sections, and review the Code of Ethics and Privacy notice for current publication disclosures. These pages provide information but do not create a direct contact channel.' },
      { heading: 'What needs to be approved', body: 'Before this page can offer a contact service, the publisher needs to approve the public contact identity and destination, the kinds of requests that destination accepts, and any response expectations. No address, form, staff identity or service level is inferred or invented here.' },
    ],
    relatedLinks: [
      { label: 'Corrections', href: '/corrections' },
      { label: 'Code of Ethics', href: '/code-of-ethics' },
      { label: 'About Global AI News', href: '/about-us' },
    ],
  },
  '/privacy': {
    description: 'An interim disclosure of the limited newsletter and analytics details currently verified for Global AI News.',
    intro: 'This is a provisional disclosure, not a complete privacy policy. It states only verified details about the current newsletter signup flow and analytics integration; the publisher has not supplied the remaining policy details.',
    sections: [
      { heading: 'What the signup asks for', body: 'The Daily Brief signup asks for an email address so the publication can manage and deliver the requested newsletter subscription. The form is for an email address, not for a message, correction, support request or other personal details. Do not use that signup to send corrections or general messages.' },
      { heading: 'How the subscription request is handled', body: 'When a valid signup is submitted, the site normalizes the email address, records a subscription entry and attempts to pass the address to the configured newsletter delivery service. Depending on the active configuration, the service can be a connected webhook or Resend; when neither is configured, the request remains in the site’s delivery queue. The currently active provider is not identified on this page.' },
      { heading: 'Subscription record and delivery state', body: 'The service records the email address and subscription delivery state so it can recognize an existing subscriber and report whether the request was subscribed or queued. The code also stores the selected provider and may store a provider-side reference. The exact retention period, deletion process and provider-side lifecycle have not been approved for public disclosure.' },
      { heading: 'Other site data and technologies', body: 'The site uses Microsoft Clarity on eligible public pages to help the publication understand how readers interact with the website. Signup, search, and Ask Global input and result areas are marked for masking; editor and account routes, and URLs containing query strings or fragments, are excluded. No custom signup or conversion event is sent to Clarity. The existing platform-injected analytics remains the source for pageview and newsletter-conversion totals. Microsoft documents default masking for input values, numbers, and email addresses. The publisher has not supplied approved details about consent, retention, data transfers, or privacy requests, so this notice makes no claims about those matters.' },
      { heading: 'Details that still need confirmation', body: 'The publisher has not supplied a verified data-controller identity, legal basis, retention period, processor and transfer details, cookie and analytics inventory, or a route for privacy requests. This page does not make claims about those matters and should be replaced with a complete publisher-approved notice.' },
      { heading: 'Privacy requests and newsletter changes', body: 'No approved privacy-request contact route or self-service unsubscribe instructions have been supplied for this page. The newsletter signup itself is not a way to request access, correction, deletion or restriction of personal information. The publisher must provide and verify a working route before the site can direct readers to use one.' },
    ],
    relatedLinks: [
      { label: 'Contact', href: '/contact-us' },
      { label: 'Terms of use', href: '/terms' },
    ],
  },
  '/terms': {
    description: 'Publisher-approved terms of use have not yet been supplied for Global AI News.',
    intro: 'This is a placeholder, not a complete agreement. The publisher has not supplied verified terms governing access to or use of this publication.',
    sections: [
      { heading: 'What this publication contains', body: 'Global AI News publishes reporting, source records, research, data products and maintained reports. Individual pages can include citations, dates, definitions and limitations that are important to interpreting the material. This description explains the site’s content formats; it does not grant or restrict legal rights to reuse them.' },
      { heading: 'Terms that have not been approved', body: 'No approved terms covering permitted use, intellectual property, attribution, warranties, liability, governing law, or dispute handling were available in the current site settings or maintained records. Those topics can have legal consequences, so this page does not invent rules or imply that a complete agreement is in force.' },
      { heading: 'Third-party sources and links', body: 'Stories and reports link to material hosted by publishers, companies and other third parties. The linked material remains subject to its own publisher’s terms and availability. A citation is provided so readers can inspect the source; linking to it does not establish that Global AI News controls it or endorses every statement on it.' },
      { heading: 'Using figures and comparisons', body: 'A figure or product feature should be read with its stated source, date, definition and limitations. A vendor-documented capability is not an independent test, and a dated observation is not necessarily a live inventory. Where a page provides a method or comparison criteria, those notes are part of the context for interpreting the result.' },
      { heading: 'No complete service agreement', body: 'This interim page is not a complete terms-of-use agreement and should not be treated as one. The publisher must approve terms that address rights, responsibilities, legal jurisdiction and dispute handling before the site can represent those conditions as settled.' },
      { heading: 'Questions and updates', body: 'The site currently has no verified public contact channel for legal, support or general requests. The newsletter signup is only for newsletter delivery and does not accept legal or support requests. This page will need publisher review when approved terms and a contact route are available.' },
    ],
    relatedLinks: [
      { label: 'Privacy notice', href: '/privacy' },
      { label: 'Contact', href: '/contact-us' },
    ],
  },
  '/authors': {
    description: 'Current bylines and verified contributor-profile status for Global AI News.',
    intro: 'This directory lists public bylines used on published stories. Individual contributors appear only when their identity and biography are verified and approved for publication. Stories without an approved individual byline use the Global AI News Editorial Desk.',
    sections: [],
    relatedLinks: [
      { label: 'Published archive', href: '/archive' },
      { label: 'About Global AI News', href: '/about-us' },
      { label: 'Code of Ethics', href: '/code-of-ethics' },
    ],
  },
};

export function getEditorialPageCopy(path: string): EditorialPageCopy {
  return editorialPageCopy[path] ?? editorialPageCopy['/archive'];
}
