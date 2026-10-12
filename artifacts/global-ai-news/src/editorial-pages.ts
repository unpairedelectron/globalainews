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
      { heading: 'What we publish', body: 'The newsroom publishes source-linked stories, research records, maintained reports and data products. Each format is intended to show what is known, how it is supported and where the evidence stops.' },
      { heading: 'How to read the site', body: 'Article pages connect to cited source records. Research and data pages describe their question or scope, methods and limitations. Publication and update dates are shown where the maintained record supplies them.' },
      { heading: 'Who speaks for the publication', body: 'Until individual contributor details are verified for publication, articles are attributed to the Global AI News Editorial Desk rather than to an unverified personal profile.' },
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
      { heading: 'Sourcing', body: 'We link claims to cited source records and identify whether records are primary or independent where the maintained data supports that distinction. A source count alone is not proof of a claim.' },
      { heading: 'Evidence and uncertainty', body: 'We preserve dates, definitions and limitations that affect how a claim should be read. Different operational stages are not treated as equivalent measurements.' },
      { heading: 'Attribution', body: 'We publish personal contributor profiles only after their identity and biography are verified for publication. Until then, the publication desk is the byline.' },
      { heading: 'Corrections and updates', body: 'Publication dates and material update dates are kept distinct. Research records may include a dated update history; an updated date is not a substitute for explaining a correction.' },
      { heading: 'AI-assisted work', body: 'Reported facts, analysis and synthesis should be clearly distinguished. AI assistance does not replace source verification or editorial responsibility.' },
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
      { heading: 'What changes on an article', body: 'The site displays publication and update dates separately when a maintained story record supplies both. Research records can display dated update-history entries.' },
      { heading: 'How to report an error', body: 'No approved public corrections or contact channel is available. This page does not accept submissions; there is no linked inbox or connected form. The Daily Brief subscription is only for newsletter delivery and is not a way to report an issue. A publisher-approved submission route is still needed.' },
      { heading: 'What is not currently promised', body: 'No response time, investigation service or public correction log is presented as active. The publication will not claim those processes exist until their details and delivery path are verified.' },
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
      { heading: 'Contact details', body: 'No public email address or connected contact form is available here. This page does not promise a response time or a contact service.' },
      { heading: 'Editorial feedback and subscriptions', body: 'The Daily Brief signup is only for newsletter delivery. It does not send corrections or editorial feedback to the newsroom, and it is not a substitute for an approved contact route.' },
    ],
    relatedLinks: [
      { label: 'Corrections', href: '/corrections' },
      { label: 'Code of Ethics', href: '/code-of-ethics' },
      { label: 'About Global AI News', href: '/about-us' },
    ],
  },
  '/privacy': {
    description: 'An interim disclosure of the limited newsletter-signup facts currently verified for Global AI News.',
    intro: 'This is a provisional disclosure, not a complete privacy policy. It states only what is visible in the current newsletter signup flow; the publisher has not supplied the remaining policy details.',
    sections: [
      { heading: 'Newsletter signup', body: 'The Daily Brief signup asks for an email address so the publication can manage and deliver the requested newsletter subscription. Do not use that signup to send corrections or general messages.' },
      { heading: 'Details that still need confirmation', body: 'The publisher has not supplied a verified data-controller identity, legal basis, retention period, processor and transfer details, or a route for privacy requests. This page does not make claims about those matters and should be replaced with a complete publisher-approved notice.' },
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
      { heading: 'Publisher terms needed', body: 'No approved terms covering permitted use, intellectual property, liability, or dispute handling were available in the current site settings or maintained records. No terms are invented here; the publisher should replace this notice with approved language.' },
      { heading: 'Questions and updates', body: 'The site currently has no verified public contact channel. The newsletter signup is only for newsletter delivery and does not accept legal or support requests.' },
    ],
    relatedLinks: [
      { label: 'Privacy notice', href: '/privacy' },
      { label: 'Contact', href: '/contact-us' },
    ],
  },
  '/authors': {
    description: 'Current bylines and verified contributor-profile status for Global AI News.',
    intro: 'The current public newsroom snapshot attributes its eight published stories to the Global AI News Editorial Desk. It contains no named individual bylines with verified biographies for a public author profile.',
    sections: [
      { heading: 'Global AI News Editorial Desk', body: 'This organizational byline identifies the publication desk, not a named individual. Individual author pages will be added only when the contributor identity and biography are verified and approved for publication.' },
      { heading: 'Current reporting', body: 'Browse the current public stories in the archive. Scheduled editorial records are not presented as published work.' },
    ],
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
