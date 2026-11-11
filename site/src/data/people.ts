// Real people only. Add someone here only with their consent and a true bio.
// Fictional or composite "staff" must never be added (Google misrepresentation
// policy, Google News transparency rules, AdSense policy).
export interface Person {
  slug: string;
  name: string;
  jobTitle: string;
  location: string;
  bio: string[];
  responsibilities: string[];
  sameAs?: string[];
  image?: string;
}

export const PEOPLE: Record<string, Person> = {
  'aman-mishra': {
    slug: 'aman-mishra',
    name: 'Aman Mishra',
    jobTitle: 'Chief Editor',
    location: 'Pune, India',
    bio: [
      'Aman Mishra is Chief Editor of Global AI News. He is responsible for the publication’s editorial standards and reviews articles against their cited primary sources before publication.',
      'Articles he has personally reviewed carry a “Reviewed by Aman Mishra” credit. Articles without that credit were checked under the automated process described in our editorial policy.',
    ],
    responsibilities: ['Editorial standards and corrections', 'Source and fact verification', 'Review of investigative explainers and policy analysis'],
  },
  'shiv-shakti-mishra': {
    slug: 'shiv-shakti-mishra',
    name: 'Shiv Shakti Mishra',
    jobTitle: 'Publisher',
    location: 'Pune, India',
    bio: [
      'Shiv Shakti Mishra is the publisher of Global AI News, based in Pune, Maharashtra. The publisher is responsible for the publication’s operation, advertising and legal policies.',
    ],
    responsibilities: ['Publishing and operations', 'Advertising and partnerships', 'Privacy and legal policies'],
  },
};

export function personByName(name?: string): Person | undefined {
  if (!name) return undefined;
  return Object.values(PEOPLE).find((p) => p.name.toLowerCase() === name.trim().toLowerCase());
}
