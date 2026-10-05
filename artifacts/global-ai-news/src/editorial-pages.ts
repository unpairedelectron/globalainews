export interface EditorialPageSection {
  heading: string;
  body: string;
}

export interface EditorialPageCopy {
  description: string;
  intro: string;
  sections: EditorialPageSection[];
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
  },
  '/corrections': {
    description: 'How Global AI News distinguishes publication dates, material updates and correction records.',
    intro: 'Accuracy matters more than preserving an earlier version of a claim.',
    sections: [
      { heading: 'What changes on an article', body: 'The site displays publication and update dates separately when a maintained story record supplies both. Research records can display dated update-history entries.' },
      { heading: 'How to report an error', body: 'A public correction inbox has not yet been approved for this publication. This page does not accept submissions and does not promise a response time. The publication owner must supply an approved contact channel before we can publish an actionable correction route.' },
      { heading: 'What we will not claim', body: 'No correction log, response deadline or review workflow is presented as active unless it is implemented and verified.' },
    ],
  },
  '/contact-us': {
    description: 'Public contact details for Global AI News have not been verified.',
    intro: 'A verified public contact address has not been supplied for this publication.',
    sections: [
      { heading: 'Contact details', body: 'This page does not publish an unverified email address or pretend that a contact form is connected to an editorial inbox. The publication owner can provide the approved public contact channel when it is ready.' },
    ],
  },
};

export function getEditorialPageCopy(path: string): EditorialPageCopy {
  return editorialPageCopy[path] ?? editorialPageCopy['/archive'];
}
